import { debounce, shuffle } from "lodash";
import gradients from "../../data/gradients";
import cyclicIterator from "../../utils/cyclicIterator";
const gradientIterator = cyclicIterator(shuffle(gradients));

export const meta = {
  name: "Scales",
  year: "201?"
};

export default p5 => {
  var scaleW = 100;
  var scaleH = 120;
  var hSpace = 100;
  var vSpace = 70;
  var gradient = gradientIterator.peek();

  const efficientLayout = debounce(layout, 400);

  function layout() {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
    drawScales();
  }

  p5.setup = () => {
    p5.createCanvas(100, 100);
    p5.noLoop();

    layout();
  };

  function drawScales() {
    p5.background(255);

    var cols = Math.ceil(p5.width / hSpace) + 1;
    var rows = Math.ceil(p5.height / vSpace);
    var xOffset = (p5.width - cols * hSpace) / 2;

    for (var i = 0; i < rows; i++) {
      var y = (rows - i - 1) * vSpace;
      var c = lerpGradient(gradient, i / (rows - 1));

      for (var j = 0; j < cols; j++) {
        var x = j * hSpace + xOffset;

        if (i % 2 !== 0) x += hSpace / 2;

        p5.noStroke();
        p5.fill(c);
        fishscale(x, y, scaleW, scaleH);
      }
    }
  }

  function fishscale(x, y, w, h) {
    var mid = h - w / 2;
    p5.rect(x, y, w, mid);
    p5.arc(x + w / 2, y + mid, w, w, 0, p5.PI, p5.OPEN);
  }

  p5.windowResized = () => {
    efficientLayout();
  };

  p5.touchStarted = () => {
    gradient = gradientIterator.next().value;
    drawScales();
  };

  // utilities

  function lerpGradient(gradient, amt) {
    if (gradient.colors.length === 2)
      return p5.lerpColor(
        p5.color(gradient.colors[0]),
        p5.color(gradient.colors[1]),
        amt
      );

    var a = Math.floor(gradient.colors.length * amt);
    var b = a + 1;
    var low = a / gradient.colors.length;
    var high = b / gradient.colors.length;
    var pos = p5.map(amt, low, high, 0, 1);

    return p5.lerpColor(
      p5.color(gradient.colors[a]),
      p5.color(gradient.colors[b]),
      pos
    );
  }
};
