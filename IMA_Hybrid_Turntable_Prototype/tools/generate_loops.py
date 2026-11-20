"""Make four short, fully original demo WAV files; only dependency is NumPy.

Run from the project root: python3 tools/generate_loops.py
"""

from pathlib import Path
import wave

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SAMPLE_RATE = 22050
RNG = np.random.default_rng(20261120)


def hz(midi: int) -> float:
    return 440.0 * 2.0 ** ((midi - 69) / 12)


def put_tone(target, time_s, duration, midi, amp, style="pad"):
    begin = int(time_s * SAMPLE_RATE)
    count = min(int(duration * SAMPLE_RATE), len(target) - begin)
    if begin < 0 or count <= 0:
        return
    t = np.arange(count) / SAMPLE_RATE
    f = hz(midi)
    if style == "pad":
        wave_data = (np.sin(2 * np.pi * f * t) * 0.85
                     + np.sin(2 * np.pi * f * 2 * t) * 0.11
                     + np.sin(2 * np.pi * f * 3 * t) * 0.04)
        envelope = np.minimum(t / 0.20, 1.0) * np.minimum((duration - t) / 0.20, 1.0)
        envelope *= 0.83 + 0.17 * np.sin(2 * np.pi * 0.35 * t)
    elif style == "rhodes":
        wave_data = (np.sin(2 * np.pi * f * t)
                     + 0.35 * np.exp(-t * 7) * np.sin(2 * np.pi * f * 3.01 * t))
        envelope = np.minimum(t / 0.009, 1.0) * np.exp(-t * 2.0)
        envelope *= np.minimum((duration - t) / 0.10, 1.0)
    elif style == "bass":
        wave_data = np.sin(2 * np.pi * f * t) + 0.15 * np.sin(2 * np.pi * 2 * f * t)
        envelope = np.minimum(t / 0.006, 1.0) * np.exp(-t * 2.0)
        envelope *= np.minimum((duration - t) / 0.06, 1.0)
    else:  # bright glitch pulse
        wave_data = np.tanh(1.7 * (np.sin(2 * np.pi * f * t)
                                  + 0.24 * np.sin(2 * np.pi * 3 * f * t)))
        envelope = np.minimum(t / 0.004, 1.0) * np.exp(-t * 7.5)
    target[begin:begin + count] += wave_data * envelope.clip(0, 1) * amp


def put_kick(target, time_s, amp=0.35):
    begin = int(time_s * SAMPLE_RATE)
    count = min(int(SAMPLE_RATE * 0.32), len(target) - begin)
    if count <= 0:
        return
    t = np.arange(count) / SAMPLE_RATE
    phase = 2 * np.pi * (44 * t + 48 * (1 - np.exp(-t * 22)) / 22)
    sound = np.sin(phase) * np.exp(-t * 15)
    sound *= np.minimum(1, t / 0.003)
    target[begin:begin + count] += sound * amp


def put_snare(target, time_s, amp=0.24):
    begin = int(time_s * SAMPLE_RATE)
    count = min(int(SAMPLE_RATE * 0.22), len(target) - begin)
    if count <= 0:
        return
    t = np.arange(count) / SAMPLE_RATE
    noise = RNG.normal(0, 1, count)
    noise = noise - np.convolve(noise, np.ones(7) / 7, mode="same")
    sound = (noise * 0.55 + np.sin(2 * np.pi * 170 * t) * 0.45) * np.exp(-t * 19)
    target[begin:begin + count] += sound * amp


def put_hat(target, time_s, amp=0.045):
    begin = int(time_s * SAMPLE_RATE)
    count = min(int(SAMPLE_RATE * 0.07), len(target) - begin)
    if count <= 0:
        return
    t = np.arange(count) / SAMPLE_RATE
    noise = RNG.normal(0, 1, count)
    noise = np.concatenate(([noise[0]], np.diff(noise)))
    target[begin:begin + count] += noise * np.exp(-t * 48) * amp


def write_wav(name, data, loop=True):
    # Short fades prevent clicks where the audio loops around.
    data = np.tanh(data * 1.3)
    fade_n = int(SAMPLE_RATE * (0.025 if loop else 0.008))
    data[:fade_n] *= np.linspace(0, 1, fade_n)
    data[-fade_n:] *= np.linspace(1, 0, fade_n)
    peak = max(float(np.max(np.abs(data))), 1e-6)
    data = (data / peak * 0.75 * 32767).astype("<i2")
    ASSETS.mkdir(parents=True, exist_ok=True)
    with wave.open(str(ASSETS / name), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(SAMPLE_RATE)
        output.writeframes(data.tobytes())
    print(f"created {name} ({len(data) / SAMPLE_RATE:.2f}s)")


def make_loop(name, bpm, style, chords):
    beat = 60 / bpm
    duration = 16 * beat
    out = np.zeros(round(duration * SAMPLE_RATE), dtype=np.float64)

    for bar, chord in enumerate(chords):
        start = bar * 4 * beat
        if style == "ambient":
            for n in chord:
                put_tone(out, start, 4 * beat - 0.01, n, 0.09, "pad")
            put_tone(out, start + 2 * beat, 1.4 * beat, chord[-1] + 12, 0.036, "rhodes")
            put_tone(out, start, 2 * beat, chord[0] - 12, 0.11, "bass")

        elif style == "lofi":
            for n in chord:
                put_tone(out, start, 1.8 * beat, n, 0.068, "rhodes")
                put_tone(out, start + 2.25 * beat, 1.0 * beat, n, 0.038, "rhodes")
            for b in [0, 2.0, 3.5]:
                put_tone(out, start + b * beat, 0.75 * beat, chord[0] - 12, 0.20, "bass")
            for b in [0, 2.75]:
                put_kick(out, start + b * beat)
            for b in [1, 3]:
                put_snare(out, start + b * beat)
            for b in range(8):
                put_hat(out, start + b * beat / 2 + (0.07 * beat if b % 2 else 0), 0.045)

        elif style == "glitch":
            for b in [0, 1.5, 2, 3.25]:
                put_kick(out, start + b * beat, 0.39)
            for b in [1, 3]:
                put_snare(out, start + b * beat, 0.33)
            for b in range(16):
                if (b + bar) % 5 != 0:
                    put_hat(out, start + b * beat / 4, 0.057 if b % 4 == 0 else 0.027)
            for b in [0, 0.75, 2, 2.75, 3.5]:
                put_tone(out, start + b * beat, 0.35 * beat,
                         chord[(int(b * 4) + bar) % len(chord)] + 12,
                         0.075, "glitch")
            for b in [0, 1.5, 2.5]:
                put_tone(out, start + b * beat, 0.55 * beat, chord[0] - 12, 0.23, "bass")

    write_wav(name, out)


def main():
    make_loop("blue_hour.wav", 72, "ambient", [
        [60, 64, 67, 71], [57, 60, 64, 67],
        [65, 69, 72, 76], [67, 71, 74, 77]
    ])
    make_loop("soft_static.wav", 88, "lofi", [
        [57, 60, 64, 67], [62, 65, 69, 72],
        [65, 69, 72, 76], [64, 68, 71, 74]
    ])
    make_loop("signal_loss.wav", 120, "glitch", [
        [48, 49, 55, 58], [49, 53, 56, 60],
        [53, 56, 60, 63], [55, 58, 61, 65]
    ])
    clap = np.zeros(round(SAMPLE_RATE * 0.27))
    put_snare(clap, 0, 0.9)
    put_hat(clap, 0.023, 0.14)
    write_wav("clap.wav", clap, loop=False)


if __name__ == "__main__":
    main()
