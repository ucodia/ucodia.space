// clocks by lionel ringenbach @ ucodia.space

var clocks, colors, state;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // refresh once per second
  // frameRate(1);

  // setup states
  clocks = [
    fadeClock
  ];
  colors = [
    "#000000", // black
    "#ffffff", // white
    "#fdd000", // yellow
    "#888888", // grey
  ];
  state = {
    clock: clocks[0],
    palette: [colors[1], colors[2], colors[1]]
  };
}

function draw() {
  state.clock();
}

function nextClock() {
  var index = clocks.indexOf(state.clock);
  state.clock = clocks[(index + 1) % clocks.length];
  state.clock();
}

function windowResized() {
  state.clock();
}

function mousePressed() {
  nextClock();
}

// clocks
/////////

function drawPies(x, y, size, res, offset) {
  var c1 = color(state.palette[1]);
  var c2 = color(state.palette[2]);

  fill(c2);
  noStroke();
  ellipse(x, y, size, size);

  var cursor = offset;
  var aInc = TWO_PI / res;

  for (var i = 0; i < res; i++) {
    var startA = (cursor * aInc - HALF_PI + TWO_PI) % TWO_PI;
    var opacity = map(i, 0, res - 1, 255, 0);
    c1.setAlpha(opacity);

    fill(c1);
    stroke(c2);
    strokeWeight(5);
    noStroke();
    arc(x, y, size, size, startA, startA + aInc);

    cursor = ++cursor % res;
  }
}

function fadeClock() {
  background(state.palette[0]);

  var time = new Date();
  var sInc = min(width, height) * 0.9 / 3;
  var x = width / 2;
  var y = height / 2;

  drawPies(x, y, sInc * 3, 60, time.getSeconds());
  drawPies(x, y, sInc * 2, 60, time.getMinutes());
  drawPies(x, y, sInc, 24, time.getHours());
}

// utilities
////////////

function pointOnCircle(x, y, t, r) {
  return {
    x: r * cos(t) + x,
    y: r * sin(t) + y
  };
}