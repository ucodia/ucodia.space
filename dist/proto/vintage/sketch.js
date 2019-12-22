// vintage by lionel ringenbach @ ucodia.space

let t = 0;
let a = 0;
let b = 0;
const n = 100;
const maxSpeed = 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
}

function draw() {
  a = map(mouseY, 0, height, 0.5, 1.5);
  b = map(mouseX, 0, height, 0.5, 1.5);

  background(0);
  translate(width / 2, height / 2);
  strokeWeight(2);

  for (let i = 0; i < n; i++) {
    const color = map(i, 0, 360, 0, n * 2);
    stroke(color, 80, 80, 0.9);
    const inc = i * 0.5;
    line(x1(t + inc), y1(t + inc), x2(t + inc), y2(t + inc));
  }

  for (let i = 0; i < n; i++) {
    const color = map(i, 360, 0, 0, n * 2);
    stroke(color, 80, 80, 0.9);
    const inc = i * 0.5;
    line(x3(t + inc), y3(t + inc), x4(t + inc), y4(t + inc));
  }

  // t += map(mouseX, 0, width, -maxSpeed, maxSpeed);
  t += 0.5;
}

function x1(t) {
  return sin(t / 10) * 400 + sin((t / 10) * b) * 20 * a;
}

function y1(t) {
  return cos(t / 10 / a) * 100 * b;
}

function x2(t) {
  return sin(t / 10) * 300 * a + (sin(t) * 2) / b;
}

function y2(t) {
  return cos(t / 20) * 100 + (cos(t / 12) * 200 * b) / a;
}

function x3(t) {
  return sin(t / 5) * 200 * a + sin(t / 7) * 50;
}

function y3(t) {
  return cos(t / 10) * 300 * a;
}

function x4(t) {
  return sin(t / 10) * 300 * b + sin(t / 45) * 2;
}

function y4(t) {
  return cos(t / 20 / b) * 100 + cos(t / 19) * 200;
}
