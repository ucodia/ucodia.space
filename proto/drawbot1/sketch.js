// drawbot #1 by lionel ringenbach @ ucodia.io

/////////////
// program //
/////////////

// globals
var bath = [];
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
  createCanvas(1920, 1200);
  frameRate(60);
  colorMode(HSB, 100);
  
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
  settings.maxSpeed = randomInt(0, 100);
  settings.attDist = randomInt(10, 400);
  settings.minSize = randomInt(10, 100);
  settings.maxSize = randomInt(settings.minSize, 1000);
  settings.popFreq = randomInt(1, 20);
  settings.capFreq = randomInt(200, 1500);
  
  // extra
  settings.bounce = randomInt(0, 3) === 0;
  settings.reframe = randomInt(0, 3) === 0;
  
  // reset canvas
  background(settings.back);
  bath = [];
}

function draw() {
  //background(20);
  
  // store bubbles to explode after loop
  var explode = [];
  
  for (var i = 0; i < bath.length; i++) {
    var bubble = bath[i];
    
    if (bubble.pos.x < 0 || bubble.pos.x > width ||
        bubble.pos.y < 0 || bubble.pos.y > height) {
      explode.push(bubble);
      break;     
    }
    
    var neighbors = [];

    bubble.draw();
    
    for (var j = 0; j < bath.length; j++) {
      if (i !== j) {
        var neighbor = bath[j];
        var d = bubble.pos.dist(neighbor.pos);
        
        // check for attraction
        if (d < (settings.attDist + bubble.size / 2 + neighbor.size / 2))
          neighbors.push(neighbor);
        
        // check for merging
        if (d < (bubble.size / 2) && bubble.size >= neighbor.size) {
          line(bubble.pos.x, bubble.pos.y, neighbor.pos.x, neighbor.pos.y);
          bubble.merge(neighbor);
          explode.push(neighbor);      
        }  
      }
    }
    
    bubble.update(neighbors);
    
    // explode bubbles that reaches max size
    if (bubble.size > settings.maxSize)
      explode.push(bubble);
  }
  
  // explode big and merged bubbles
  for (var i = 0; i < explode.length; i++) {
    var index = bath.indexOf(explode[i]);
    if (index !== -1)
      bath.splice(index, 1);
  }
  
  // add some bubbles to the bath
  // frameCount % n === 0 is for rate limiting
  if (bath.length < settings.maxBubs && frameCount % settings.popFreq === 0)
    bath.push(new Bubble(random(width), random(height)));
    
  if ((frameCount - lastCap) % settings.capFreq === 0) {
    if (settings.dump)
      saveCanvas("frame" + getTimestamp(), "jpg");
    
    lastCap = frameCount;
    reset();
  }
}

function Bubble(x, y) {
  // physics
  this.pos = createVector(x, y);
  this.vel = createVector(random(-1, 1), random(-1, 1));

  // aspect
  this.size = settings.minSize;
  this.hue = randomInt(0, 100);
  
  // helpers
  var that = this;
  var getColor = function() {
    // map opacity to bubble size
    var opacity = map(that.size, settings.minSize, settings.maxSize, 80, 5);
    return color(that.hue, 80, 80, settings.opacity);
  }
  
  this.update = function(neighbors) {
    // calculate acceleration and velocity
    var acc = p5.Vector.mult(this.vel, 0.01);
    this.vel.add(acc);
    
    // apply neighbor attraction to velocity
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];     
      // calculate vector to neighbor
      var att = p5.Vector.sub(neighbor.pos, this.pos); 
      // bigger are attracted by smaller
      var amt = this.size > neighbor.size ? 0.01 : -0.01; 
      // steering with deceleration
      if (settings.bounce)
        this.vel.lerp(att, amt).sub(acc);
      
      strokeWeight(1);
      stroke(getColor());
      line(this.pos.x, this.pos.y, neighbor.pos.x, neighbor.pos.y);
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
    noStroke();
    fill(getColor());
    //ellipse(this.pos.x, this.pos.y, settings.minSize, settings.minSize);
  };
}

///////////////////
// event hookups //
///////////////////

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