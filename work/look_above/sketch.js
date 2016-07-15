// look above by lionel ringenbach @ ucodia.space

var sky;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();

  sky = new Sky();
}

function draw() {
  sky.draw();
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function mousePressed() {
  sky.rebirth();
}

// objects

function Sky() {
  this.color = color(0, 12, 26);
  this.density = 0;

  // star size generator
  this.rand = new RandomP();
  this.rand.add(7, 9, 10000);
  this.rand.add(5, 7, 1000);
  this.rand.add(4, 5, 100);
  this.rand.add(3, 4, 10);
  this.rand.add(0, 3, 1);

  this.rebirth = function() {
    this.density = random(0.02, 0.1) / 1000;
    var n = displayWidth * displayHeight * this.density;

    this.stars = [];
    for (var i = 0; i < n; i++) {
      this.stars[i] = new Star(this.rand.next());
    }
  }

  this.draw = function() {
    background(this.color);

    for (var i = 0; i < this.stars.length; i++) {
      this.stars[i].draw();
    }
  }

  this.rebirth();
}

function Star(size) {
  this.color = color(255);
  this.x = 0;
  this.y = 0;
  this.size = size;

  this.rebirth = function() {
    this.x = random(displayWidth);
    this.y = random(displayHeight);
  }

  this.draw = function() {
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }

  this.rebirth();
}

// tools

function RandomP() {
  this.ranges = [];
  this.n = 0;

  this.add = function(min, max, p) {
    this.ranges[this.n] = { min: min, max: max, p: p };
    this.n++;
  }

  this.next = function() {
    for (var i = 0; i < this.ranges.length; i++) {
      var r = this.ranges[i];

      if (randomInt(0, r.p - 1) == 0) {
        return random(r.min, r.max);
      }
    };
  }
}

function randomInt(min, max) {
  return floor(random(min, max + 1));
}