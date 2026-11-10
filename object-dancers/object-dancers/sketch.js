/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  createCanvas(windowWidth, windowHeight);

  // ...except to adjust the dancer's name on the next line:
  dancer = new sans(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class sans {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.dance = 0;
  }

  update() {
    this.dance += 0.1;
  }

  display() {
    push();
    translate(this.x + sin(this.dance) * 15, this.y);

    let move = sin(this.dance) * 12;

    // Legs
    stroke(255);
    strokeWeight(7);
    line(-12, 25, -20 + move, 55);
    line(12, 25, 20 - move, 55);

    // Arms 
    stroke(40, 100, 255);
    strokeWeight(10);
    line(-20, -10, -40, -20 + move);
    line(20, -10, 40, -20 - move);

    // Signture hoodie
    noStroke();
    fill(30, 90, 200);
    rect(-23, -25, 46, 55, 10);

    // White shirt
    fill(255);
    rect(-8, -20, 16, 40);

    // Black shorts
    fill(0);
    rect(-20, 20, 40, 15);

    // Skull head
    fill(255);
    rect(-26, -70, 52, 45, 12);

    // EYes
    fill(0);
    ellipse(-12, -50, 14, 17);
    ellipse(12, -50, 14, 17);

    // Mouth
    rect(-13, -35, 26, 4, 2);

    pop();
  }
}





/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/