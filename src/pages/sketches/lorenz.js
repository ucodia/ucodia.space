import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  name: "Lorenz",
  year: "2021-02-14",
};

const lorenz = (sketch) => {
  let scaleRatio = 1;
  const particles = [];
  const particleCount = 50;
  const marginRatio = 0.1;
  const lorenzParams = {
    x: 0.1,
    y: 0,
    z: 0,
    a: 10,
    b: 28,
    c: 8.0 / 3.0,
    dt: 0.01 * 0.5,
  };

  sketch.setup = () => {
    sketch.createCanvas(100, 100);
    sketch.colorMode(sketch.HSB);

    for (let i = 0; i < particleCount; i++) {
      particles.push(
        createAttractorParticle(
          lorenz,
          lorenzParams,
          1000 + randomInt(0, i * 100),
          randomInt(10, 30),
          randomInt(1, 10) / 10
        )
      );
    }

    autoStretchP5(sketch, layout);
  };

  function layout() {
    const bounds = getBounds(
      createAttractorParticle(lorenz, lorenzParams, 0, 10000).points()
    );
    scaleRatio = Math.min(
      (sketch.width * (1 - marginRatio)) / bounds.width,
      (sketch.height * (1 - marginRatio)) / bounds.height
    );
  }

  sketch.draw = () => {
    sketch.translate(sketch.width / 2, sketch.height / 2);
    sketch.scale(scaleRatio);
    sketch.background(10);

    for (let i = 0; i < particles.length; i++) {
      particles[i].next();
      particles[i].draw();
    }
  };

  function createAttractorParticle(
    attractorFn,
    attractorParams,
    offset = 0,
    length = 10,
    width = 10
  ) {
    const points = [];
    const hue = sketch.map(offset % 100, 0, 100, 100, 250);
    const iterator = createIterator(attractorFn, attractorParams);

    const next = () => {
      if (points.length >= length) {
        points.shift();
      }
      points.push(iterator.next());
    };

    const draw = () => {
      const offsetHue = (hue + Math.floor(sketch.frameCount / 2)) % 360;
      sketch.strokeWeight(width);
      sketch.stroke(offsetHue, 100, 100, 0.6);
      sketch.fill(offsetHue, 100, 100, 0.6);
      sketch.noFill();
      sketch.beginShape();
      for (let i = 0; i < points.length - 1; i++) {
        sketch.curveVertex(points[i].x, points[i].y);
      }
      sketch.endShape();
    };

    for (let i = 0; i < length + offset; i++) {
      next();
    }

    return {
      next,
      draw,
      points: () => points.slice(),
    };
  }

  function lorenz(params) {
    const { x, y, z, a, b, c, dt } = params;

    return {
      x: x + a * (y - x) * dt,
      y: y + (x * (b - z) - y) * dt,
      z: z + (x * y - c * z) * dt,
    };
  }

  function createIterator(fn, params) {
    let currentParams = {
      ...params,
    };

    return {
      next: (params) => {
        const result = fn({
          ...currentParams,
          ...params,
        });
        currentParams = {
          ...currentParams,
          ...result,
        };
        return result;
      },
    };
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getBounds(points) {
    const xMin = Math.min(...points.map((p) => p.x));
    const yMin = Math.min(...points.map((p) => p.y));
    const zMin = Math.min(...points.map((p) => p.z));
    const xMax = Math.max(...points.map((p) => p.x));
    const yMax = Math.max(...points.map((p) => p.y));
    const zMax = Math.max(...points.map((p) => p.z));
    return {
      xMin,
      yMin,
      zMin,
      xMax,
      yMax,
      zMax,
      width: xMax - xMin,
      height: yMax - yMin,
    };
  }
};

export default lorenz;
