import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  name: "Fittest Bubble Bath",
  created: "2016-06-13",
};

const fittestBubbleBath = (sketch) => {
  // globals
  const bath = [];

  // settings
  const settings = {};
  settings.maxBubs = 100;
  settings.minSpeed = 1;
  settings.maxSpeed = 8;
  settings.attDist = 100;
  settings.minSize = 20;
  settings.maxSize = 400;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.frameRate(60);
    sketch.colorMode(sketch.HSB, 100);

    autoStretchP5(sketch, layout);
  };

  function layout() {
    const minSide = Math.min(sketch.width, sketch.height);
    settings.minSize = minSide * 0.05;
    settings.maxSize = minSide * 0.5;
  }

  sketch.draw = () => {
    sketch.clear();
    sketch.background(255);

    const toExplode = [];

    for (var i = 0; i < bath.length; i++) {
      const bubble = bath[i];
      const neighbors = [];

      bubble.draw();

      for (var j = 0; j < bath.length; j++) {
        if (i !== j) {
          var neighbor = bath[j];
          var d = bubble.pos.dist(neighbor.pos);

          // check for attraction
          if (d < settings.attDist + bubble.size / 2 + neighbor.size / 2)
            neighbors.push(neighbor);

          // check for merging
          if (d < bubble.size / 2 && bubble.size >= neighbor.size) {
            sketch.line(
              bubble.pos.x,
              bubble.pos.y,
              neighbor.pos.x,
              neighbor.pos.y
            );
            bubble.merge(neighbor);
            toExplode.push(neighbor);
          }
        }
      }

      bubble.update(neighbors);

      // explode bubbles that reaches max size
      if (bubble.size > settings.maxSize) toExplode.push(bubble);
    }

    // explode big and merged bubbles
    for (let i = 0; i < toExplode.length; i++) {
      var index = bath.indexOf(toExplode[i]);
      if (index !== -1) bath.splice(index, 1);
    }
    toExplode.length = 0;

    // add some bubbles to the bath
    // frameCount % n === 0 is for rate limiting
    if (bath.length < settings.maxBubs && sketch.frameCount % 20 === 0)
      bath.push(
        new Bubble(sketch.random(sketch.width), sketch.random(sketch.height))
      );
  };

  function Bubble(x, y) {
    // physics
    this.pos = sketch.createVector(x, y);
    this.vel = sketch.createVector(sketch.random(-1, 1), sketch.random(-1, 1));

    // aspect
    this.size = settings.minSize;
    this.hue = randomInt(0, 100);

    this.update = function (neighbors) {
      // calculate acceleration and velocity
      const acc = this.vel.copy().mult(0.01);
      this.vel.add(acc);

      // apply neighbor attraction to velocity
      for (var i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        // calculate vector to neighbor
        const att = neighbor.pos.copy().sub(this.pos);
        // bigger are attracted by smaller
        const amt = this.size > neighbor.size ? 0.01 : -0.01;
        // attract with lerp
        this.vel.lerp(att, amt);
      }

      // limit max speed
      const limit = sketch.map(
        this.size,
        settings.minSize,
        settings.maxSize,
        settings.maxSpeed,
        settings.minSpeed
      );
      this.vel.limit(limit);
      // move position
      this.pos.add(this.vel);
      // reframe position
      reframe(this.pos);
    };

    this.merge = function (merged) {
      // recolor based on size ratio
      const sRatio = merged.size / (this.size + merged.size);
      this.hue = sketch.lerp(
        sketch.max(this.hue, merged.hue),
        sketch.min(this.hue, merged.hue),
        sRatio
      );
      // grow the size by a fixed ratio
      this.size += merged.size * 0.5;
    };

    this.draw = function () {
      // map opacity to bubble size
      const opacity = sketch.map(
        this.size,
        settings.minSize,
        settings.maxSize,
        100,
        20
      );

      sketch.noStroke();
      sketch.fill(this.hue, 90, 90, opacity);
      sketch.ellipse(this.pos.x, this.pos.y, this.size, this.size);
    };
  }

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };

  sketch.mousePressed = () => {
    const mousePos = sketch.createVector(sketch.mouseX, sketch.mouseY);

    const toExplode = [];
    for (let i = 0; i < bath.length; i++) {
      const bubble = bath[i];
      const d = bubble.pos.dist(mousePos);
      if (d < bubble.size / 2) {
        toExplode.push(bubble);
      }
    }
    // alter bath in a separate loop
    for (let i = 0; i < toExplode.length; i++) {
      var index = bath.indexOf(toExplode[i]);
      if (index !== -1) bath.splice(index, 1);
    }

    // if nothing was popped, add a new bubble
    if (toExplode.length === 0) {
      bath.push(new Bubble(sketch.mouseX, sketch.mouseY));
    }

    return false;
  };

  function randomInt(min, max) {
    return sketch.floor(sketch.random() * (max - min + 1)) + min;
  }

  function reframeValue(val, min, max) {
    var res = val;
    const d = sketch.abs(max - min);

    if (val < min) {
      const dif = min - val;
      const off = dif % d;
      res = max - off;
    } else if (val > max) {
      const dif = val - max;
      const off = dif % d;
      res = min + off;
    }

    return res;
  }

  function reframe(v) {
    v.x = reframeValue(v.x, 0, sketch.width);
    v.y = reframeValue(v.y, 0, sketch.height);
  }
};

export default fittestBubbleBath;
