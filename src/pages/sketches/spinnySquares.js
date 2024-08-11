import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  name: "Spinny Squares",
  created: "2014-07-30",
  renderer: "p5",
};

const spinnySquares = (sketch) => {
  let squareSize = 62.5;
  let offset = squareSize / 3;
  let n = 30;
  let r = 0;
  let inc;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.noFill();
    sketch.strokeWeight(squareSize / 16);
    autoStretchP5(sketch, layout);
  };

  function layout() {
    inc = sketch.TWO_PI / 3600;
    n = Math.round(
      Math.max(sketch.windowWidth, sketch.windowHeight) / squareSize
    );
  }

  sketch.draw = () => {
    sketch.background(0);
    sketch.rotate(r);

    for (let i = -n; i < n; i++) {
      for (let j = -n; j < n; j++) {
        let x = (squareSize + offset) * i + offset / 2;
        let y = (squareSize + offset) * j + offset / 2;

        sketch.stroke(200, 0, 100);
        sketch.rect(x + offset * 2, y + offset * 2, squareSize, squareSize);
        sketch.stroke(255, 230, 80);
        sketch.rect(x, y, squareSize, squareSize);
      }
    }

    r += inc;
  };
};

export default spinnySquares;
