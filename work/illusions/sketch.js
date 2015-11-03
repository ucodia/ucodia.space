// illusions by lionel ringenbach @ ucodia.io

var n = 3;
var shapes = [];
var bands = [];
var backColor = 0;
var foreColor = 255;
var size = 0;
var space = 0;
var speed = 7;
var paused = false;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(30);
  rectMode(CENTER);

  init();
}

function init() {
  paused = false;  
  size = width * 0.1;
  space = (width - (size * n)) / (n + 1);
  
  var baseY = height / 2;

  for (var i = 0; i < n; i++) {
  	var baseX = (space + size) * (i + 1) - size / 2;
  	shapes[i] = { x: baseX, y: baseY, form: i };
  }
  
  for (var i = 0; i < n + 2; i++) {
    var baseX = (space + size) * (i) - space / 2 - size;
    bands[i] = { x: baseX, y: baseY };
  }
}

function draw() {
  if (paused)
    return;
  
  background(backColor);
  
  // draw bands
  for (var i = 0; i < bands.length; i++) {
    var band = bands[i];
    
    noStroke();
    fill(foreColor);
    rect(band.x, band.y, size * 0.7, height);
  }
  
  // draw shapes
  for (var i = 0; i < shapes.length; i++) {
    var shape = shapes[i];
    
    strokeWeight(size * 0.15);
    stroke(backColor);
    noFill();
    
    if (shape.form == 0)
      rect(shape.x, shape.y, size, size);    
    else if (shape.form == 1)
      ellipse(shape.x, shape.y, size, size); 
    else if (shape.form == 2)
      equi(shape.x, shape.y, size, 1);
  }
  
  // animate bands and shapes
  for (var i = 0; i < bands.length; i++) {
    var band = bands[i];
    
    band.x += speed;
    
    if (band.x >= width + size + (space / 2)) {
      band.x = -(size + (space / 2));
      shiftShapes();
    }
  }
}

function shiftShapes() {
  for (var i = 0; i < shapes.length; i++) {
    var shape = shapes[i];
    shape.form = (shape.form + 1) % 3;
  }
}

function invert() {
  var temp = backColor;
  backColor = foreColor;
  foreColor = temp;
}

// event hooks

function touchStarted() {
    invert();   
    return false;
}

function keyPressed() {
  if (key === " ")
    paused = !paused;
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  init();
}

// utilities

function equi(x, y, size, mode) {
  // the mode changes vertical centering
  var m = mode | 0;
  var h = triHeight(size, size / 2);
  var h3 = h / 3;
 
  var x1 = x;
  var x2 = x - size / 2;
  var x3 = x + size / 2;
  
  if (mode == 0) {
    var y1 = y - 2 * h3;
    var y2 = y + h3;
    var y3 = y + h3;
  }
  else {
    var y1 = y - h / 2;
    var y2 = y + h / 2;
    var y3 = y + h / 2;
  }
 
  triangle(x1, y1, x2, y2, x3, y3);
}
 
function triHeight(hypo, a) {
  return sqrt(pow(hypo, 2) - pow(a, 2));
}