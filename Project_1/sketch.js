/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

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
let targetX = 0;
let targetY = 0;
let flyTime = 0;
let flyX = 0;
let flyY = 0;
//boolean states that will update
let butterfly = false;
let clicked = false;
// glitch effect fixed
let glitchTime = 0;
let glitchX = 0;
let glitchY = 0;
let glitchW = 0;
let glitchH = 0;
let r = 0;
let g = 0;
let b = 0;
//specific flower code
let flowerVisible = false;
let flowerX = 0;
let flowerY = 0;
let flowersEaten = 0;
let butterflyFlowers = 0;
// cocoon function
let cocoon = false;
let cocoonStart = 0;
// butterfly's rainbow ability
let wingR = 255;
let wingG = 255;
let wingB = 255;
let rainbow = false;

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
  // static background
  let target = map(noise(t), 0, 1, 80, 255);
  light = lerp(light, target, 0.1);

  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 10) {

      let n = noise(x * 0.05, y * 0.05, t * 3);
      let c = map(n, 0, 1, 0, light);

      let wave =
        sin(y * 0.05 + t * 5) * 3 +
        cos(y * 0.02 + t * 2) * 3;

      fill(c);
      rect(x + wave, y, 10, 10);
    }
  }

  // scan lines
  for (let y = 0; y < height; y += 8) {
    fill(0)
    rect(0, y+frameCount % 8, width, 3);
  }

  t += 0.02;

  // glitches will come when needed
  if (glitchTime == 0 && flowerVisible == false) {

    if (cocoon == false) {

      if (random(0, 1000) < 10) {
        glitchW = random(15, 80);
        glitchH = random(5, 30);
        glitchX = random(110, width - 110 - glitchW);
        glitchY = random(110, height - 110 - glitchH);
        r = random(50, 255);
        g = random(50, 255);
        b = random(50, 255);
        glitchTime = 100;
      }
    }
  }

  // draw glitch
  if (glitchTime > 0) {
    fill(r, g, b, 180);
    noStroke();
    rect(glitchX, glitchY, glitchW, glitchH);
    glitchTime = glitchTime - 1;
  }

  // move butterfly's wings
  time = time + speed;
  if (time > PI / 2 || time < 0) {
    speed = speed * -1;
  }

  x1 = width / 2 + 100 * sin(time + off1);
  x2 = width / 2 + 100 * sin(time + off2);
  x3 = width / 2 + 100 * sin(time + off3);
  x4 = width / 2 + 100 * sin(time + off4);

  // floating butterfly
  if (butterfly == true) {

    flyTime = flyTime + 0.02;

    flyX = sin(flyTime * 0.7) * 25;
    flyY = sin(flyTime * 1.1) * 15;
  }

  // worm movement
  if (butterfly == false && cocoon == false) {

    if (clicked == true) {

      x5 = lerp(x5, (targetX - 2) * 2, 0.04);
      x6 = lerp(x6, (targetY - 30) * 2, 0.04);
      if (dist(x5 / 2 + 2, x6 / 2 + 30,
               targetX, targetY) < 10) {
        clicked = false;
      }
    } else {

      x5 = x5 + sin(t * 0.8) * 1.2;
      x6 = x6 + cos(t * 0.6) * 1.2;
    }
  }

  
  if (butterfly == true) {

    if (clicked == true) {

      x5 = lerp(x5, (targetX - flyX - 2) * 2,0.04 );

      x6 = lerp(x6,(targetY - flyY - 30) * 2,0.04
      );

      if (dist(x5 / 2 + 2 + flyX,x6 / 2 + 30 + flyY,targetX,targetY) < 10) {

        clicked = false;
      }
    } else {
      x5 = x5 + sin(t * 0.8) * 0.8;
      x6 = x6 + cos(t * 0.6) * 0.8;
    }
  }

  // keeping worm in the base
  if (butterfly == false) {

    if (x5 / 2 + 2 < 90) {
      x5 = (90 - 2) * 2;
    }

    if (x5 / 2 + 2 > width - 90) {
      x5 = (width - 90 - 2) * 2;
    }

    if (x6 / 2 + 30 < 90) {
      x6 = (90 - 30) * 2;
    }

    if (x6 / 2 + 30 > height - 90) {
      x6 = (height - 90 - 30) * 2;
    }
  }

  if (butterfly == true) {

    if (x5 / 2 + 2 + flyX < 110) {
      x5 = (110 - flyX - 2) * 2; }
    if (x5 / 2 + 2 + flyX > width - 110) {
      x5 = (width - 110 - flyX - 2) * 2;
    }
    if (x6 / 2 + 30 + flyY < 110) {
      x6 = (110 - flyY - 30) * 2;
    }
    if (x6 / 2 + 30 + flyY > height - 110) {
      x6 = (height - 110 - flyY - 30) * 2;
    }
  }

  let bx = x5 / 2 + 2;
  let by = x6 / 2 + 30;

  if (flowerVisible == true && cocoon == false) {

    if (butterfly == false) {

      if (dist(bx, by, flowerX, flowerY) < 22) {

        flowerVisible = false;
        flowersEaten = flowersEaten + 1;
        clicked = false;

        if (flowersEaten == 3) {
          cocoon = true;
          cocoonStart = frameCount;
        }
      }

    } else {

      if (dist(bx + flyX, by + flyY,flowerX,flowerY
      ) < 22) {

        flowerVisible = false;
        butterflyFlowers = butterflyFlowers + 1;
        clicked = false;

        // THREE MORE FLOWERS = RAINBOW
        if (butterflyFlowers == 3) {
          rainbow = true;
        }
      }
    }
  }

  if (flowerVisible == true) {
    flower(flowerX, flowerY);
  }
  if (clicked == true && cocoon == false) {
    noStroke();
    fill(255, 0, 0);
    circle(targetX, targetY, 10);
  }
  if (cocoon == true) {
    drawCocoon(bx, by);
    if (frameCount - cocoonStart >= 600) {
      cocoon = false;
      butterfly = true;
    }
  } else {
    if (butterfly == false) {
      drawWorm(bx, by);
    } else {
      push();
      translate(flyX, flyY);
      drawCreature(width / 25, height / 2);
      drawAntenna(bx, by);
      pop();
    }
  }
}
function mousePressed() {
  if (glitchTime > 0 &&
      mouseX > glitchX &&
      mouseX < glitchX + glitchW &&
      mouseY > glitchY &&
      mouseY < glitchY + glitchH) {
    flowerX = glitchX + glitchW / 2;
    flowerY = glitchY + glitchH / 2;
    flowerVisible = true;
    glitchTime = 0;
    clicked = false;
  } else {
    if (butterfly == true) {
      let bx = x5 / 2 + 2;
      let by = x6 / 2 + 30;
      let antennaX = bx + flyX - 12;
      let antennaY = by + flyY + 8;
      if (
        dist(mouseX, mouseY, antennaX + 19, antennaY - 22) < 18
      ) {
        wingR = random(50, 255);
        wingG = random(50, 255);
        wingB = random(50, 255);
      } else {
        targetX = mouseX;
        targetY = mouseY;
        clicked = true;
      }
    } else {
      if (cocoon == false) {
        targetX = mouseX;
        targetY = mouseY;
        clicked = true;
      }
    }
  }
}
function drawWorm(x, y) {
  push();
  translate(x, y);
  stroke(255);
  strokeWeight(8);
  noFill();
  let wormLength = 25 + flowersEaten * 18;
  beginShape();
  for (let i = -wormLength; i <= wormLength; i += 5) {
    vertex(
      i,
      sin(i * 0.18 + frameCount * 0.18) * 4
    );
  }
  endShape();
  pop();
}
function drawCocoon(x, y) {
  push();
  translate(x, y);
  stroke(255);
  strokeWeight(3);
  fill(40);
  ellipse(0, 0, 35, 65);
  stroke(180);
  strokeWeight(1);
  for (let i = -20; i <= 20; i += 10) {
    line(-12, i, 12, i + 8);
  }
  pop();
}
function backwards() {
  x5 = x5 - count2;
  x6 = x6 + count2;
}
function drawCreature(x, y) {
  push();
  translate(x, y);
  let wingMid = (x1 + x2 + x3 + x4) / 4;
  translate(
    (x5 / 2 + 2) - (x + wingMid),
    (x6 / 2 + 30) -
    (y + height - wingMid - 100)
  );
  strokeWeight(10);
  noFill();
  if (rainbow == true) {
    stroke(random(255), random(255), random(255));
  } else {
    stroke(wingR, wingG, wingB);
  }
  beginShape();
  vertex(x1, height - x4 - 100);
  vertex(x2, height - x3 - 100);
  vertex(x3, height - x2 - 100);
  vertex(x4, height - x1 - 100);
  endShape();
  if (rainbow == true) {
    stroke(random(255), random(255), random(255));
  } else {
    stroke(wingR, wingG, wingB);
  }
  beginShape();
  vertex(x4, height - x1 - 100);
  vertex(x2, height - x3 - 100);
  vertex(x3, height - x2 - 100);
  vertex(x1, height - x4 - 100);
  endShape();
  pop();
}
function drawAntenna(x, y) {
  push();
  translate(x - 12, y + 8);
  rotate(PI / 3);
  if (rainbow == true) {
    stroke(random(255), random(255), random(255));
  } else {
    stroke(wingR, wingG, wingB);
  }
  strokeWeight(2);
  line(0, 0, -20, -55);
  line(0, 0, -3, -60);
  pop();
}
function flower(x, y) {
  push();
  translate(x, y);
  fill(255, 0, 0);
  noStroke();
  circle(0, 0, 20);
  fill(r, g, b);
  for (let i = 0; i < 8; i++) {
    rotate(PI / 4);
    ellipse(0, -15, 10, 30);
  }
  pop();
}