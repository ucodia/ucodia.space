import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  name: "Vintage",
  year: "201?"
};

export default p5 => {
  var t = 0;
  var n = 100;

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.colorMode(p5.HSB);

    autoStretchP5(p5);
  };

  p5.draw = () => {
    p5.background(0);
    p5.translate(p5.width / 2, p5.height / 2);
    p5.strokeWeight(2);

    const baseColor = p5.map(p5.frameCount % 1000, 0, 1000, 0, 360);

    for (let i = 0; i < n; i++) {
      const colorInc = p5.map(i, 0, n, 0, 180);
      p5.stroke((baseColor + colorInc) % 360, 80, 80, 0.9);

      const tInc = i * 0.5;
      p5.line(x1(t + tInc), y1(t + tInc), x2(t + tInc), y2(t + tInc));
      p5.line(x3(t + tInc), y3(t + tInc), x4(t + tInc), y4(t + tInc));
    }

    t += p5.map(p5.mouseX, 0, p5.width, -1, 1);
  };

  function x1(t) {
    return p5.sin(t / 10) * 300 + p5.sin(t / 10) * 20;
  }

  function y1(t) {
    return p5.cos(t / 10) * 100;
  }

  function x2(t) {
    return p5.sin(t / 10) * 300 + p5.sin(t) * 2;
  }

  function y2(t) {
    return p5.cos(t / 20) * 100 + p5.cos(t / 12) * 200;
  }

  function x3(t) {
    return p5.sin(t / 5) * 200 + p5.sin(t / 7) * 50;
  }

  function y3(t) {
    return p5.cos(t / 10) * 300;
  }

  function x4(t) {
    return p5.sin(t / 10) * 300 + p5.sin(t / 45) * 2;
  }

  function y4(t) {
    return p5.cos(t / 20) * 100 + p5.cos(t / 19) * 200;
  }
};
