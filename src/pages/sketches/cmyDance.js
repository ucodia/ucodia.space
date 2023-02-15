import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  name: "CMY Dance",
  created: "2023-02-12",
};

const paramsSet = [
  [
    [
      [1 / 10, 1 / 5, 1 / 10, 1 / 4, 300, 1, -100, 4],
      [1 / 10, 1 / 10, 1 / 20, 1 / 20, 500, 11, 100, 200],
    ],
    [
      [1 / 10, 1 / 5, 1 / 10, 1 / 4, 300, 10, 100, 4],
      [1 / 30, 1 / 10, 1 / 20, 1 / 12, 200, 100, 100, 300],
    ],
    [
      [1 / 10, 1 / 50, 1 / 30, 1 / 12, 300, 10, -200, 40],
      [1 / 30, 1 / 12, 1 / 10, 1 / 12, 500, 11, 50, 200],
    ],
  ],
  [
    [
      [1 / 10, 1 / 5, 1 / 10, 1 / 4, 300, 1, 300, 1],
      [1 / 10, 1 / 5, 1 / 10, 1 / 4, 500, 1, 100, 100],
    ],
    [
      [1 / 10, 1 / 5, 1 / 10, 1 / 5, 300, 10, 100, 10],
      [1 / 10, 1 / 30, 1 / 10, 1 / 30, 100, -300, 100, 300],
    ],
    [
      [1 / 10, 1 / 50, 1 / 30, 1 / 12, 300, 10, -300, 10],
      [1 / 30, 1 / 12, 1 / 30, 1 / 12, 200, 10, 200, 200],
    ],
  ],
  [
    [
      [1 / 20, 1 / 20, 1 / 20, 1 / 20, 100, 300, 100, 300],
      [1 / 10, 1 / 10, 1 / 10, 1 / 10, 10, 100, 10, 100],
    ],
    [
      [1 / 40, 1 / 40, 1 / 40, 1 / 40, 100, 300, 100, 300],
      [1 / 20, 1 / 20, 1 / 20, 1 / 20, 10, 100, 10, 100],
    ],
    [
      [1 / 100, 1 / 40, 1 / 100, 1 / 40, 100, 300, 100, 300],
      [1 / 20, 1 / 60, 1 / 20, 1 / 60, 300, 100, 300, 100],
    ],
  ],
];

function getRandomSet() {
  const getRandomT = () => 1 / getRandomInt(5, 50);
  const getRandomF = () => getRandomInt(-300, 300);
  const getRandomParams = () => [
    getRandomT(),
    getRandomT(),
    getRandomT(),
    getRandomT(),
    getRandomF(),
    getRandomF(),
    getRandomF(),
    getRandomF(),
  ];
  return [
    [getRandomParams(), getRandomParams()],
    [getRandomParams(), getRandomParams()],
    [getRandomParams(), getRandomParams()],
  ];
}

function f(tx1, tx2, ty1, ty2, fx1, fx2, fy1, fy2, t) {
  return [
    Math.sin(t * tx1) * fx1 + Math.sin(t * tx2) * fx2,
    Math.cos(t * ty1) * fy1 + Math.cos(t * ty2) * fy2,
  ];
}

function getMax(params) {
  let maxX = 0;
  let maxY = 0;

  for (let i = 1; i < 1000; i++) {
    for (let j = 0; j < params.length; j++) {
      const [x1, y1] = f(...params[j][0], i);
      const [x2, y2] = f(...params[j][1], i);
      maxX = Math.max(maxX, x1, x2);
      maxY = Math.max(maxY, y1, y2);
    }
  }

  return [maxX * 2, maxY * 2];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const cmyDance = (sketch) => {
  const { set = 0 } = sketch.getURLParams();
  let p = paramsSet[Math.min(set, paramsSet.length - 1)];
  let t = 0;
  let inc = 1 / 4;
  let n = 16;
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
    autoStretchP5(sketch, layout);
  };

  function layout() {
    let maxX = 0;
    let maxY = 0;
    // brute force way to find bounds
    for (let i = 1; i < 1000; i++) {
      for (let j = 0; j < p.length; j++) {
        const [x1, y1] = f(...p[j][0], i);
        const [x2, y2] = f(...p[j][1], i);
        maxX = Math.max(maxX, x1, x2);
        maxY = Math.max(maxY, y1, y2);
      }
    }

    realScale =
      1 / Math.max((maxX * 2) / sketch.width, (maxY * 2) / sketch.height);
  }

  sketch.draw = () => {
    sketch.clear();
    sketch.background(0);
    sketch.translate(sketch.width / 2, sketch.height / 2);
    sketch.scale(realScale - scaleOffset);
    sketch.strokeWeight(5);

    if (sketch.mouseIsPressed) {
      n = sketch.map(sketch.mouseY, 0, sketch.height, 3, 64);
    }

    for (let i = 0; i < n; i++) {
      const tInc = i * 1.5;
      for (let j = 0; j < p.length; j++) {
        sketch.stroke(sketch.color(...palette[j % palette.length]));
        sketch.line(...f(...p[j][0], t + tInc), ...f(...p[j][1], t + tInc));
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
      case "g": {
        p = getRandomSet();
        layout();
        break;
      }
      default: {
      }
    }
  };
};

export default cmyDance;
