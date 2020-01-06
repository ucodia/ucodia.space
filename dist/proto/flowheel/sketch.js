// flowheel by lionel ringenbach @ ucodia.space

var currentTime = setMidnight(new Date());
currentTime.setDate(1);
var data = [];
var position = 0;
var resolution = 24;
var colors = [
  "#000000", // black
  "#ffffff", // white
  "#fdd000", // yellow
  "#888888", // grey
]
var palette = [colors[1], colors[2], colors[1]];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(10);

  // init
  var yesterday = new Date(currentTime);
  yesterday.setDate(yesterday.getDate() - 1);
  data = getFullDayData(yesterday, resolution);
}

function draw() {
  background(palette[0]);
  fill(palette[1]);
  stroke(palette[2]);
  strokeWeight(5);
  strokeJoin(BEVEL);
  wheel(data);
  
  textFont('Courier New', height * 0.05);
  var dateText = currentTime.getFullYear() + '_' +
                 pad(currentTime.getMonth() + 1, 2) + '_' +
                 pad(currentTime.getDate(), 2);
  var hourText = pad(currentTime.getHours(), 2) + '_' +
                 pad(currentTime.getMinutes(), 2);
  var textPos = min(width, height) * 0.05;
  textAlign(LEFT);
  text(dateText, textPos, height - textPos);
  textAlign(RIGHT);
  text(hourText, width - textPos, height - textPos);

  // compute increment, pick next datum and insert it in place
  var inc = 1440 / resolution;
  currentTime.setMinutes(currentTime.getMinutes() + inc)
  var nextDatum = getData(currentTime);
  data[position % data.length] = nextDatum;  
  position++;
}

function wheel(data) {
  var minR = min(width, height) * 0.3;
  var maxR = min(width, height) * 0.9;

  for (var i = 0; i < data.length; i++) {
    beginShape();
    var a1 = TWO_PI / data.length * i - HALF_PI;
    var a2 = TWO_PI / data.length * (i + 1) -HALF_PI;
    var d1 = data[i];
    var d2 = data[(i + 1) % data.length]; // use '% data.length' to avoid overflow
    var r1 = map(d1[0], 0, 1, minR / 2, maxR / 2);
    var r2 = map(d2[0], 0, 1, minR / 2, maxR / 2);
    var p1 = pointOnCircle(width / 2, height / 2, a1, r1);
    var p2 = pointOnCircle(width / 2, height / 2, a2, r2);
    vertex(p1.x, p1.y);
    vertex(p2.x, p2.y);
    vertex(width / 2, height / 2);
    endShape(CLOSE);
  }
}

function nextPalette() {
  for (var i = 0; i < palette.length; i++) {
    palette[i] = colors[getRandomIntInclusive(0, colors.length - 1)];
  }
}

function getFullDayData(date, resolution) {
  resolution = resolution || 1440;
  var cursor = setMidnight(new Date(date));
  var data = [];

  for (var i = 0; i < resolution; i++) {
    var offset = i * 1440 / resolution;
    cursor.setMinutes(cursor.getMinutes() + offset);
    data[i] = getData(cursor);
  }

  return data;
}

function setMidnight(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

function getData(date) {
  var flowTime = flowtime.fromDate(date);
  return [
    map(flowTime.getHours(), 0, 23, 0, 1),
    map(flowTime.getMinutes(), 0, 59, 0, 1)
  ]
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  nextPalette();
}

function pointOnCircle(x, y, angle, radius) {
  return {
    x: radius * cos(angle) + x,
    y: radius * sin(angle) + y
  };
}

function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}