
let hallway;
let moveStuds = 0;
let monster;

function setup() {
  createCanvas(1000, 600);
  hallway = new Hallway();
}


function draw() {
  background(0);

  
  if (keyIsDown('w')) {
    hallway.move();
  }

  if (keyIsDown('s')) {
   
  hallway.show();}}



class Hallway {
  constructor() {
    this.distance = 0;
  }

  move() {
    if (this.distance < 100) {
      this.distance = this.distance + 0.5;
    }
  }

  show() {
    let doorWidth = 70 + this.distance * 2;
    let doorHeight = 100 + this.distance * 3;

    let doorX = width / 2 - doorWidth / 2;
    let doorY = height / 2 - doorHeight / 2;

    // Door
    fill(50);
    rect(doorX, doorY, doorWidth, doorHeight);

    // Left wall
    fill(200, 200, 200);
    rect(0, 0, doorX, height);

    // Right wall
    fill(200, 200, 200);
    rect(doorX + doorWidth, 0,
         width - (doorX + doorWidth), height);

    // Ceiling
    fill(200, 200, 200);
    rect(0, 0, width, doorY);

    // Floor
    fill(200, 200, 200);
    rect(0, doorY + doorHeight,
         width, height - (doorY + doorHeight));
  }
}
