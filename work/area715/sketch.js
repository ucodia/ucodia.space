// area 715 by lionel ringenbach @ ucodia.io

var posX;
var posY;
var capRotation;
var rotationInc;
var borderWeight;
var weightInc;
var maxColor;
var colorCursor;
var borderCursor;
var overlay;
var mirror;
var posLock;
var borderAuto;
var paused;

var canvas;
var cap;
var capWidth;
var capWidth;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);

  // gather url paramters to initialize the sketch
  var params = getURLParams();

  // defaults
  posX = params.x ? JSON.parse(params.x) : 0;
  posY = params.y ? JSON.parse(params.y) : 0;
  capRotation = params.rot ? JSON.parse(params.rot) : 0;
  rotationInc = TWO_PI / 180;
  borderWeight = 3;
  weightInc = 0.5;
  maxColor = 100;
  colorCursor = new Looper(0, maxColor);
  borderCursor = new Looper(0, 10);
  overlay = params.overlay ? params.overlay : "rect";
  mirror = params.mirror ? params.mirror : "hv";
  posLock = params.hasOwnProperty("x") || params.hasOwnProperty("y");
  borderAuto = params.beat ? JSON.parse(params.beat) : false;
  paused = false;

  init();
}

function init() {
  colorMode(HSB, maxColor);
  frameRate(30);

  if (mirror === "hv") {
    capWidth = width / 2;
    capHeight = height / 2;
  }
  else if (mirror === "h") {
    capWidth = width;
    capHeight = height / 2;
  }
  else if (mirror === "v") {
    capWidth = width / 2;
    capHeight = height;
  }
  cap = createImage(capWidth, capHeight);
}

function draw() {
  background(0);

  project();
  input();

  if (!paused) {
    graphics();
    capture();
  }
}

function project() {
  image(cap, 0, 0);

  push();

  if (mirror === "hv") {
    translate(width, 0);
    scale(-1, 1);
    image(cap, 0, 0);

    translate(0, height);
    scale(1, -1);
    image(cap, 0, 0);

    translate(width, 0);
    scale(-1 ,1);
    image(cap, 0, 0);
  }
  else if (mirror === "h") {
    translate(0, height);
    scale(1, -1);
    image(cap, 0, 0);
  }
  else if (mirror === "v") {
    translate(width, 0);
    scale(-1, 1);
    image(cap, 0, 0);
  }

  pop();
}

function capture() {
  var capX = posX - capWidth / 2;
  var capY = posY - capHeight / 2;
  cap = get(capX, capY, capWidth, capHeight);
}

function graphics() {
  push();

  translate(posX, posY);
  rotate(capRotation);
  translate(-posX, -posY);

  stroke(colorCursor.next(), maxColor * 0.6, maxColor * 0.8);
  strokeWeight(borderAuto ? borderCursor.next() / 10 : borderWeight);
  noFill();

  if (overlay == "rect") {
    rectMode(CENTER);
    rect(posX, posY, capWidth, capHeight);
  }
  else if (overlay == "equi") {
    equi(posX, posY, height / 2 * 0.8);
  }
  else if (overlay == "circ") {
    ellipse(posX, posY, capHeight, capHeight);
  }

  pop();
}

// input hooks

function input() {
  if (!posLock) {
    posX = mouseX;
    posY = mouseY;
  }

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

  if (keyPressed) {
    if (key.toLowerCase() === "r")
      saveCanvas("capture-" + getTimestamp(), "png");
  };
}

function keyPressed() {
  var k = key.toLowerCase();

  if (k === "w")
    borderAuto = !borderAuto;
  else if (k === "l")
    posLock = !posLock;
  else if (k === "c")
    copyToClipboard(setURLParams(getParams()));
  else if (k === " ")
    paused = !paused;
}

function mouseWheel(event) {
  borderWeight += event.delta * weightInc;

  if (borderWeight < 0)
  	borderWeight = 0;
}

// other stuff

function getParams() {
  var params = {
    x: posX,
    y: posY,
    rot: Number(capRotation.toFixed(2)),
    border: borderWeight,
    overlay: overlay,
    mirror: mirror
  };

  if (borderAuto) params.beat = true;

  return params;
}

function buildURL(params) {
  var paramString = Object.keys(params).map(function(key) {
    return key + '=' + params[key];
  }).join('&');

  return location.origin + location.pathname + "?" + paramString;
}

function setURLParams(params) {
  var oldState = getURLParams();
  var url = buildURL(params);

  try {
    history.pushState(oldState, "", url);
  }
  catch (e) {
  }

  return url;
}

function copyToClipboard(text) {
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  init();
}

function getTimestamp() {
  return new Date().toISOString().split("-").join("")
                                 .split("T").join("-")
                                 .split(":").join("");
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
