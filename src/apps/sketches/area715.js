import { debounce } from "lodash";

export const meta = {
  name: "Area 715",
  year: "2015"
};

export default p5 => {
  var posX;
  var posY;
  var capRotation;
  var rotationInc;
  var borderWeight;
  var weightInc;
  var maxColor;
  var colorCursor;
  var borderCursor;
  var overlay;
  var mirror;
  var posLock;
  var borderAuto;
  var paused;

  var cap;
  var capWidth;
  var capHeight;

  // debounced layout
  const efficientLayout = debounce(layout, 400);

  function layout() {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);

    if (mirror === "hv") {
      capWidth = p5.width / 2;
      capHeight = p5.height / 2;
    } else if (mirror === "h") {
      capWidth = p5.width;
      capHeight = p5.height / 2;
    } else if (mirror === "v") {
      capWidth = p5.width / 2;
      capHeight = p5.height;
    }

    capWidth = p5.ceil(capWidth);
    capHeight = p5.ceil(capHeight);
    cap = p5.createImage(capWidth, capHeight);
    p5.colorMode(p5.HSB, maxColor);
  }

  p5.setup = () => {
    p5.createCanvas(100, 100);
    p5.frameRate(30);

    // defaults
    posX = 0;
    posY = 0;
    capRotation = 0;
    rotationInc = p5.TWO_PI / 180;
    borderWeight = 3;
    weightInc = 0.5;
    maxColor = 100;
    colorCursor = new Looper(0, maxColor);
    borderCursor = new Looper(0, 10);
    overlay = "rect";
    mirror = "hv";
    posLock = false;
    borderAuto = false;
    paused = false;

    layout();
  };

  p5.draw = () => {
    p5.background(0);

    project();
    input();

    if (!paused) {
      graphics();
      capture();
    }
  };

  function project() {
    p5.image(cap, 0, 0);

    p5.push();

    if (mirror === "hv") {
      p5.translate(p5.width, 0);
      p5.scale(-1, 1);
      p5.image(cap, 0, 0);

      p5.translate(0, p5.height);
      p5.scale(1, -1);
      p5.image(cap, 0, 0);

      p5.translate(p5.width, 0);
      p5.scale(-1, 1);
      p5.image(cap, 0, 0);
    } else if (mirror === "h") {
      p5.translate(0, p5.height);
      p5.scale(1, -1);
      p5.image(cap, 0, 0);
    } else if (mirror === "v") {
      p5.translate(p5.width, 0);
      p5.scale(-1, 1);
      p5.image(cap, 0, 0);
    }

    p5.pop();
  }

  function capture() {
    var capX = posX - capWidth / 2;
    var capY = posY - capHeight / 2;
    cap = p5.get(capX, capY, capWidth, capHeight);
  }

  function graphics() {
    p5.push();

    p5.translate(posX, posY);
    p5.rotate(capRotation);
    p5.translate(-posX, -posY);

    p5.stroke(colorCursor.next(), maxColor * 0.6, maxColor * 0.8);
    p5.strokeWeight(borderAuto ? borderCursor.next() / 10 : borderWeight);
    p5.noFill();

    if (overlay === "rect") {
      p5.rectMode(p5.CENTER);
      p5.rect(posX, posY, capWidth, capHeight);
    } else if (overlay === "equi") {
      equi(posX, posY, (p5.height / 2) * 0.8);
    } else if (overlay === "circ") {
      p5.ellipse(posX, posY, capHeight, capHeight);
    }

    p5.pop();
  }

  // input hooks

  function input() {
    if (!posLock) {
      posX = p5.mouseX;
      posY = p5.mouseY;
    }

    if (p5.mouseIsPressed) {
      if (p5.mouseButton === p5.LEFT) capRotation -= rotationInc;
      else capRotation += rotationInc;

      if (capRotation < 0) capRotation = p5.TWO_PI + capRotation;
      else if (capRotation > p5.TWO_PI) capRotation = p5.TWO_PI - capRotation;
    }

    if (p5.keyPressed) {
      if (p5.key.toLowerCase() === "r")
        p5.saveCanvas("capture-" + getTimestamp(), "png");
    }
  }

  p5.keyPressed = () => {
    var k = p5.key.toLowerCase();

    if (k === "w") borderAuto = !borderAuto;
    else if (k === "l") posLock = !posLock;
    else if (k === " ") paused = !paused;
  };

  p5.mouseWheel = event => {
    borderWeight += event.delta * weightInc;

    if (borderWeight < 0) borderWeight = 0;
  };

  // other stuff

  p5.windowResized = () => {
    efficientLayout();
  };

  function getTimestamp() {
    return new Date()
      .toISOString()
      .split("-")
      .join("")
      .split("T")
      .join("-")
      .split(":")
      .join("");
  }

  function Looper(start, end) {
    this.start = start;
    this.end = end;
    this.current = start;
    this.inc = start < end ? 1 : -1;

    this.peek = function() {
      return this.current;
    };

    this.next = function() {
      this.current += this.inc;

      if (this.current === this.start || this.current === this.end) {
        this.reset();
      }

      return this.current;
    };

    this.reset = function() {
      this.current = this.start;
    };
  }

  // equilateral primitive

  function equi(x, y, size, mode) {
    // the mode changes vertical centering
    const m = mode | 0;
    const h = triHeight(size, size / 2);
    const h3 = h / 3;

    const x1 = x;
    const x2 = x - size / 2;
    const x3 = x + size / 2;

    let y1, y2, y3;

    if (m === 0) {
      y1 = y - 2 * h3;
      y2 = y + h3;
      y3 = y + h3;
    } else {
      y1 = y - h / 2;
      y2 = y + h / 2;
      y3 = y + h / 2;
    }

    this.triangle(x1, y1, x2, y2, x3, y3);
  }

  function triHeight(hypo, a) {
    return p5.sqrt(p5.pow(hypo, 2) - p5.pow(a, 2));
  }
};
