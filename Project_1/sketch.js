/*

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 

*/

// the worm grows after eating flowers
// after three flowers. the worm becomes a cocoon
// after ten seconds, the cocoon becomes a butterfly
// after ten seconds. the cocoon becomes a butterfly
// clicking the butterfly's atenna changes its color
// eating three more flowers unlocks rainbow colors

// controls the movement of the background
let t = 0;
let light = 150;

// coordinates used to create the butterfly's wings 
let x1, x2, x3, x4;

// offsets that make each wing point move differently
let off1 = 0;
let off2 = 5;
let off3 = 10;
let off4 = 15;

// controls the speed and direction of the wings
let time = 0;
let speed = 0.03;

// stores the position of the worm and butterfly
let x5 = 800;
let x6 = 500;

let count1 = 0.3;
let count2 = 0.6;

// stores where the user clicks on the canvas
let targetX = 0;
let targetY = 0;

// controls the butterfly's floating animation
let flyTime = 0;
let flyX = 0;
let flyY = 0;

// states that determine our Perfu's behavior
let butterfly = false;
let clicked = false;

// controls the appearance and duration of glitches
let glitchTime = 0;
let glitchX = 0;
let glitchY = 0;
let glitchW = 0;
let glitchH = 0;

// stores the colors used for glitches and flowers
let r = 0;
let g = 0;
let b = 0;

// controls the flowers that appear after clicking glitches
let flowerVisible = false;
let flowerX = 0;
let flowerY = 0;

// counts how many flowers each creature has eaten
let flowersEaten = 0;
let butterflyFlowers = 0;

// controls the cocoon transformation
let cocoon = false;
let cocoonStart = 0;

// controls the colors of the butterfly's wings
let wingR = 255;
let wingG = 255;
let wingB = 255;

// determines if the butterfly has unlocked rainbow colors
let rainbow = false;

// sets up the canvas and the initial wing positions
function setup() {
  createCanvas(800, 500);
  noStroke();
  x1 = 0;
  x2 = 0;
  x3 = 0;
  x4 = 0;
}

