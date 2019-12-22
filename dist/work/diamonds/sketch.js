// diamonds by lionel ringenbach @ ucodia.space

var n = 3;
var start = 1;
var spaceRatio = 0.2;
var diams = [];
var paused = false;

function setup() {
  createCanvas();
  frameRate(30);

  restart();
}

function restart() {
  paused = true;
  resizeCanvas(window.innerWidth, window.innerHeight); 
    
  var spacing = width * spaceRatio / (n + 1);
  var r = width * (1 - spaceRatio) / (n * 2);
  var baseY = height / 2;

  for (var i = 0; i < n; i++) {
  	var c1 = (i + 1) * spacing;
  	var c2 = 2 * r * i + r;
  	var baseX = c1 + c2;
      
    var offset = (i + 1) * 0.25;
    if (diams[i])
        offset = diams[i].pos();
   
  	diams[i] = createDiamond(baseX, baseY, r, 8, offset);
  }
  
  paused = false;
}

function draw() {
  if (paused) return;
  
  background(255);
  noStroke();

  for (var i = 0; i < n; ++i) {
    diams[i].draw();
    diams[i].move();
  }
}

function windowResized() {
	restart();
}

function createDiamond(x, y, radius, sides, offset, inc, palette) {
    if(!x) x = 0;
    if(!y) y = 0;
    if(!radius) radius = 100;
    if(!sides) sides = 8;
    if(!offset) offset = 0;
    if(!palette) {
        palette = [color(0, 174, 239, 50),  // cyan
                   color(255, 242, 0, 50),  // yellow
                   color(236, 0, 140, 50)]; // magenta
                   
    };
    if(!inc) inc = 1 / 1000;
    
    var position = constrain(offset, 0, 1);
    
    return {
        draw: function () {
            diamond(x, y, radius, sides, position, palette);
        },
        move: function () {
            position += inc;
            if (position > 1)
                position = position % 1;
        },
        pos() {
            return position;
        }
    }
}

function diamond(x, y, radius, sides, offset, palette) {
    if(!offset) offset = 0;
    var points = [];
    
    // map percentage to radian
    baseAngle = map(offset, 0, 1, 0, TWO_PI);
    
    for (var i = 0; i < sides; i++) {
        var startAngle = baseAngle + (TWO_PI / sides * i);
        var addedAngle = i % 2 === 0 ? 0 : baseAngle;
        points[i] = pointOnCircle(x, y, startAngle + addedAngle, radius);
    }
    
    for (var i = 0; i < points.length; i++) {
      // select color from palette
      var sel = (i) % (palette.length);
      fill(palette[sel]);
      
      for (var j = 0; j < points.length; j++) {
      	if (i != j) {
      		var p1 = points[i];
      		var p2 = points[j];
      		triangle(x, y, p1.x, p1.y, p2.x, p2.y);
      	}
      }
    }
}

function pointOnCircle(x, y, angle, radius) {
    return {
        x: radius * cos(angle) + x,
        y: radius * sin(angle) + y
    };
}