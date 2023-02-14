import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  name: "CMY Dance",
  created: "2023-02-12",
};

const cmyDance = (sketch) => {
  let t = 0;
  let inc = 1 / 4;
  const n = 16;
  const params = [
    [
      [1 / 10, 300, 1 / 5, 1, 1 / 10, -100, 1 / 4, 4],
      [1 / 10, 500, 1 / 1, 11, 1 / 20, 100, 1 / 12, 200],
    ],
    [
      [1 / 10, 300, 1 / 5, 10, 1 / 10, 100, 1 / 4, 4],
      [1 / 30, 200, 1 / 10, 100, 1 / 20, 100, 1 / 12, 300],
    ],
    [
      [1 / 10, 300, 1 / 50, 10, 1 / 30, -200, 1 / 12, 40],
      [1 / 30, 500, 1 / 12, 11, 1 / 10, 50, 1 / 12, 200],
    ],
  ];
  const [realWidth, realHeight] = getRealSize(params);
  const alpha = 150;
  const palette = [
    [0, 174, 239, alpha],
    [255, 242, 0, alpha],
    [236, 0, 140, alpha],
  ];

  let realScale = 1;
  let scaleOffset = 0.1;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

    autoStretchP5(sketch, () => {
      realScale =
        1 / Math.max(realWidth / sketch.width, realHeight / sketch.height);
    });
  };

  sketch.draw = () => {
    sketch.clear();
    sketch.background(0);
    sketch.translate(sketch.width / 2, sketch.height / 2);
    sketch.scale(realScale - scaleOffset);
    sketch.stroke(0);
    sketch.strokeWeight(5);

    for (let i = 0; i < n; i++) {
      const tInc = i * 1.5;
      for (let j = 0; j < params.length; j++) {
        sketch.stroke(sketch.color(...palette[j % palette.length]));
        sketch.line(
          ...getPoint(...params[j][0], t + tInc),
          ...getPoint(...params[j][1], t + tInc)
        );
      }
    }

    if (sketch.mouseIsPressed) {
      inc = sketch.map(sketch.mouseX, 0, sketch.width, -1, 1);
    }
    t += inc;
  };

  sketch.keyPressed = () => {
    switch (sketch.key) {
      case "s": {
        sketch.save(`cmy-dance-${Math.round(t)}.png`);
        break;
      }
      default: {
      }
    }
  };

  function getPoint(t1, f1, t2, f2, t3, f3, t4, f4, t) {
    return [
      Math.sin(t * t1) * f1 + Math.sin(t * t2) * f2,
      Math.cos(t * t3) * f3 + Math.cos(t * t4) * f4,
    ];
  }

  function getRealSize(params) {
    let maxX = 0;
    let maxY = 0;

    for (let i = 1; i < 1000; i++) {
      for (let j = 0; j < params.length; j++) {
        const [x1, y1] = getPoint(...params[j][0], i);
        const [x2, y2] = getPoint(...params[j][1], i);
        maxX = Math.max(maxX, x1, x2);
        maxY = Math.max(maxY, y1, y2);
      }
    }

    return [maxX * 2, maxY * 2];
  }
};

export default cmyDance;
