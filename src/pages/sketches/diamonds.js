import autoStretchP5 from "@/utils/auto-stretch-p5";

export const meta = {
  name: "Diamonds",
  created: "2014-11-14",
  renderer: "u5",
};

const diamonds = (sketch, n = 3, transparent = false) => {
  let diams = [];
  const palette = [
    "rgba(0, 174, 239, 0.2)", // cyan
    "rgba(255, 242, 0, 0.2)", // yellow
    "rgba(236, 0, 140, 0.2)", // magenta
  ];
  const spaceRatio = 0.2;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.noStroke();
    autoStretchP5(sketch, layout);
  };

  function layout() {
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
  }

  sketch.draw = () => {
    sketch.clear();

    if (!transparent) {
      sketch.background("#ffffff");
    }

    for (let i = 0; i < n; ++i) {
      diams[i].draw();
      diams[i].move();
    }
  };

  function createDiamond(x, y, radius, sides, offset) {
    if (!x) x = 0;
    if (!y) y = 0;
    if (!radius) radius = 100;
    if (!sides) sides = 8;
    if (!offset) offset = 0;

    const inc = 1 / 1000;
    let position = sketch.constrain(offset, 0, 1);

    return {
      draw: function () {
        const facets = diamond(x, y, radius, sides, position, palette);
        for (let i = 0; i < facets.length; i++) {
          const facet = facets[i];
          sketch.fill(palette[facet.color]);
          sketch.triangle(...facet.points);
        }
      },
      move: function () {
        position += inc;
        if (position > 1) position = position % 1;
      },
      pos() {
        return position;
      },
    };
  }

  function diamond(
    x = 0,
    y = 0,
    radius = 1,
    pointCount = 8,
    offset = 0,
    colorCount = 3
  ) {
    const baseAngle = sketch.map(offset, 0, 1, 0, sketch.TWO_PI);

    const points = [];
    for (let i = 0; i < pointCount; i++) {
      let startAngle = baseAngle + (sketch.TWO_PI / pointCount) * i;
      let addedAngle = i % 2 === 0 ? 0 : baseAngle;
      points[i] = pointOnCircle(x, y, startAngle + addedAngle, radius);
    }

    const facets = [];
    for (let i = 0; i < points.length; i++) {
      const c = i % colorCount.length;
      for (let j = 0; j < points.length; j++) {
        if (i !== j) {
          let p1 = points[i];
          let p2 = points[j];
          facets.push({ color: c, points: [x, y, p1.x, p1.y, p2.x, p2.y] });
        }
      }
    }

    return facets;
  }

  function pointOnCircle(x, y, angle, radius) {
    return {
      x: radius * Math.cos(angle) + x,
      y: radius * Math.sin(angle) + y,
    };
  }
};

export const singleDiamond = (sketch) => diamonds(sketch, 1, true);
export default diamonds;
