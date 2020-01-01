// diamonds by lionel ringenbach @ ucodia.space

const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};

let n = 3;
let start = 1;
let spaceRatio = 0.2;
let diams = [];
let paused = false;
const efficientLayout = debounce(layout, 400);

function setup() {
  createCanvas();
  frameRate(30);

  layout();
}

function layout() {
  paused = true;
  resizeCanvas(window.innerWidth, window.innerHeight);

  const isHorizontal = width >= height;

  let spacing = isHorizontal
    ? (width * spaceRatio) / (n + 1)
    : (height * spaceRatio) / (n + 1);
  let r = isHorizontal
    ? (width * (1 - spaceRatio)) / (n * 2)
    : (height * (1 - spaceRatio)) / (n * 2);

  for (let i = 0; i < n; i++) {
    let c1 = (i + 1) * spacing;
    let c2 = 2 * r * i + r;
    let baseX = isHorizontal ? c1 + c2 : width / 2;
    let baseY = isHorizontal ? height / 2 : c1 + c2;

    let offset = (i + 1) * 0.25;
    if (diams[i]) offset = diams[i].pos();

    diams[i] = createDiamond(baseX, baseY, r, 8, offset);
  }

  paused = false;
}

function draw() {
  if (paused) return;

  background(255);
  noStroke();

  for (let i = 0; i < n; ++i) {
    diams[i].draw();
    diams[i].move();
  }
}

function windowResized() {
  efficientLayout();
}

function createDiamond(x, y, radius, sides, offset, inc, palette) {
  if (!x) x = 0;
  if (!y) y = 0;
  if (!radius) radius = 100;
  if (!sides) sides = 8;
  if (!offset) offset = 0;
  if (!palette) {
    palette = [
      color(0, 174, 239, 50), // cyan
      color(255, 242, 0, 50), // yellow
      color(236, 0, 140, 50)
    ]; // magenta
  }
  if (!inc) inc = 1 / 1000;

  let position = constrain(offset, 0, 1);

  return {
    draw: function() {
      diamond(x, y, radius, sides, position, palette);
    },
    move: function() {
      position += inc;
      if (position > 1) position = position % 1;
    },
    pos() {
      return position;
    }
  };
}

function diamond(x, y, radius, sides, offset, palette) {
  if (!offset) offset = 0;
  let points = [];

  // map percentage to radian
  baseAngle = map(offset, 0, 1, 0, TWO_PI);

  for (let i = 0; i < sides; i++) {
    let startAngle = baseAngle + (TWO_PI / sides) * i;
    let addedAngle = i % 2 === 0 ? 0 : baseAngle;
    points[i] = pointOnCircle(x, y, startAngle + addedAngle, radius);
  }

  for (let i = 0; i < points.length; i++) {
    // select color from palette
    let sel = i % palette.length;
    fill(palette[sel]);

    for (let j = 0; j < points.length; j++) {
      if (i != j) {
        let p1 = points[i];
        let p2 = points[j];
        triangle(x, y, p1.x, p1.y, p2.x, p2.y);
      }
    }
  }
}

function pointOnCircle(x, y, angle, radius) {
  return {
    x: radius * cos(angle) + x,
    y: radius * sin(angle) + y
  };
}
