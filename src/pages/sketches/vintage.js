import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  slug: "vintage",
  name: "Vintage",
  created: "2017-12-18",
};

const vintage = (sketch) => {
  var t = 0;
  var n = 100;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.colorMode(sketch.HSB);

    autoStretchP5(sketch);
  };

  sketch.draw = () => {
    sketch.background(0);
    sketch.translate(sketch.width / 2, sketch.height / 2);
    sketch.strokeWeight(2);

    const baseColor = sketch.map(sketch.frameCount % 1000, 0, 1000, 0, 360);

    for (let i = 0; i < n; i++) {
      const colorInc = sketch.map(i, 0, n, 0, 180);
      sketch.stroke((baseColor + colorInc) % 360, 80, 80, 0.9);

      const tInc = i * 0.5;
      sketch.line(x1(t + tInc), y1(t + tInc), x2(t + tInc), y2(t + tInc));
      sketch.line(x3(t + tInc), y3(t + tInc), x4(t + tInc), y4(t + tInc));
    }

    t += sketch.map(sketch.mouseX, 0, sketch.width, -1, 1);
  };

  function x1(t) {
    return sketch.sin(t / 10) * 300 + sketch.sin(t / 10) * 20;
  }

  function y1(t) {
    return sketch.cos(t / 10) * 100;
  }

  function x2(t) {
    return sketch.sin(t / 10) * 300 + sketch.sin(t) * 2;
  }

  function y2(t) {
    return sketch.cos(t / 20) * 100 + sketch.cos(t / 12) * 200;
  }

  function x3(t) {
    return sketch.sin(t / 5) * 200 + sketch.sin(t / 7) * 50;
  }

  function y3(t) {
    return sketch.cos(t / 10) * 300;
  }

  function x4(t) {
    return sketch.sin(t / 10) * 300 + sketch.sin(t / 45) * 2;
  }

  function y4(t) {
    return sketch.cos(t / 20) * 100 + sketch.cos(t / 19) * 200;
  }
};

export default vintage;
