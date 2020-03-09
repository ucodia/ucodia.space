import { debounce } from "lodash";

export const meta = {
  name: "Nightshifting",
  year: "2020"
};

export default sketch => {
  const efficientLayout = debounce(layout, 400);
  const n = 10;
  const size = 50;
  const spaceRatio = 1.2;

  function layout() {
    sketch.noLoop();
    sketch.resizeCanvas(window.innerWidth, window.innerHeight);
    sketch.loop();
  }

  sketch.setup = () => {
    sketch.createCanvas(100, 100, sketch.WEBGL);
    sketch.frameRate(30);
    layout();
  };

  sketch.windowResized = () => {
    efficientLayout();
  };

  sketch.draw = () => {
    sketch.background(0);

    for (let x = 1; x <= n; x++) {
      for (let y = 1; y <= n; y++) {
        sketch.box(size, size, size * 2);
        sketch.translate(0, size * spaceRatio, 0);
      }
      sketch.translate(size * spaceRatio, -n * size * spaceRatio, 0);
    }
  };
};
