// diamonds by lionel ringenbach @ ucodia.io

var n = 3;
var start = 1;
var spaceRatio = 0.2;
var diams = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();

  var spacing = width * spaceRatio / (n + 1);
  var r = width * (1 - spaceRatio) / (n * 2);
  var baseY = height / 2;

  for (var i = 0; i < n; i++) {
  	var c1 = (i + 1) * spacing;
  	var c2 = 2 * r * i + r;
  	var baseX = c1 + c2;
  	diams[i] = new Diamond(baseX, baseY, r, 8);
  	diams[i].offset(HALF_PI * start + HALF_PI * i);
  }
}

function draw() {
  background(255);

  for (var i = 0; i < n; ++i) {
    diams[i].draw();
    diams[i].move(TWO_PI / 720);
  }
}

function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight);
	var spacing = width * spaceRatio / (n + 1);
	var r = width * (1 - spaceRatio) / (n * 2);
	var baseY = height / 2;

	for (var i = 0; i < n; i++) {
	  var c1 = (i + 1) * spacing;
	  var c2 = 2 * r * i + r;
	  var baseX = c1 + c2;
	  diams[i].reset(baseX, baseY, r);
	}
}

function Diamond(x, y, r, n) {
  var that = this;

  // states
  this.center = createVector(x, y);
  this.radius = r;
  this.n = n;

  // colors
  this.alpha = 50;
  this.cyan = color(0, 174, 239);
  this.magenta = color(236, 0, 140);
  this.yellow = color(255, 242, 0);

  // init
  this.dots = [];
  for (var i = 0; i < n; i++) {
    this.dots[i] = i * TWO_PI / n;
  }

  this.offset = function(value) {
	  while(this.dots[0] < value) {
	    this.move(HALF_PI);
	  }
  };

  this.reset = function(x, y, r) {
  	this.center = createVector(x, y);
  	this.radius = r;
  };

  this.move = function(angle) {
  	for (var i = 0; i < this.dots.length; ++i) {
      var sel = (i + 2) % 2;
      this.dots[i] += angle * (sel + 1);
    }
  };

  this.draw = function() {
    for (var i = 0; i < this.dots.length; i++) {
      var sel = (i + 3) % 3;

      if (sel === 0)
        fill(this.cyan, this.alpha);
      else if (sel === 1)
        fill(this.yellow, this.alpha);
      else if (sel === 2)
        fill(this.magenta, this.alpha);

      for (var j = 0; j < this.dots.length; j++) {
      	if (i != j) {
      		var p1 = edge(this.dots[i]);
      		var p2 = edge(this.dots[j]);
      		triangle(p1.x, p1.y, this.center.x, this.center.y, p2.x, p2.y);
      	}
      }
    }
  };

  var edge = function(angle) {
    return createVector(that.radius * cos(angle) + that.center.x,
    				    that.radius * sin(angle) + that.center.y);
  };
}
