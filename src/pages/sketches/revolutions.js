import p5plotSvg from "p5.plotsvg";
import autoStretchP5 from "@/utils/auto-stretch-p5";

export const meta = {
  name: "Revolutions",
  created: "2014-09-16",
};

const revolutions = (sketch) => {
  // gen variables
  let iterations = 958;
  let n = 69;
  let mode = 0;
  let stepFactor = 24;
  let isAnimated = true;

  // app state
  let dots = [];

  // colors
  let cyan;
  let magenta;
  let yellow;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.strokeWeight(2);
    sketch.noFill();

    dots = [];
    cyan = sketch.color(0, 174, 239, 150);
    magenta = sketch.color(236, 0, 140, 150);
    yellow = sketch.color(255, 242, 0, 150);

    if (!isAnimated) {
      sketch.noLoop();
    }
    regen();

    autoStretchP5(sketch, () => {
      sketch.redraw();
    });
  };

  sketch.draw = () => {
    if (isAnimated) {
      iterations = sketch.frameCount;
      dots = getDots(sketch.frameCount, n, mode);
    }

    sketch.clear();
    sketch.background(255);

    const centerX = sketch.width / 2;
    const centerY = sketch.height / 2;
    const circleWidth = Math.min(sketch.width, sketch.height) * 0.8;

    for (let i = 0; i < n - 1; i++) {
      const r = (i + 3) % 3;

      if (r === 0) {
        sketch.stroke(cyan);
      } else if (r === 1) {
        sketch.stroke(yellow);
      } else if (r === 2) {
        sketch.stroke(magenta);
      }

      const p1 = pointOnCircle(centerX, centerY, dots[i], circleWidth / 2);
      const p2 = pointOnCircle(centerX, centerY, dots[i + 1], circleWidth / 2);
      sketch.line(p1.x, p1.y, p2.x, p2.y);
    }
  };

  sketch.keyPressed = () => {
    switch (sketch.key) {
      case "s": {
        p5plotSvg.beginRecordSVG(sketch, `revolutions.svg`);
        sketch.draw();
        p5plotSvg.endRecordSVG();
        break;
      }
      case "n": {
        iterations = randomInt(0, 1080);
        n = randomInt(0, 1080);
        mode = randomInt(0, 1);
        regen();
        break;
      }
      case "m": {
        mode = (mode + 1) % 2;
        regen();
        break;
      }
      default:
    }

    switch (sketch.keyCode) {
      case sketch.ENTER: {
        toggleAnimation();
        break;
      }
      case sketch.LEFT_ARROW: {
        iterations -= 1;
        regen();
        break;
      }
      case sketch.RIGHT_ARROW: {
        iterations += 1;
        regen();
        break;
      }
      case sketch.UP_ARROW: {
        n += 3;
        regen();
        break;
      }
      case sketch.DOWN_ARROW: {
        n -= 3;
        regen();
        break;
      }
      default:
    }
  };

  sketch.doubleClicked = () => {
    mode = (mode + 1) % 2;
    regen();
    return false;
  };

  function toggleAnimation() {
    isAnimated = !isAnimated;
    if (isAnimated) {
      sketch.loop();
    } else {
      sketch.noLoop();
    }
  }

  function regen() {
    dots = getDots(iterations, n, mode);
    sketch.redraw();
  }

  function getDots(iterations, n, mode) {
    const inc = sketch.TWO_PI / (360 * stepFactor);
    const dots = [];
    for (let i = 0; i < n; ++i) {
      dots[i] =
        (i % 2 === 0 ? 1 : mode === 0 ? 1 : 2) * (inc * (i + 1)) * iterations;
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
};

export default revolutions;
