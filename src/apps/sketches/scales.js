import { shuffle } from "lodash";
import gradients from "../../data/gradients";
import autoStretchP5 from "../../utils/autoStretchP5";
import cyclicIterator from "../../utils/cyclicIterator";
const gradientIterator = cyclicIterator(shuffle(gradients));

export const meta = {
  name: "Scales",
  year: "201?",
};

const scales = (sketch) => {
  var scaleW = 100;
  var scaleH = 120;
  var hSpace = 100;
  var vSpace = 70;
  var gradient = gradientIterator.peek();

  sketch.setup = () => {
    sketch.createCanvas(100, 100);
    sketch.noLoop();

    autoStretchP5(sketch, () => drawScales());
  };

  function drawScales() {
    sketch.background(255);

    var cols = Math.ceil(sketch.width / hSpace) + 1;
    var rows = Math.ceil(sketch.height / vSpace);
    var xOffset = (sketch.width - cols * hSpace) / 2;

    for (var i = 0; i < rows; i++) {
      var y = (rows - i - 1) * vSpace;
      var c = lerpGradient(gradient, i / (rows - 1));

      for (var j = 0; j < cols; j++) {
        var x = j * hSpace + xOffset;

        if (i % 2 !== 0) x += hSpace / 2;

        sketch.noStroke();
        sketch.fill(c);
        fishscale(x, y, scaleW, scaleH);
      }
    }
  }

  function fishscale(x, y, w, h) {
    var mid = h - w / 2;
    sketch.rect(x, y, w, mid);
    sketch.arc(x + w / 2, y + mid, w, w, 0, sketch.PI, sketch.OPEN);
  }

  sketch.touchStarted = () => {
    gradient = gradientIterator.next();
    drawScales();
  };

  // utilities

  function lerpGradient(gradient, amt) {
    if (gradient.colors.length === 2)
      return sketch.lerpColor(
        sketch.color(gradient.colors[0]),
        sketch.color(gradient.colors[1]),
        amt
      );

    var a = Math.floor(gradient.colors.length * amt);
    var b = a + 1;
    var low = a / gradient.colors.length;
    var high = b / gradient.colors.length;
    var pos = sketch.map(amt, low, high, 0, 1);

    return sketch.lerpColor(
      sketch.color(gradient.colors[a]),
      sketch.color(gradient.colors[b]),
      pos
    );
  }
};

export default scales;