// draws the moving background, glitches, and creature states
function draw() {
  background(0);
  noStroke();

  // creates changing brightness of static background
  let target = map(noise(t), 0, 1, 80, 255);
  light = lerp(light, target, 0.1);

  // draws small squares to create television static effect
  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 10) {

      // noise creates different shades for each square
      let n = noise(x * 0.05, y * 0.05, t * 3);
      let c = map(n, 0, 1, 0, light);

      // sine and cosine functions create wavy movement of static
      let wave =
        sin(y * 0.05 + t * 5) * 3 +
        cos(y * 0.02 + t * 2) * 3;

      fill(c);
      rect(x + wave, y, 10, 10);
    }
  }

  // black scan lines drawn across screen
  for (let y = 0; y < height; y += 8) {
    fill(0)
    rect(0, y+frameCount % 8, width, 3);
  }
  // time increased to keep the background moving
  t += 0.02;

  // glitches will come when needed
  if (glitchTime == 0 && flowerVisible == false) {

    // prevents new glitches from appearing during the cocoon stage
    if (cocoon == false) {
   
      // random chance of a glitch appearing
      if (random(0, 1000) < 10) {
        glitchW = random(15, 80);
        glitchH = random(5, 30);
        // ensures that the glitch appears within the canvas boundaries
        glitchX = random(110, width - 110 - glitchW);
        glitchY = random(110, height - 110 - glitchH);
        // random colors for the glitch and flower
        r = random(50, 255);
        g = random(50, 255);
        b = random(50, 255);

        // sets the duration of the glitch
        glitchTime = 100;
      }
    }
  }

  // draw glitch when timer is above zero
  if (glitchTime > 0) {
    fill(r, g, b, 180);
    noStroke();
    rect(glitchX, glitchY, glitchW, glitchH);

    // decrease timer until glitch disappears
    glitchTime = glitchTime - 1;
  }

  // updates the buttefly's wing movement
  time = time + speed;

  // reverses the direction when time reaches either limit
  if (time > PI / 2 || time < 0) {
    speed = speed * -1;
  }

  // calculates the four moving points of the wings
  x1 = width / 2 + 100 * sin(time + off1);
  x2 = width / 2 + 100 * sin(time + off2);
  x3 = width / 2 + 100 * sin(time + off3);
  x4 = width / 2 + 100 * sin(time + off4);

  // creates the floating animation after transformation
  if (butterfly == true) {

    flyTime = flyTime + 0.02;

    // makes the butterfly move slightly in both directions
    flyX = sin(flyTime * 0.7) * 25;
    flyY = sin(flyTime * 1.1) * 15;
  }

  // controls the womr before it becomes a cocoon
  if (butterfly == false && cocoon == false) {

    // moves the worm toward the user's selected position
    if (clicked == true) {

      // lerp gradually moves the coordinates toward the target
      // the calculations here account for how x5 and x6 are used to draw the worm and butterfly
      x5 = lerp(x5, (targetX - 2) * 2, 0.04);
      x6 = lerp(x6, (targetY - 30) * 2, 0.04);

      // stops moving toward the target when close enough 
      if (dist(x5 / 2 + 2, x6 / 2 + 30,
               targetX, targetY) < 10) {
        clicked = false;
      }
    } else {
      
      // gives the worm a small wandering movement similar to the butterfly's floating animation
      x5 = x5 + sin(t * 0.8) * 1.2;
      x6 = x6 + cos(t * 0.6) * 1.2;
    }
  }

  // butterfly movement when it is floating and following the click
  if (butterfly == true) {

    if (clicked == true) {

      // moves the butterfly toward the mouse click
      //subtracting flyx and flyy accounts for its floating motion
      x5 = lerp(x5, (targetX - flyX - 2) * 2,0.04 );

      x6 = lerp(x6,(targetY - flyY - 30) * 2,0.04
      );

      // stops the movement when the butterfly reaches its target
      if (dist(x5 / 2 + 2 + flyX,x6 / 2 + 30 + flyY,targetX,targetY) < 10) {

        clicked = false;
      }
    } else {

      // makes the butterfly wander when it is not being controlled by the user
      x5 = x5 + sin(t * 0.8) * 0.8;
      x6 = x6 + cos(t * 0.6) * 0.8;
    }
  }

  // prevents the worm from moving outside the allowed boundaries
  if (butterfly == false) {

    // left boundary
    if (x5 / 2 + 2 < 90) {
      x5 = (90 - 2) * 2;
    }

    // right boundary
    if (x5 / 2 + 2 > width - 90) {
      x5 = (width - 90 - 2) * 2;
    }

    // top boundary
    if (x6 / 2 + 30 < 90) {
      x6 = (90 - 30) * 2;
    }

    // bottom boundary
    if (x6 / 2 + 30 > height - 90) {
      x6 = (height - 90 - 30) * 2;
    }
  }

  // keeps the butterfly inside the canvas while it floats
  if (butterfly == true) {

    // boundaries account for floating animation and size of wings
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

  // calculates the creature's position using x5 and x6
  let bx = x5 / 2 + 2;
  let by = x6 / 2 + 30;

  // checks if the worm or butterfly has reached a flower
  if (flowerVisible == true && cocoon == false) {

    // flower interaction during worm stage
    if (butterfly == false) {

      // checks the distance between worm and flower
      if (dist(bx, by, flowerX, flowerY) < 22) {

        // removes flower and increases counter
        flowerVisible = false;
        flowersEaten = flowersEaten + 1;
        clicked = false;

        // transforms worm after eating three flowers
        if (flowersEaten == 3) {
          cocoon = true;
          cocoonStart = frameCount;
        }
      }

    } else {

      // checks flower collisions during the butterfly stage
      if (dist(bx + flyX, by + flyY,flowerX,flowerY
      ) < 22) {

        flowerVisible = false;
        butterflyFlowers = butterflyFlowers + 1;
        clicked = false;

        // unlocks rainbow colors after three more flowers
        if (butterflyFlowers == 3) {
          rainbow = true;
        }
      }
    }
  }

  // draws the flower when it is visible
  if (flowerVisible == true) {
    flower(flowerX, flowerY);
  }
  
  // shows the red target circle when the creature is following a click
  if (clicked == true && cocoon == false) {
    noStroke();
    fill(255, 0, 0);
    circle(targetX, targetY, 10);
  }
  
  // transforms the worm into a cocoon and then into a butterfly
  if (cocoon == true) {
    
    // shows cocoon instead of worm
    drawCocoon(bx, by);

    // waits 600 frames before transforming into a butterfly
    // at 60 frames per second this is approximately ten seconds
    if (frameCount - cocoonStart >= 600) {
      cocoon = false;
      butterfly = true;
    }
  } else {

    // draws the worm if transformation has not happened
    if (butterfly == false) {
      drawWorm(bx, by);

    } else {
      push();

      // draws the butterfly with its floating animation
      translate(flyX, flyY);
      drawCreature(width / 25, height / 2);
      drawAntenna(bx, by);
      pop();
    }
  }
}

