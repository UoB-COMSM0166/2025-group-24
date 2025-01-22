let colorPicker; 
let currentColor; 
let eraserButton; 
let isEraser = false; 

function setup() {
  createCanvas(400, 300);
  background(255, 200, 200);

  colorPicker = createColorPicker('#ff0000'); 
  colorPicker.position(10, 10); 
  currentColor = colorPicker.color(); 

  
  eraserButton = createButton('Eraser');
  eraserButton.position(100, 10); 
  eraserButton.mousePressed(() => {
    isEraser = !isEraser; 
    if (isEraser) {
      eraserButton.html('Brush'); 
    } else {
      eraserButton.html('Eraser'); 
    }
  });
}

function draw() {
  if (!isEraser) {
    currentColor = colorPicker.color(); 
  }

  if (mouseIsPressed) {
    if (isEraser) {
      fill(255, 200, 200);
      noStroke();
      ellipse(mouseX, mouseY, 30, 30); 
    } else {
      noStroke();
      fill(currentColor); 
      ellipse(mouseX, mouseY, 20, 30);

      let speed = dist(pmouseX, pmouseY, mouseX, mouseY);
      strokeWeight(speed / 3);
      stroke(currentColor); 
      line(pmouseX, pmouseY, mouseX, mouseY);
    }
  }
}

function keyPressed() {
  if (key == ' ') {
    background(255, 200, 200); 
  }
}
