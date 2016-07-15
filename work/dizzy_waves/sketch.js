// dizzy waves by lionel ringenbach @ ucodia.space

// params
var spacing = 70;
var overflow = 4;
var amp = 4;
var maxColor = 100000;
var nColors = 16;

// globals
var columns;
var rows;
var refGrid;
var grid;

// cursors
var moveCursor;
var colorCursor;

// controls
var panel;
var colorSlider;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  colorMode(HSB, maxColor);
  noStroke();

  // setup
  columns = parseInt(width / spacing) + overflow;
  rows = parseInt(height / spacing) + overflow;
  refGrid = generateGrid(columns, rows, spacing);
  grid = generateGrid(columns, rows, spacing);
  moveCursor = new Oscillator(-spacing, spacing);
  colorCursor = new Looper(0, maxColor);

  // panel
  colorSlider = createSlider(1, 64, 16);
  panel = select('#panel');
  panel.child(colorSlider);
}

function draw() {
  background(maxColor, 0, maxColor);
  translate(-spacing, -spacing);

  // update value from panel
  nColors = colorSlider.value();

  // draw connections
  for (var i = 0; i < grid.length - 1; i++) {
    for (var j = 0; j < grid[i].length - 1; j++) {
      var pos = grid[i][j];
      var posBR = grid[i + 1][j + 1];
      var posXOR = createVector(0, 0);

      if ((i % 2 === 0) == (j % 2 === 0))
        posXOR = grid[i + 1][j];
      else
        posXOR = grid[i][j + 1];

      var newColor = colorCursor.next();
      var selector = (i + j) % nColors;
      if (selector !== 0)
        newColor = (newColor + (maxColor / nColors) * (nColors - selector)) % maxColor;

      fill(newColor, maxColor, maxColor);
      triangle(pos.x, pos.y, posBR.x, posBR.y, posXOR.x, posXOR.y);
    }
  }

  // generate movement
  var nextMoveValue = moveCursor.next() / amp;
  var nextMove = createVector(nextMoveValue, -nextMoveValue);

  // move grid
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      var refPos = refGrid[i][j];
      var pos;

      if (j % 2 === 0)
        pos = createVector(refPos.x - nextMove.x, refPos.y - nextMove.y);
        //pos = p5.Vector.sub(refPos, nextMove);
      else
        pos = createVector(refPos.x + nextMove.x, refPos.y + nextMove.y);
        //pos = p5.Vector.add(refPos, nextMove);

      grid[i][j] = pos;
    }
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function generateGrid(columns, rows, spacing) {
  var grid = [];

  for (var i = 0; i < columns; i++) {
    grid[i] = [];

    for (var j = 0; j < rows; j++) {
      grid[i][j] = createVector(i * spacing, j * spacing);
    }
  }

  return grid;
}

// perpetual cursors

function Oscillator(start, end) {
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
    this.inc = -this.inc;
  };
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