// handles the user's mouse input and interaction with the scene
function mousePressed() {

  // checks whether the user clicked inside a visible glitch area
  if (glitchTime > 0 &&
      mouseX > glitchX &&
      mouseX < glitchX + glitchW &&
      mouseY > glitchY &&
      mouseY < glitchY + glitchH) {

    // replaces the clicked glitch with a flower
    flowerX = glitchX + glitchW / 2;
    flowerY = glitchY + glitchH / 2;
    flowerVisible = true;
    glitchTime = 0;
    clicked = false;

  } else {

    // checks for interactions with the butterfly
    if (butterfly == true) {

      let bx = x5 / 2 + 2;
      let by = x6 / 2 + 30;

      // estimates the position of the butterfly's antenna
      let antennaX = bx + flyX - 12;
      let antennaY = by + flyY + 8;

      // changes the wing color if the antenna is clicked
      if (
        dist(mouseX, mouseY, antennaX + 19, antennaY - 22) < 18
      ) {
        wingR = random(50, 255);
        wingG = random(50, 255);
        wingB = random(50, 255);

      } else {

        // moves the butterfly toward other clicked locations
        targetX = mouseX;
        targetY = mouseY;
        clicked = true;
      }

    } else {

      // lets the user control the worm before transformation
      if (cocoon == false) {
        targetX = mouseX;
        targetY = mouseY;
        clicked = true;
      }
    }
  }
}
// draws the worm using a moving curved line
function drawWorm(x, y) {
  push();
  translate(x, y);
  stroke(255);
  strokeWeight(8);
  noFill();

  // increases the worm's length for each flower eaten
  let wormLength = 25 + flowersEaten * 18;
  beginShape();

  // creates a series of points along the worm's body
  for (let i = -wormLength; i <= wormLength; i += 5) {
   
   // sines function creates the bodey wiggling over time
    vertex(
      i,
      sin(i * 0.18 + frameCount * 0.18) * 4
    );
  }
  endShape();
  pop();
}

// draws the cocoon during the transformation process
function drawCocoon(x, y) {
  push();
  translate(x, y);

  // creates the main oval shape of the cocoon
  stroke(255);
  strokeWeight(3);
  fill(40);
  ellipse(0, 0, 35, 65);

  // below draws small lines to creature texture on the cocoon repeatedly
  stroke(180);
  strokeWeight(1);
  for (let i = -20; i <= 20; i += 10) {
    line(-12, i, 12, i + 8);
  }
  pop();
}

// pushes antennas back when butterfly flutters backward
function backwards() {
  x5 = x5 - count2;
  x6 = x6 + count2;
}

// draws the butterfly's animated wings
function drawCreature(x, y) {
  push();
  translate(x, y);

  // calculates the midpoint of the wing points to center the wings
  let wingMid = (x1 + x2 + x3 + x4) / 4;

  // positions the wings around the butterfly's movement coordinates
  translate(
    (x5 / 2 + 2) - (x + wingMid),
    (x6 / 2 + 30) -
    (y + height - wingMid - 100)
  );
  strokeWeight(10);
  noFill();

  // changes wing colors depending on the rainbow state
  if (rainbow == true) {
    stroke(random(255), random(255), random(255));
  } else {
    stroke(wingR, wingG, wingB);
  }
  // draws the first wing shape using calculated points
  beginShape();
  vertex(x1, height - x4 - 100);
  vertex(x2, height - x3 - 100);
  vertex(x3, height - x2 - 100);
  vertex(x4, height - x1 - 100);
  endShape();
  
  // chooses the color for the second wing shape
  if (rainbow == true) {
    stroke(random(255), random(255), random(255));
  } else {
    stroke(wingR, wingG, wingB);
  }
  // draws a second wing shape with the points rearranged to create a mirrored effect
  beginShape();
  vertex(x4, height - x1 - 100);
  vertex(x2, height - x3 - 100);
  vertex(x3, height - x2 - 100);
  vertex(x1, height - x4 - 100);
  endShape();
  pop();
}

// draws two antennae on the butterfly's head
function drawAntenna(x, y) {
  push();
  // moves the antennae relative to the butterfly's position
  translate(x - 12, y + 8);
  rotate(PI / 3);
  // makes the antennae match the butterfly's current color
  if (rainbow == true) {
    stroke(random(255), random(255), random(255));
  } else {
    stroke(wingR, wingG, wingB);
  }
  // draws the two antennae
  strokeWeight(2);
  line(0, 0, -20, -55);
  line(0, 0, -3, -60);
  pop();
}

// draws a flower at the selected position
function flower(x, y) {
  push();
  translate(x, y);
  
  // red center of the flower drawn
  fill(255, 0, 0);
  noStroke();
  circle(0, 0, 20);

  // uses the color of the glitch for the petals here
  fill(r, g, b);

  // draws eight petals by rotating around the center of the flower
  for (let i = 0; i < 8; i++) {
    rotate(PI / 4);
    ellipse(0, -15, 10, 30);
  }
  pop();
}