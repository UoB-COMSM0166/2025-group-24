function setup() {
  createCanvas(400, 300);
  background(255, 200, 200);
}

function draw() {
  if (mouseIsPressed) {
    noStroke();
    ellipse(mouseX, mouseY, 20, 30);
    fill(random(150, 250), 255, 255, 150);
    let speed = dist(pmouseX, pmouseY, mouseX, mouseY);
    strokeWeight(speed / 3);
    stroke(255, 210, 0);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function keyPressed() {
  if (key == ' ') {
    background(255, 200, 200);
  }
}
