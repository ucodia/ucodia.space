// thedotismoving - number 2 by lionel ringenbach @ ucodia.io

var dots = [];
var nDots = 48;
var nCircles = 12;
var layoutRatio = 0.3;
var sizeRatio = 0.5;
var circleSize;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(30);
    
    layout();
}

function layout() {
    circleSize = min(width, height);
    var layoutSize = circleSize * layoutRatio;
    var centerX = width / 2;
    var centerY = height / 2;
    var inc = TAU / nDots;
    
    for (var i = 0; i < nDots; i++) {
        dots[i] = pointOnCircle(centerX, centerY, i * inc, layoutSize / 2);
    }
}

function draw() {
    clear();
    
    // circle style
    fill(0);
    stroke(255);
    strokeWeight(circleSize * 0.005);

    for (var i = 0; i < dots.length; i++) {
        var dot = dots[i];
        var s = circleSize * sizeRatio;
               
        if (i < dots.length - 1)
            ellipse(dot.x, dot.y, s, s);
        else
            circles(dot.x, dot.y, s, nCircles);       
    }

    // animate
    dots.push(dots.shift());
}

function circles(x, y, size, n) {
    var inc = size / n;
    
    for (var i = n; i > 0; i--) {
        var s = inc * i;
        ellipse(x, y, s, s);   
    }
}

function pointOnCircle(x, y, angle, radius) {
    return {
        x: radius * cos(angle) + x,
        y: radius * sin(angle) + y
    };
}

function windowResized() {
    noLoop();
    resizeCanvas(window.innerWidth, window.innerHeight);
    layout();
    loop();
}