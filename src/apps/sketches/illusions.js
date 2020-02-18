import { debounce } from "lodash";

export const meta = {
  name: "Illusions",
  year: "201?"
};

export default p5 => {
  var n = 3;
  var shapes = [];
  var bands = [];
  var backColor = 0;
  var foreColor = 255;
  var size = 0;
  var space = 0;
  var speed = 7;

  const efficientLayout = () => debounce(layout, 400);

  function layout() {
    p5.noLoop();
    p5.resizeCanvas(window.innerWidth, window.innerHeight);

    size = p5.width * 0.1;
    space = (p5.width - size * n) / (n + 1);

    var baseY = p5.height / 2;

    for (let i = 0; i < n; i++) {
      const baseX = (space + size) * (i + 1) - size / 2;
      shapes[i] = { x: baseX, y: baseY, form: i };
    }

    for (let i = 0; i < n + 2; i++) {
      const baseX = (space + size) * i - space / 2 - size;
      bands[i] = { x: baseX, y: baseY };
    }
    p5.loop();
  }

  p5.setup = () => {
    p5.createCanvas(100, 100);
    p5.frameRate(30);
    p5.rectMode(p5.CENTER);

    layout();
  };

  p5.draw = () => {
    p5.background(backColor);

    // draw bands
    for (let i = 0; i < bands.length; i++) {
      const band = bands[i];

      p5.noStroke();
      p5.fill(foreColor);
      p5.rect(band.x, band.y, size * 0.7, p5.height);
    }

    // draw shapes
    for (let i = 0; i < shapes.length; i++) {
      var shape = shapes[i];

      p5.strokeWeight(size * 0.15);
      p5.stroke(backColor);
      p5.noFill();

      if (shape.form === 0) p5.rect(shape.x, shape.y, size, size);
      else if (shape.form === 1) p5.ellipse(shape.x, shape.y, size, size);
      else if (shape.form === 2) equi(shape.x, shape.y, size, 1);
    }

    // animate bands and shapes
    for (let i = 0; i < bands.length; i++) {
      const band = bands[i];

      band.x += speed;

      if (band.x >= p5.width + size + space / 2) {
        band.x = -(size + space / 2);
        shiftShapes();
      }
    }
  };

  function shiftShapes() {
    for (let i = 0; i < shapes.length; i++) {
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

  p5.touchStarted = () => {
    invert();
    return false;
  };

  p5.windowResized = () => {
    efficientLayout();
  };

  // utilities

  function equi(x, y, size, mode) {
    // the mode changes vertical centering
    var m = mode | 0;
    var h = triHeight(size, size / 2);
    var h3 = h / 3;

    var x1 = x;
    var x2 = x - size / 2;
    var x3 = x + size / 2;
    var y1, y2, y3;

    if (m === 0) {
      y1 = y - 2 * h3;
      y2 = y + h3;
      y3 = y + h3;
    } else {
      y1 = y - h / 2;
      y2 = y + h / 2;
      y3 = y + h / 2;
    }

    p5.triangle(x1, y1, x2, y2, x3, y3);
  }

  function triHeight(hypo, a) {
    return p5.sqrt(p5.pow(hypo, 2) - p5.pow(a, 2));
  }
};
