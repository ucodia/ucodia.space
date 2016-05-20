// drawbot #1 by lionel ringenbach @ ucodia.io

/////////////
// program //
/////////////

// globals
var bots = [];
var lastCap = 0;

// settings
var settings = {};
settings.back = 20;
settings.opacity = 50;
settings.maxBubs = 80;
settings.minSpeed = 1;
settings.maxSpeed = 1;
settings.attDist = 100;
settings.minSize = 20;
settings.maxSize = 200;
settings.popFreq = 1;
settings.capFreq = 3000;
settings.dump = false;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(60);
  colorMode(HSB, 100);
  
  // set parameters from URL
  var params = getURLParams();
  settings.dump =  params.dump ? JSON.parse(params.dump) : false;
  
  reset();
}

function reset() {
  // randomize settings
  settings.back = randomInt(0, 100);
  settings.opacity = randomInt(0, 100);
  settings.maxBubs = randomInt(8, 200);
  settings.minSpeed = random(0, 2);
  settings.maxSpeed = randomInt(settings.minSpeed, 100);
  settings.attDist = randomInt(10, 400);
  settings.minSize = randomInt(1, 20);
  settings.maxSize = randomInt(settings.minSize, 100);
  settings.popFreq = randomInt(1, 20);
  settings.capFreq = randomInt(200, 1500);
  
  // behaviors
  settings.attract = rollDice(2);
  settings.reframe = rollDice(2);
  settings.showbot = rollDice(8);
  settings.contrast = rollDice(12);
  
  // reset canvas
  background(settings.back);
  bots = [];
}

function draw() {
  // store bots to destroy after loop
  var destroy = [];
  
  for (var i = 0; i < bots.length; i++) {
    var bot = bots[i];
    
    if (bot.pos.x < 0 || bot.pos.x > width ||
        bot.pos.y < 0 || bot.pos.y > height) {
      destroy.push(bot);
      break;     
    }
    
    // store neighbouring bots
    var neighbors = [];
    
    for (var j = 0; j < bots.length; j++) {
      if (i !== j) {
        var neighbor = bots[j];
        var d = bot.pos.dist(neighbor.pos);
        
        // check for attraction
        if (d < (settings.attDist + bot.size / 2 + neighbor.size / 2))
          neighbors.push(neighbor);
        
        // check for merging
        if (d < (bot.size / 2) && bot.size >= neighbor.size) {
          bot.merge(neighbor);
          destroy.push(neighbor);      
        }  
      }
    }
    
    bot.update(neighbors);
    bot.draw();
    
    // destroy bots that reaches max size
    if (bot.size > settings.maxSize)
      destroy.push(bot);
  }
  
  // destroy big and merged bots
  for (var i = 0; i < destroy.length; i++) {
    var index = bots.indexOf(destroy[i]);
    if (index !== -1)
      bots.splice(index, 1);
  }
  
  // add some bubbles to the bots
  // frameCount % n === 0 is for rate limiting
  if (bots.length < settings.maxBubs && frameCount % settings.popFreq === 0)
    bots.push(new Bot(random(width), random(height)));
   
  // check for drawing completion and dump
  if ((frameCount - lastCap) % settings.capFreq === 0) {
    if (settings.dump)
      saveCanvas("frame" + getTimestamp(), "jpg");
    
    lastCap = frameCount;
    reset();
  }
}

function Bot(x, y) {
  this.pos = createVector(x, y);
  this.vel = createVector(random(-1, 1), random(-1, 1));
  this.size = settings.minSize;
  this.hue = randomInt(0, 100);
  this.neighbors = [];
  
  // helpers
  var that = this;
  var getColor = function() {
    // map opacity to bot size
    var opacity = map(that.size, settings.minSize, settings.maxSize, 80, 5);
    
    return settings.contrast ?
      color(0, 0, map(settings.back, 0, 100, 100, 0), settings.opacity) :
      color(that.hue, 80, 80, settings.opacity);
  }
  
  this.update = function(neighbors) {
    this.neighbors = neighbors;
    
    // calculate acceleration and velocity
    var acc = p5.Vector.mult(this.vel, 0.01);
    this.vel.add(acc);
    
    // apply neighbor attraction to velocity
    for (var i = 0; i < this.neighbors.length; i++) {
      var neighbor = this.neighbors[i];     
      // calculate vector to neighbor
      var att = p5.Vector.sub(neighbor.pos, this.pos); 
      // bigger are attracted by smaller
      var amt = this.size > neighbor.size ? 0.01 : -0.01; 
      // steering with deceleration
      if (settings.attract)
        this.vel.lerp(att, amt).sub(acc);
    }

    // limit max speed
    var limit = map(this.size, settings.minSize, settings.maxSize, settings.maxSpeed, settings.minSpeed);
    this.vel.limit(limit);
    // move position
    this.pos.add(this.vel);
    // reframe position
    if (settings.reframe)
      reframeVector(this.pos);
  };
  
  this.merge = function(merged) {
    // recolor based on size ratio
    var sRatio = merged.size / (this.size + merged.size);
    this.hue = lerp(max(this.hue, merged.hue), min(this.hue, merged.hue), sRatio);
    // grow the size by a fixed ratio
    this.size += merged.size * 0.5;
  }
  
  this.draw = function() {  
    // draw bot positions
    if (settings.showbot) {
      noStroke();
      fill(getColor());
      ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }
    
    // draw lasers between bots
    for (var i = 0; i < this.neighbors.length; i++) {
      var neighbor = this.neighbors[i];
      strokeWeight(1);
      stroke(getColor());
      
      // prevents drawing link to reframed neighbors
      if (this.pos.dist(neighbor.pos) < (settings.attDist + this.size / 2 + neighbor.size / 2))
        line(this.pos.x, this.pos.y, neighbor.pos.x, neighbor.pos.y);
    }
  };
}

///////////////////
// event hookups //
///////////////////

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function keyPressed() {
  if (key === 'R')
    saveCanvas("frame" + getTimestamp(), "png");
}

///////////////
// utilities //
///////////////

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollDice(faces) {
	return randomInt(1, faces) === 1;
}

function reframe(val, min, max) {
  var res = val;
  var d = abs(max - min);
  
  if (val < min) {
    var dif = min - val;
    var off = dif % d;
    res = max - off;
  }
  else if (val > max) {
    var dif = val - max;
    var off = dif % d;
    res = min + off;
  }
  
  return res;
}

function reframeVector(v) {
  v.x = reframe(v.x, 0, width);
  v.y = reframe(v.y, 0, height);
}

function getTimestamp() {
  return new Date().toISOString().split("-").join("")
                                 .split("T").join("-")
                                 .split(":").join("");
}