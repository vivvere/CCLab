// original images
let scannedImages = [];
let croppedImages = [];

// animation variables
let currentImage = 0;
let timer = 0;

async function setup() {
  createCanvas(800, 500);

  // load all images first
  const imagePromises = [];
  for (let i = 0; i < 6; i++) {
    imagePromises.push(loadImage("assets/image" + i + ".png"));
  }
  scannedImages = await Promise.all(imagePromises);

  // crop parts of images
  // how to use: crop(imageArray, x, y, width, height);
  croppedImages = crop(scannedImages, 10, 3435, 185, 73);

  // keep enlarged images sharp
  noSmooth();
}

function draw() {
  background(255);

  if (croppedImages.length === 0) {
    return;
  }

  // show the current image
  image(croppedImages[currentImage], 100, 100, 555, 219);

  // animation timer
  timer++;

  // change images every 12 frames
  if (timer >= 12) {
    timer = 0;
    currentImage++;

    // restart animation after the last image
    if (currentImage >= croppedImages.length) {
      currentImage = 0;
    }
  }

  // display the mouse position
  push();
  let txt = round(mouseX) + ", " + round(mouseY);
  fill(0, 255, 0);
  text(txt, mouseX, mouseY);
  pop();
}













// IMAGE PROCESSING FUNCTIONS
// You shouldn't need to modify these helper functions:
function crop(images, x, y, width, height) {
  const croppedImages = [];

  for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
    croppedImages.push(images[imageIndex].get(x, y, width, height));
  }

  return croppedImages;
}

function eraseBackground(images, threshold = 10) {
  for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
    const currentImage = images[imageIndex];
    currentImage.loadPixels();

    for (let pixelIndex = 0; pixelIndex < currentImage.pixels.length; pixelIndex += 4) {
      let distanceFromWhite = 255 - currentImage.pixels[pixelIndex];
      distanceFromWhite += 255 - currentImage.pixels[pixelIndex + 1];
      distanceFromWhite += 255 - currentImage.pixels[pixelIndex + 2];

      if (distanceFromWhite < threshold) {
        currentImage.pixels[pixelIndex + 3] = 0;
      }
    }

    currentImage.updatePixels();
  }
  // this function uses the pixels array
  // we will cover this later in the semester - stay tuned :D
}
