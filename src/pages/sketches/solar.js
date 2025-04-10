import p5plotSvg from "p5.plotsvg";

export const meta = {
  name: "solar",
  created: "2025-04-05",
};

/***
 * Parametric equation function which returns a 2D position based on time and radial movement equations.
 * Modifiers xms = [[fx, ax], ... ] and yms = [[fy, ay], ... ] manipulates the equation such as
 *
 *   f(x) = sum(sin(t * (1 / fx)) * ax))
 *   f(y) = sum(cos(t * (1 / fy)) * ay))
 *
 * fx controls the wave period fraction (frequency)
 * ax controls the wave height multiplier (amplitude)
 * t represents the time
 */
function f(xms, yms, t) {
  return [
    xms.reduce((acc, [fx, ax]) => (acc += Math.sin(t * (1 / fx)) * ax), 0),
    yms.reduce((acc, [fx, ax]) => (acc += Math.cos(t * (1 / fx)) * ax), 0),
  ];
}

const solar = (sketch) => {
  let defaultSx = {
    n: 200,
    steps: [0.5, 0.5],
    minStep: 0.01,
    maxStep: 2,
    speed: 0.01,
    smoothness: 0.5,
    movePattern: [[[1, 100]], [[2, 50]]],
    sunX: 0,
    sunY: 0,
    seed: 0,
  };
  let sx = { ...defaultSx };

  sketch.setup = function () {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    gen();
  };

  sketch.windowResized = function () {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };

  sketch.draw = function () {
    // animate
    const t = sketch.frameCount * sx.speed;
    const [offsetX, offsetY] = f([[1, 100]], [[2, 50]], t);
    sx.sunX = sketch.width / 2 + offsetX;
    sx.sunY = sketch.height / 2 + offsetY;
    sx.steps[0] = sketch.map(
      sketch.noise(t * sx.smoothness, 2),
      0,
      1,
      sx.minStep,
      sx.maxStep
    );
    sx.steps[1] = sketch.map(
      sketch.noise(t * sx.smoothness, 3),
      0,
      1,
      sx.minStep,
      sx.maxStep
    );

    // draw
    sketch.background(255);
    sketch.strokeWeight(3);
    sketch.stroke(0);
    sketch.noFill();
    sketch.stroke("#ffff00aa");
    sun(sx.sunX, sx.sunY, sx.n, sx.steps[0]);
    sketch.stroke("#ffcc00aa");
    sun(sketch.width - sx.sunX, sketch.height - sx.sunY, sx.n, sx.steps[1]);
  };

  function sun(x, y, n, step) {
    p5plotSvg.beginSvgGroup();

    sketch.beginShape();
    const segs = 720;
    const angleStep = sketch.TWO_PI / segs;
    for (let i = 0; i < n * segs; i++) {
      let angle = i * angleStep;
      let revolution = i / segs;
      let r = 1 + (revolution * revolution * step) / 2;
      let px = x + sketch.cos(angle) * (r / 2);
      let py = y + sketch.sin(angle) * (r / 2);
      sketch.curveVertex(px, py);
    }
    sketch.endShape();
    p5plotSvg.endSvgGroup();
  }

  sketch.keyPressed = function () {
    if (sketch.key === "s") {
      p5plotSvg.setSvgResolutionDPI(72);
      p5plotSvg.setSvgDefaultStrokeWeight(3);
      p5plotSvg.beginRecordSVG(this, `solar.svg`);
      sketch.draw();
      p5plotSvg.endRecordSVG();
    } else if (sketch.key === "g") {
      gen();
    } else if (sketch.key === "d") {
      console.log(JSON.stringify(sx, null, 2));
    }
  };

  function gen() {
    sx.seed = sketch.round(sketch.random(0, 10000));
    sketch.randomSeed(sx.seed);
    sketch.noiseSeed(sx.seed);

    let moveType = randomInt(0, 1);
    if (moveType === 0) {
      sx.movePattern = [[[1, 100]], [[2, 50]]];
    } else if (moveType === 1) {
      sx.movePattern = [[[1, 200]], [[2, 100]], [[3, 25]]];
    }
  }

  function randomInt(min, max, rand = Math.random) {
    return Math.floor(rand() * (max - min + 1)) + min;
  }
};

export default solar;
