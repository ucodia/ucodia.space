import { debounce } from "lodash";

const stretchCanvas = (p5, onResized) => {
  p5.resizeCanvas(
    p5.canvas.parentNode.clientWidth,
    p5.canvas.parentNode.clientHeight
  );

  if (onResized) onResized();
};

export default (p5, onResized) => {
  const stretch = () => stretchCanvas(p5, onResized);
  p5.windowResized = debounce(stretch, 400);
  stretch();
};
