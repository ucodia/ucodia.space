import { GUI } from "dat.gui";
import autoStretchP5 from "../../utils/autoStretchP5";

export default p5 => {
  // globals
  var bots = [];
  var lastCap = 0;

  // UI
  var gui = new GUI();
  gui.close();

  // settings
  var settings = {};
  settings.background = 20;
  settings.saturation = 100;
  settings.brightness = 80;
  settings.opacity = 5;
  settings.maxBots = 30;
  settings.popFreq = 5;
  settings.minSpeed = 0.2;
  settings.maxSpeed = 2;
  settings.minSize = 10;
  settings.maxSize = 100;
  settings.attDist = 200;
  settings.attract = false;
  settings.reframe = false;
  settings.showBot = false;
  settings.contrast = false;
  settings.autoReset = true;
  settings.resetFreq = 800;
  settings.autoRandomize = false;
  settings.autoCapture = false;

  // actions
  var actions = {
    randomize: randomize,
    reset: reset,
    randReset: function() {
      this.randomize();
      this.reset();
    },
    capture: capture
  };

  p5.setup = () => {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.frameRate(60);
    p5.colorMode(p5.HSB, 100);

    // define UI controls
    // graphics
    var fGraphics = gui.addFolder("Graphics");
    fGraphics.open();
    fGraphics.add(settings, "background", 0, 100);
    fGraphics.add(settings, "saturation", 0, 100);
    fGraphics.add(settings, "brightness", 0, 100);
    fGraphics.add(settings, "opacity", 0, 100);
    fGraphics.add(settings, "maxBots", 8, 200);
    fGraphics.add(settings, "popFreq", 1, 20);
    fGraphics.add(settings, "minSpeed", 0, 2);
    fGraphics.add(settings, "maxSpeed", 0, 100);
    fGraphics.add(settings, "minSize", 1, 20);
    fGraphics.add(settings, "maxSize", 20, 100);
    fGraphics.add(settings, "attDist", 10, 400);
    // behaviors
    var fBehaviors = gui.addFolder("Behaviors");
    fBehaviors.open();
    fBehaviors.add(settings, "attract");
    fBehaviors.add(settings, "reframe");
    fBehaviors.add(settings, "showBot");
    fBehaviors.add(settings, "contrast");
    fBehaviors.add(settings, "autoReset");
    // refresh
    var fReset = fBehaviors.addFolder("Reset");
    fReset.add(settings, "resetFreq", 200, 1500);
    fReset.add(settings, "autoRandomize");
    fReset.add(settings, "autoCapture");
    // actions
    var fActions = gui.addFolder("Actions");
    fActions.open();
    fActions.add(actions, "randomize");
    fActions.add(actions, "reset");
    fActions.add(actions, "randReset");
    fActions.add(actions, "capture");

    autoStretchP5(p5);
    reset();
  };

  function randomize() {
    settings.resetFreq = randomInt(200, 1500);
    settings.background = randomInt(0, 100);
    settings.saturation = randomInt(80, 100);
    settings.brightness = randomInt(80, 100);
    settings.opacity = randomInt(0, 100);
    settings.maxBots = randomInt(8, 200);
    settings.popFreq = randomInt(1, 20);
    settings.minSpeed = p5.random(0, 2);
    settings.maxSpeed = p5.random(0, 100);
    settings.minSize = p5.random(1, 20);
    settings.maxSize = p5.random(settings.minSize, 100);
    settings.attDist = p5.random(10, 400);
    settings.attract = rollDice(2);
    settings.reframe = rollDice(2);
    settings.showBot = rollDice(8);
    settings.contrast = rollDice(12);

    gui.updateDisplay();
  }

  function reset() {
    if (settings.autoRandomize) randomize();

    // reset canvas
    lastCap = p5.frameCount;
    p5.background(settings.background);
    bots = [];
  }

  function capture() {
    p5.saveCanvas("frame" + getTimestamp(), "jpg");
  }

  p5.draw = () => {
    // store bots to destroy after loop
    var destroy = [];

    for (let i = 0; i < bots.length; i++) {
      var bot = bots[i];

      if (
        bot.pos.x < 0 ||
        bot.pos.x > p5.width ||
        bot.pos.y < 0 ||
        bot.pos.y > p5.height
      ) {
        destroy.push(bot);
        break;
      }

      // store neighbouring bots
      var neighbors = [];

      for (let j = 0; j < bots.length; j++) {
        if (i !== j) {
          var neighbor = bots[j];
          var d = bot.pos.dist(neighbor.pos);

          // check for attraction
          if (d < settings.attDist + bot.size / 2 + neighbor.size / 2)
            neighbors.push(neighbor);

          // check for merging
          if (d < bot.size / 2 && bot.size >= neighbor.size) {
            bot.merge(neighbor);
            destroy.push(neighbor);
          }
        }
      }

      bot.update(neighbors);
      bot.draw();

      // destroy bots that reaches max size
      if (bot.size > settings.maxSize) destroy.push(bot);
    }

    // destroy big and merged bots
    for (let i = 0; i < destroy.length; i++) {
      var index = bots.indexOf(destroy[i]);
      if (index !== -1) bots.splice(index, 1);
    }

    // add some bubbles to the bots
    // frameCount % n === 0 is for rate limiting
    if (
      bots.length < settings.maxBots &&
      p5.frameCount % settings.popFreq === 0
    )
      bots.push(new Bot(p5.random(p5.width), p5.random(p5.height)));

    // check for drawing completion and dump
    if (settings.autoReset && p5.frameCount - lastCap >= settings.resetFreq) {
      if (settings.autoCapture) capture();

      reset();
    }
  };

  function Bot(x, y) {
    this.pos = p5.createVector(x, y);
    this.vel = p5.createVector(p5.random(-1, 1), p5.random(-1, 1));
    this.size = settings.minSize;
    this.hue = randomInt(0, 100);
    this.neighbors = [];

    // helpers
    var that = this;
    var getColor = function() {
      if (settings.contrast) {
        return p5.color(
          0,
          0,
          p5.map(settings.background, 0, 100, 100, 0),
          settings.opacity
        );
      } else {
        return p5.color(
          that.hue,
          settings.saturation,
          settings.brightness,
          settings.opacity
        );
      }
    };

    this.update = function(neighbors) {
      this.neighbors = neighbors;

      // calculate acceleration and velocity
      var acc = this.vel.copy().mult(0.01);
      this.vel.add(acc);

      // apply neighbor attraction to velocity
      for (let i = 0; i < this.neighbors.length; i++) {
        var neighbor = this.neighbors[i];
        // calculate vector to neighbor
        var att = neighbor.pos.copy().sub(this.pos);
        // bigger are attracted by smaller
        var amt = this.size > neighbor.size ? 0.01 : -0.01;
        // steering with deceleration
        if (settings.attract) this.vel.lerp(att, amt).sub(acc);
      }

      // limit max speed
      var limit = p5.map(
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
      if (settings.reframe) reframeVector(this.pos);
    };

    this.merge = function(merged) {
      // recolor based on size ratio
      var sRatio = merged.size / (this.size + merged.size);
      this.hue = p5.lerp(
        p5.max(this.hue, merged.hue),
        p5.min(this.hue, merged.hue),
        sRatio
      );
      // grow the size by a fixed ratio
      this.size += merged.size * 0.5;
    };

    this.draw = function() {
      // draw bot positions
      if (settings.showBot) {
        p5.noStroke();
        p5.fill(getColor());
        p5.ellipse(this.pos.x, this.pos.y, this.size, this.size);
      }

      // draw lasers between bots
      for (let i = 0; i < this.neighbors.length; i++) {
        var neighbor = this.neighbors[i];
        p5.strokeWeight(1);
        p5.stroke(getColor());

        // prevents drawing link to reframed neighbors
        if (
          this.pos.dist(neighbor.pos) <
          settings.attDist + this.size / 2 + neighbor.size / 2
        )
          p5.line(this.pos.x, this.pos.y, neighbor.pos.x, neighbor.pos.y);
      }
    };
  }

  ///////////////////
  // event hookups //
  ///////////////////

  p5.keyPressed = () => {
    if (p5.key === "R") reset();
  };

  ///////////////
  // utilities //
  ///////////////

  function randomInt(min, max) {
    return p5.floor(p5.random() * (max - min + 1)) + min;
  }

  function rollDice(faces) {
    return randomInt(1, faces) === 1;
  }

  function reframe(val, min, max) {
    var res = val;
    var d = p5.abs(max - min);

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

  function reframeVector(v) {
    v.x = reframe(v.x, 0, p5.width);
    v.y = reframe(v.y, 0, p5.height);
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
};
