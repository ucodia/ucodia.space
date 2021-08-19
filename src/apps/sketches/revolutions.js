import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  name: "Revolutions",
  year: "2015-2021",
};

const revolutions = (sketch) => {
  // gen variables
  let iterations = 361;
  let n = 361;
  let mode = 1;

  // app state
  let dots = [];

  // colors
  let cyan;
  let magenta;
  let yellow;
  const opacity = 150;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.strokeWeight(2);
    sketch.noFill();

    dots = [];
    cyan = sketch.color(0, 174, 239);
    magenta = sketch.color(236, 0, 140);
    yellow = sketch.color(255, 242, 0);

    sketch.noLoop();
    redraw();

    autoStretchP5(sketch, () => {
      sketch.draw();
    });
  };

  sketch.draw = () => {
    sketch.clear();
    sketch.background(255);

    const centerX = sketch.width / 2;
    const centerY = sketch.height / 2;
    const circleWidth = Math.min(sketch.width, sketch.height) * 0.8;

    for (let i = 0; i < n - 1; i++) {
      const r = (i + 3) % 3;

      if (r === 0) {
        sketch.stroke(cyan, opacity);
      } else if (r === 1) {
        sketch.stroke(yellow, opacity);
      } else if (r === 2) {
        sketch.stroke(magenta, opacity);
      }

      const p1 = pointOnCircle(centerX, centerY, dots[i], circleWidth / 2);
      const p2 = pointOnCircle(centerX, centerY, dots[i + 1], circleWidth / 2);
      sketch.line(p1.x, p1.y, p2.x, p2.y);
    }
  };

  sketch.keyPressed = () => {
    switch (sketch.key) {
      case "r": {
        console.log(`Recording: mode=${mode} n=${n} iterations=${iterations}`);
        sketch.save(`frame-${mode}${n}-${iterations}.svg`);
        break;
      }
      case "g": {
        iterations = randomInt(0, 1080);
        n = randomInt(0, 1080);
        mode = randomInt(0, 1);
        redraw();
        break;
      }
      case "m": {
        mode = (mode + 1) % 2;
        redraw();
        break;
      }
      default:
    }

    switch (sketch.keyCode) {
      case sketch.LEFT_ARROW: {
        iterations -= 1;
        redraw();
        break;
      }
      case sketch.RIGHT_ARROW: {
        iterations += 1;
        redraw();
        break;
      }
      case sketch.UP_ARROW: {
        n += 3;
        redraw();
        break;
      }
      case sketch.DOWN_ARROW: {
        n -= 3;
        redraw();
        break;
      }
      default:
    }
  };

  function redraw() {
    console.log(`Generating: mode=${mode} n=${n} iterations=${iterations}`);
    dots = getDots(iterations, n, mode);
    sketch.draw();
  }

  function getDots(iterations, n, mode) {
    const inc = sketch.TWO_PI / (360 * 6);
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
