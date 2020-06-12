import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  name: "Diamonds",
  year: "2014"
};

const sketchFn = (sketch, n = 3, spaceRatio = 0.2) => {
  let diams = [];
  let paused = false;

  sketch.setup = () => {
    sketch.createCanvas(100, 100);
    sketch.frameRate(30);

    autoStretchP5(sketch, layout);
  };

  function layout() {
    paused = true;

    const isHorizontal = sketch.width >= sketch.height;

    let spacing = isHorizontal
      ? (sketch.width * spaceRatio) / (n + 1)
      : (sketch.height * spaceRatio) / (n + 1);
    let r = isHorizontal
      ? (sketch.width * (1 - spaceRatio)) / (n * 2)
      : (sketch.height * (1 - spaceRatio)) / (n * 2);

    for (let i = 0; i < n; i++) {
      let c1 = (i + 1) * spacing;
      let c2 = 2 * r * i + r;
      let baseX = isHorizontal ? c1 + c2 : sketch.width / 2;
      let baseY = isHorizontal ? sketch.height / 2 : c1 + c2;

      let offset = (i + 1) * 0.25;
      if (diams[i]) offset = diams[i].pos();

      diams[i] = createDiamond(baseX, baseY, r, 8, offset);
    }

    paused = false;
  }

  sketch.draw = () => {
    if (paused) return;

    sketch.clear();
    sketch.noStroke();

    for (let i = 0; i < n; ++i) {
      diams[i].draw();
      diams[i].move();
    }
  };

  function createDiamond(x, y, radius, sides, offset, inc, palette) {
    if (!x) x = 0;
    if (!y) y = 0;
    if (!radius) radius = 100;
    if (!sides) sides = 8;
    if (!offset) offset = 0;
    if (!palette) {
      palette = [
        sketch.color(0, 174, 239, 50), // cyan
        sketch.color(255, 242, 0, 50), // yellow
        sketch.color(236, 0, 140, 50) // magenta
      ];
    }
    if (!inc) inc = 1 / 1000;

    let position = sketch.constrain(offset, 0, 1);

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
    const baseAngle = sketch.map(offset, 0, 1, 0, sketch.TWO_PI);

    for (let i = 0; i < sides; i++) {
      let startAngle = baseAngle + (sketch.TWO_PI / sides) * i;
      let addedAngle = i % 2 === 0 ? 0 : baseAngle;
      points[i] = pointOnCircle(x, y, startAngle + addedAngle, radius);
    }

    for (let i = 0; i < points.length; i++) {
      // select color from palette
      let sel = i % palette.length;
      sketch.fill(palette[sel]);

      for (let j = 0; j < points.length; j++) {
        if (i !== j) {
          let p1 = points[i];
          let p2 = points[j];
          sketch.triangle(x, y, p1.x, p1.y, p2.x, p2.y);
        }
      }
    }
  }

  function pointOnCircle(x, y, angle, radius) {
    return {
      x: radius * sketch.cos(angle) + x,
      y: radius * sketch.sin(angle) + y
    };
  }
};

export const singleDiamond = sketch => sketchFn(sketch, 1, 0);
export default sketch => sketchFn(sketch);
