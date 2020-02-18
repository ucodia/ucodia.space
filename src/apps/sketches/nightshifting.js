import { debounce } from "lodash";

export const meta = {
  name: "Nightshifting",
  year: "2020"
};

export default p5 => {
  const efficientLayout = debounce(layout, 400);
  const n = 10;
  const size = 50;
  const spaceRatio = 1.2;

  function layout() {
    p5.noLoop();
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
    p5.loop();
  }

  p5.setup = () => {
    p5.createCanvas(100, 100, p5.WEBGL);
    p5.frameRate(30);
    layout();
  };

  p5.windowResized = () => {
    efficientLayout();
  };

  p5.draw = () => {
    p5.background(0);

    for (let x = 1; x <= n; x++) {
      for (let y = 1; y <= n; y++) {
        p5.box(size, size, size * 2);
        p5.translate(0, size * spaceRatio, 0);
      }
      p5.translate(size * spaceRatio, -n * size * spaceRatio, 0);
    }
  };
};
