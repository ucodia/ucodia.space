import { debounce } from "lodash";

const noop = () => {};

const stretchCanvas = (p5, onResized = noop) => {
  p5.resizeCanvas(
    p5.canvas.parentNode.clientWidth,
    p5.canvas.parentNode.clientHeight
  );
  onResized();
};

export default (p5, onResized) => {
  const stretch = () => stretchCanvas(p5, onResized);
  p5.windowResized = debounce(stretch, 400);
  stretch();
};
