// portal by lionel ringenbach @ ucodia.space

var donuts = [];
var resolution = 256;
var inc, centerX, centerY;

function setup() {
  createCanvas();
  layout();
  init();

  inc = TWO_PI / 360;

  $(document).on('dblclick', function() {
    screenfull.toggle();
  })
}

function layout() {
  resizeCanvas(window.innerWidth, window.innerHeight)
  centerX = width / 2;
  centerY = height / 2;
}

function init() {
  for (var i = 0; i < 2; i++) {
    var points = [];

    for (var j = 0; j < resolution; j++)
      points[j] = TWO_PI / resolution * j;

    donuts[i] = createDonut(points, getOffset(), width * 0.4);
  }
}

function draw() {
  background(0);

  for (var i = 0;  i < donuts.length; i++) {
    var invert = i % 2 !== 0;

    // update inner circle position
    donuts[i].offset = getOffset();

    var donut = donuts[i];
    var r = (donut.r + donut.offset) / 2;
    var d = donut.r - r;

    for (var j = 0; j < donut.points.length; j++) {
      var point = donut.points[j];
      var p = pointOnCircle(centerX, centerY, point, d);
      var c = (TWO_PI / resolution * 3 * j) % TWO_PI;

      colorMode(HSB, TWO_PI, 1, 1, 1);
      stroke(c, 1, 1, 0.8);
      strokeWeight(0.5);
      noFill();

      if (invert)
        arc(p.x, p.y, r, r, point, point + PI);
      else
        arc(p.x, p.y, r, r, point + PI, point);

      // animate and normalize
      if (invert)
        donut.points[j] += inc;
      else
        donut.points[j] -= inc;     
      donut.points[j] = donut.points[j] % TWO_PI;
    }
  }
}

function createDonut(points, offset, r) {
  return {
    points: points,
    offset: offset,
    r: r
  }
}

function getOffset() {
  return map(mouseX, 0, width, 0, width * 4);
}

function windowResized() {
	layout();
}

function pointOnCircle(x, y, angle, radius) {
  return {
    x: radius * cos(angle) + x,
    y: radius * sin(angle) + y
  };
}