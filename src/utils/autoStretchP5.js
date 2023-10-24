import debounce from "./debounce";

const autoStretchP5 = (p5, onResized = () => {}) => {
  const stretch = () => {
    p5.resizeCanvas(
      p5.canvas.parentNode.clientWidth,
      p5.canvas.parentNode.clientHeight
    );
    onResized();
  };
  p5.windowResized = debounce(stretch, 400);
  stretch();
};

export default autoStretchP5;
