/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

//constrain background so butterfly doesnt leave
// cocoon after worm eats for like 10 seconds
// touch antenna = butterfly color changing?
//  worm eats multiple ones to get longer THEN butterfly

let t = 0;
let light = 150;
let x1, x2, x3, x4;
let off1 = 0;
let off2 = 5;
let off3 = 10;
let off4 = 15;
let time = 0;
let speed = 0.03;
let x5 = 800;
let x6 = 500;
let count1 = 0.3;
let count2 = 0.6;
let butterfly = false;
let clicked = false;
let targetX = 0;
let targetY = 0;
let flyTime = 0;
// FIX-COLORED-BLOCKS
let glitchTime = 0;
let glitchX = 0;
let glitchY = 0;
let glitchW = 0;
let glitchH = 0;
let r = 0;
let g = 0;
let b = 0;

function setup() {
  createCanvas(800, 500);
  noStroke();

  x1 = 0;
  x2 = 0;
  x3 = 0;
  x4 = 0;
}

function draw() {
  background(0);
  noStroke();

  // TV STATIC
  let target = map(noise(t), 0, 1, 80, 255);
  light = lerp(light, target, 0.1);

  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 10) {

      let n = noise(x * 0.05, y * 0.05, t * 3);
      let c = map(n, 0, 1, 0, light);

      let wave = sin(y * 0.05 + t * 5) *+ cos(y * 0.02 + t * 2) * 3;

      fill(c);
      rect(x + wave, y, 10, 10);
    }
  }

  // SCAN LINES
  for (let y = 0; y < height; y += 8) {
    fill(0, 60);
    rect(0, y, width, 2);
  }

  t += 0.02;

  // FIX LATER
  if (glitchTime == 0) {
    if (random(0, 1000) < 3) {

      glitchX = random(0, width);
      glitchY = random(0, height);
      glitchW = random(15, 80);
      glitchH = random(5, 30);
      r = random(50, 255);
      g = random(50, 255);
      b = random(50, 255);

      glitchTime = 100;
    }
  }

  if (glitchTime > 0) {
    noStroke();
    fill(r, g, b, 180);
    rect(glitchX, glitchY, glitchW, glitchH);

    glitchTime = glitchTime - 1;
  }

  // BUTTERFLY WING MOVEMENT
  time = time + speed;

  if (time > PI / 2 || time < 0) {
    speed = speed * -1;
  }

  x1 = width / 2 + 100 * sin(time + off1);
  x2 = width / 2 + 100 * sin(time + off2);
   x3 = width / 2 + 100 * sin(time + off3);
   x4 = width / 2 + 100 * sin(time + off4);

  let bx = x5 / 2 + 2;
   let by = x6 / 2 + 30;
  if (butterfly == false) {

    if (clicked == true) {

     
      x5 = lerp(x5, (targetX - 2) * 2, 0.04);
    x6 = lerp(x6, (targetY - 30) * 2, 0.04);

    
      if (dist(x5/2 + 2, x6/2 + 30,
               targetX, targetY) < 15) {

        butterfly = true;
        clicked = false;
      }

    } else {

 
 x5 = x5 + sin(t * 0.8) * 1.2;
 x6 = x6 + cos(t * 0.6) * 1.2;

    }

  } else {


    let cycle = frameCount % 107;

    if (cycle < 92) {

      if (frameCount < 5) {
        x5 = x5 + count1;
        x6 = x6 - count1;
      } else {
        x5 = x5 + count2;
        x6 = x6 - count2;
      }

      if (cycle > 44) {
        backwards();
        backwards();
      }
    }
  }

  bx = x5 / 2 + 2;
  by = x6 / 2 + 30;
  if (clicked == true) {
    noStroke();
    fill(255, 0, 0);
    circle(targetX, targetY, 30);
  }


  if (butterfly == false) {

    drawWorm(bx, by);

  } else {


    flyTime = flyTime + 0.02;

    let flyX = sin(flyTime * 0.7) * 140;
    let flyY = sin(flyTime * 1.1) * 75;

    push()
    translate(flyX, flyY);

    drawCreature(width / 25, height / 2);
    drawAntenna(bx, by);

    pop()
  }
}


function mousePressed() {
  if (butterfly == false) {
    targetX = mouseX;
    targetY = mouseY;
    clicked = true;
  }
}

function drawWorm(x, y) {
  push()
  translate(x, y);

  stroke(255);
  strokeWeight(8);
  noFill();

  beginShape()

  for (let i = -25; i <= 25; i += 5) {
    vertex(i, sin(i * 0.18 + frameCount * 0.18) * 4);
  }

  endShape()

  pop()
}

function backwards() {
  x5 = x5 - count2;
  x6 = x6 + count2;
}

function drawCreature(x, y) {
  push()
  translate(x, y);

  let wingMid = (x1 + x2 + x3 + x4) / 4;

  translate(
    (x5/2 + 2) - (x + wingMid),
    (x6/2 + 30) - (y + height - wingMid - 100)
  );

  stroke(255)
  strokeWeight(10)
  noFill()

  beginShape();
    vertex(x1, height - x4 - 100);
   vertex(x2, height - x3 - 100);
  vertex(x3, height - x2 - 100);
  vertex(x4, height - x1 - 100);
  endShape();

  beginShape()
  vertex(x4, height - x1 - 100);
  vertex(x2, height - x3 - 100);
  vertex(x3, height - x2 - 100);
  vertex(x1, height - x4 - 100);
  endShape()

  pop()
}

// ANTENNAS
function drawAntenna(x, y) {
  push()

  translate(x - 12, y + 8);
  rotate(PI / 3);

  stroke(255);
  strokeWeight(2);

  line(0, 0, -20, -55);
  line(0, 0, -3, -60);

  pop()
}

