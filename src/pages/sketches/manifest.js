import p5plotSvg from "p5.plotsvg";
import autoStretchP5 from "@/utils/auto-stretch-p5";

export const meta = {
  name: "Manifest",
  created: "2025-05-13",
};

const breakpoints = [
  [0.22161111, 99], // flow
  [0.26718519, 99], // abundance
  [0.29670185, 99], // magic
  [0.32467685, 99], // trust
  [0.32989444, 99], // surrender
  [0.33499259, 99], // love
  [0.38043611, 99], // confidence
  [0.41712963, 99], // passion
  [0.44329815, 99], // creativity
];
// add counter breakpoints
breakpoints.push(
  ...breakpoints.map(([position, n]) => [0.5 + (0.5 - position), n])
);

const manifest = (sketch) => {
  let position = 0;
  let n = 33 * 3; // should be a multiple of 3
  let stepFactor = 1;
  let speedInc = 1 / 36000;
  let speed = 0;
  let showCrosshair = false;

  // preset animation variables
  let isAnimating = false;
  let animationDuration = 5 * 1000;
  let animationStartTime = 0;
  let animationStartPos = 0;
  let animationTargetPos = 0;

  const palette = [
    "#00aeef", // cyan
    "#ec008c", // magenta
    "#fff200", // yellow
  ];

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    autoStretchP5(sketch);
    startAnimation(...breakpoints[randomInt(0, breakpoints.length)]);
  };

  sketch.draw = () => {
    sketch.clear();
    sketch.background(255);
    sketch.strokeWeight(2);

    const centerX = sketch.width / 2;
    const centerY = sketch.height / 2;
    const circleWidth = Math.min(sketch.width, sketch.height) * 0.8;

    const dots = getDots(position, n);
    for (let i = 0; i < n - 1; i++) {
      const c = palette[(i + 3) % 3];
      sketch.stroke(`${c}96`);
      const p1 = pointOnCircle(centerX, centerY, dots[i], circleWidth / 2);
      const p2 = pointOnCircle(centerX, centerY, dots[i + 1], circleWidth / 2);
      sketch.line(p1.x, p1.y, p2.x, p2.y);
    }

    if (showCrosshair) {
      sketch.stroke(0);
      sketch.line(centerX, 0, centerX, sketch.height);
      sketch.line(0, centerY, sketch.width, centerY);
    }

    if (isAnimating) {
      const elapsed = sketch.millis() - animationStartTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const easedProgress = easeInOutQuad(progress);
      position = sketch.lerp(
        animationStartPos,
        animationTargetPos,
        easedProgress
      );
      if (progress >= 1) {
        isAnimating = false;
        position = animationTargetPos;
      }
    }

    position += speed;
  };

  sketch.keyPressed = () => {
    switch (sketch.key) {
      case "s": {
        p5plotSvg.beginRecordSVG(sketch, `manifest.svg`);
        sketch.draw();
        p5plotSvg.endRecordSVG();
        break;
      }
      case "d": {
        console.log(`n: ${n}, position: ${position}, speed: ${speed}`);
        break;
      }
      case "c": {
        showCrosshair = !showCrosshair;
        break;
      }
      default:
    }

    switch (sketch.keyCode) {
      case sketch.ENTER: {
        speed = 0;
        startAnimation(...breakpoints[randomInt(0, breakpoints.length)]);
        break;
      }
      case sketch.LEFT_ARROW: {
        speed -= speedInc;
        break;
      }
      case sketch.RIGHT_ARROW: {
        speed += speedInc;
        break;
      }
      case sketch.UP_ARROW: {
        n += 3;
        break;
      }
      case sketch.DOWN_ARROW: {
        n -= 3;
        break;
      }
      default:
    }
  };

  sketch.doubleClicked = () => {
    if (sketch.fullscreen()) {
      sketch.fullscreen(false);
    } else {
      sketch.fullscreen(true);
    }
  };

  function getDots(position, n) {
    const inc = sketch.TWO_PI / (360 * stepFactor);
    const iterations = sketch.map(position, 0, 1, 0, 360 * stepFactor);
    const dots = [];
    for (let i = 0; i < n; ++i) {
      dots[i] = inc * (i + 1) * iterations;
    }
    return dots;
  }

  function pointOnCircle(x, y, t, r) {
    return sketch.createVector(r * Math.cos(t) + x, r * Math.sin(t) + y);
  }

  function randomInt(min, max) {
    return Math.floor(
      Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + min
    );
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function startRandomAnimation() {
    startAnimation(...breakpoints[randomInt(0, breakpoints.length)]);
  }

  function startAnimation(targetPosition, targetN) {
    animationStartPos = position;
    animationTargetPos = targetPosition;
    animationStartTime = sketch.millis();
    n = targetN;
    isAnimating = true;
  }
};

export default manifest;
