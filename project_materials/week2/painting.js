let colorPicker; 
let currentColor; 
let eraserButton; 
let isEraser = false; 
let sizeSlider; 
let brushSize = 20; 

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

  sizeSlider = createSlider(5, 50, 20); 
  sizeSlider.position(200, 10); 
}

function draw() {
  if (!isEraser) {
    currentColor = colorPicker.color(); 
  }

  brushSize = sizeSlider.value();

  if (mouseIsPressed) {
    if (isEraser) {
      fill(255, 200, 200); 
      noStroke();
      ellipse(mouseX, mouseY, brushSize, brushSize); 
    } else {
      noStroke();
      fill(currentColor); 
      ellipse(mouseX, mouseY, brushSize, brushSize); 

      let speed = dist(pmouseX, pmouseY, mouseX, mouseY);
      strokeWeight(speed / 2);
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
