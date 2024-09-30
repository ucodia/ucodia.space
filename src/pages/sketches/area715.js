import autoStretchP5 from "@/utils/auto-stretch-p5";
import debounce from "@/utils/debounce";

export const meta = {
  name: "Area 715",
  created: "2015-10-26",
};

const area715 = (sketch) => {
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
  var isWandering;
  var noiseOffsetX;
  var noiseOffsetY;
  var showCursor;

  var cap;
  var capWidth;
  var capHeight;

  const startWandering = debounce(() => {
    posLock = true;
    isWandering = true;
    hideCursors();
  }, 10000);

  const showCursors = () => {
    sketch.noCursor();
    showCursor = true;
  };

  const hideCursors = () => {
    sketch.noCursor();
    showCursor = false;
  };

  function layout() {
    if (mirror === "hv") {
      capWidth = sketch.width / 2;
      capHeight = sketch.height / 2;
    } else if (mirror === "h") {
      capWidth = sketch.width;
      capHeight = sketch.height / 2;
    } else if (mirror === "v") {
      capWidth = sketch.width / 2;
      capHeight = sketch.height;
    }

    capWidth = sketch.ceil(capWidth);
    capHeight = sketch.ceil(capHeight);
    cap = sketch.createImage(capWidth, capHeight);
    sketch.colorMode(sketch.HSB, maxColor);
  }

  sketch.setup = () => {
    sketch.createCanvas(100, 100);
    sketch.frameRate(30);
    sketch.noCursor();

    // defaults
    capRotation = sketch.QUARTER_PI;
    rotationInc = sketch.TWO_PI / 180;
    borderWeight = 3;
    weightInc = 0.5;
    maxColor = 100;
    colorCursor = new Looper(0, maxColor);
    borderCursor = new Looper(0, 10);
    overlay = "rect";
    mirror = "hv";
    posLock = true;
    borderAuto = true;
    paused = false;
    isWandering = false;
    noiseOffsetX = 0;
    noiseOffsetY = 1000;
    showCursor = false;

    autoStretchP5(sketch, layout);

    posX = sketch.width / 4.1;
    posY = sketch.height / 2;

    startWandering();
  };

  sketch.draw = () => {
    sketch.background(0);

    project();
    input();

    if (!paused) {
      graphics();
      capture();
    }

    if (showCursor) {
      sketch.fill("white");
      sketch.noStroke();
      sketch.ellipse(posX, posY, 10, 10);
    }

    if (isWandering) {
      updateWanderingPosition();
    }
  };

  function project() {
    sketch.image(cap, 0, 0);

    sketch.push();

    if (mirror === "hv") {
      sketch.translate(sketch.width, 0);
      sketch.scale(-1, 1);
      sketch.image(cap, 0, 0);

      sketch.translate(0, sketch.height);
      sketch.scale(1, -1);
      sketch.image(cap, 0, 0);

      sketch.translate(sketch.width, 0);
      sketch.scale(-1, 1);
      sketch.image(cap, 0, 0);
    } else if (mirror === "h") {
      sketch.translate(0, sketch.height);
      sketch.scale(1, -1);
      sketch.image(cap, 0, 0);
    } else if (mirror === "v") {
      sketch.translate(sketch.width, 0);
      sketch.scale(-1, 1);
      sketch.image(cap, 0, 0);
    }

    sketch.pop();
  }

  function capture() {
    var capX = posX - capWidth / 2;
    var capY = posY - capHeight / 2;
    cap = sketch.get(capX, capY, capWidth, capHeight);
  }

  function graphics() {
    sketch.push();

    sketch.translate(posX, posY);
    sketch.rotate(capRotation);
    sketch.translate(-posX, -posY);

    sketch.stroke(colorCursor.next(), maxColor * 0.6, maxColor * 0.8);
    sketch.strokeWeight(borderAuto ? borderCursor.next() / 10 : borderWeight);
    sketch.noFill();

    if (overlay === "rect") {
      sketch.rectMode(sketch.CENTER);
      sketch.rect(posX, posY, capWidth, capHeight);
    } else if (overlay === "equi") {
      equi(posX, posY, (sketch.height / 2) * 0.8);
    } else if (overlay === "circ") {
      sketch.ellipse(posX, posY, capHeight, capHeight);
    }

    sketch.pop();
  }

  function input() {
    if (sketch.mouseIsPressed) {
      showCursors();

      if (posLock) {
        posLock = false;
        isWandering = false;
      }

      if (sketch.mouseButton === sketch.LEFT) capRotation += rotationInc;
      else capRotation -= rotationInc;

      if (capRotation < 0) capRotation = sketch.TWO_PI + capRotation;
      else if (capRotation > sketch.TWO_PI)
        capRotation = sketch.TWO_PI - capRotation;

      startWandering();
    }

    if (!posLock && !isWandering) {
      posX = sketch.mouseX;
      posY = sketch.mouseY;
    }

    if (sketch.keyPressed) {
      if (sketch.key.toLowerCase() === "r")
        sketch.save(`capture-${getTimestamp()}.png`);
    }
  }

  sketch.keyPressed = () => {
    var k = sketch.key.toLowerCase();

    if (k === "w") borderAuto = !borderAuto;
    else if (k === "l") posLock = !posLock;
    else if (k === " ") paused = !paused;

    startWandering();
  };

  sketch.doubleClicked = () => {
    borderAuto = !borderAuto;
    startWandering();
  };

  sketch.mouseWheel = (event) => {
    borderWeight += event.delta * weightInc;
    if (borderWeight < 0) borderWeight = 0;
    startWandering();
  };

  function updateWanderingPosition() {
    noiseOffsetX += 0.001;
    noiseOffsetY += 0.001;
    posX = sketch.map(sketch.noise(noiseOffsetX), 0, 1, 0, sketch.width / 2);
    posY = sketch.map(sketch.noise(noiseOffsetY), 0, 1, 0, sketch.height / 2);
    capRotation += rotationInc / 4;
  }

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

    this.peek = function () {
      return this.current;
    };

    this.next = function () {
      this.current += this.inc;

      if (this.current === this.start || this.current === this.end) {
        this.reset();
      }

      return this.current;
    };

    this.reset = function () {
      this.current = this.start;
    };
  }

  function equi(x, y, size, mode) {
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

    sketch.triangle(x1, y1, x2, y2, x3, y3);
  }

  function triHeight(hypo, a) {
    return sketch.sqrt(sketch.pow(hypo, 2) - sketch.pow(a, 2));
  }
};

export default area715;
