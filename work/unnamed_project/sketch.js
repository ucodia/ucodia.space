// unnamed project by lionel ringenbach @ ucodia.io

var capRotation;
var rotationInc;
var borderWeight;
var weightInc;
var maxColor;
var colorCursor;
var borderCursor;
var borderAuto = false;
var paused = false;

var canvas;
var cap;
var capWidth;
var capWidth;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);

  // defaults
  capRotation = 0;
  rotationInc = TWO_PI / 180;
  borderWeight = 3;
  weightInc = 0.5;
  maxColor = 100;
  colorCursor = new Looper(0, maxColor);
  borderCursor = new Looper(0, 10);
  
  colorMode(HSB, maxColor);
  
  init();
}

function init() {
  capWidth = width / 2;
  capHeight = height / 2;
  cap = createImage(capWidth, capHeight);
}

function draw() {
  background(0);
  
  project();
  input();

  if (!paused)
    capture();
}

function project() {
  image(cap, 0, 0);
  
  push();

  translate(width, 0);
  scale(-1, 1);
  image(cap, 0, 0);

  translate(0, height);
  scale(1, -1);
  image(cap, 0, 0);

  translate(width, 0);
  scale(-1 ,1);
  image(cap, 0, 0);

  pop();
}

function capture() {
  push();
  
  stroke(colorCursor.next(), maxColor * 0.6, maxColor * 0.8);
  strokeWeight(borderAuto ? borderCursor.next() / 10 : borderWeight);
  noFill();
  
  translate(mouseX, mouseY);
  rotate(capRotation);
  translate(-mouseX, -mouseY);
  
  var capX = mouseX - capWidth / 2;
  var capY = mouseY - capHeight / 2;
  
  rect(capX, capY, capWidth, capHeight);
  cap = get(capX, capY, capWidth, capHeight);
  
  pop();
}

// input hooks

function input() {
  if (mouseIsPressed) {
    if (mouseButton == LEFT)
			capRotation -= rotationInc;
		else
			capRotation += rotationInc;

		if (capRotation < 0)
			capRotation = TWO_PI + capRotation;
		else if (capRotation > TWO_PI)
			capRotation = TWO_PI - capRotation;
  }
  
  if (keyIsPressed) {
    if (key === "r")
      saveCanvas("capture-" + getTimestamp(), "png");
    else if (key === "w")
      borderAuto = !borderAuto;
  }
}

function keyPressed() {
  if (key === " ")
    paused = !paused;
}

function mouseWheel(event) {
  borderWeight += event.delta * weightInc;

  if (borderWeight < 0)
  	borderWeight = 0;
}

// other stuff

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  init();
}

function getTimestamp() {
  return new Date().toISOString().split("-").join("")
                                 .split("T").join("-")
                                 .split(":").join("")
                                 .substring(0, 15);
}

function Looper(start, end) {
  this.start = start;
  this.end = end;
  this.current = start;
  this.inc = start < end ? 1 : -1;

  this.peek = function() {
    return this.current;
  };

  this.next = function() {
    this.current += this.inc;

    if (this.current == this.start || this.current == this.end) {
        this.reset();
    }

    return this.current;
  };

  this.reset = function() {
    this.current = this.start;
  };
}