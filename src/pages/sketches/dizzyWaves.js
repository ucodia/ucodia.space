import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  name: "Dizzy Waves",
  created: "2015",
};

const dizzyWaves = (sketch) => {
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

  sketch.setup = () => {
    sketch.createCanvas(100, 100);
    sketch.colorMode(sketch.HSB, maxColor);
    sketch.noStroke();

    autoStretchP5(sketch);

    // setup
    columns = parseInt(sketch.width / spacing) + overflow;
    rows = parseInt(sketch.height / spacing) + overflow;
    refGrid = generateGrid(columns, rows, spacing);
    grid = generateGrid(columns, rows, spacing);
    moveCursor = new Oscillator(-spacing, spacing);
    colorCursor = new Looper(0, maxColor);
  };

  sketch.draw = () => {
    sketch.background(maxColor, 0, maxColor);
    sketch.translate(-spacing, -spacing);

    if (sketch.mouseIsPressed) {
      const bounds =
        sketch.width >= sketch.height
          ? { current: sketch.mouseX, max: sketch.width }
          : { current: sketch.mouseY, max: sketch.height };
      nColors = sketch.floor(sketch.map(bounds.current, 0, bounds.max, 1, 256));
    }

    // draw connections
    for (let i = 0; i < grid.length - 1; i++) {
      for (let j = 0; j < grid[i].length - 1; j++) {
        let pos = grid[i][j];
        var posBR = grid[i + 1][j + 1];
        var posXOR = sketch.createVector(0, 0);

        if ((i % 2 === 0) === (j % 2 === 0)) posXOR = grid[i + 1][j];
        else posXOR = grid[i][j + 1];

        var newColor = colorCursor.next();
        var selector = (i + j) % nColors;
        if (selector !== 0)
          newColor =
            (newColor + (maxColor / nColors) * (nColors - selector)) % maxColor;

        sketch.fill(newColor, maxColor, maxColor);
        sketch.triangle(pos.x, pos.y, posBR.x, posBR.y, posXOR.x, posXOR.y);
      }
    }

    // generate movement
    var nextMoveValue = moveCursor.next() / amp;
    var nextMove = sketch.createVector(nextMoveValue, -nextMoveValue);

    // move grid
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[i].length; j++) {
        var refPos = refGrid[i][j];
        let pos;

        if (j % 2 === 0)
          pos = sketch.createVector(
            refPos.x - nextMove.x,
            refPos.y - nextMove.y
          );
        //pos = sketch.Vector.sub(refPos, nextMove);
        else
          pos = sketch.createVector(
            refPos.x + nextMove.x,
            refPos.y + nextMove.y
          );
        //pos = sketch.Vector.add(refPos, nextMove);

        grid[i][j] = pos;
      }
    }
  };

  function generateGrid(columns, rows, spacing) {
    var grid = [];

    for (var i = 0; i < columns; i++) {
      grid[i] = [];

      for (var j = 0; j < rows; j++) {
        grid[i][j] = sketch.createVector(i * spacing, j * spacing);
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

    this.peek = function () {
      return this.current;
    };

    this.next = function () {
      this.current += this.inc;

      if (this.current === this.start || this.current === this.end) {
        this.reset();
      }

      return this.current;
    };

    this.reset = function () {
      this.inc = -this.inc;
    };
  }

  function Looper(start, end) {
    this.start = start;
    this.end = end;
    this.current = start;
    this.inc = start < end ? 1 : -1;

    this.peek = function () {
      return this.current;
    };

    this.next = function () {
      this.current += this.inc;

      if (this.current === this.start || this.current === this.end) {
        this.reset();
      }

      return this.current;
    };

    this.reset = function () {
      this.current = this.start;
    };
  }
};

export default dizzyWaves;
