// thedotismoving - number 1 by lionel ringenbach @ ucodia.io

var dots = [
    { x: 200, y: 200 },
    { x: 325, y: 325 },
    { x: 450, y: 200 },
    { x: 575, y: 325 },
    { x: 200, y: 450 },
    { x: 325, y: 575 },
    { x: 450, y: 450 },
    { x: 575, y: 575 }
];

function setup() {
    createCanvas(800, 800);
    rectMode(CENTER);
    frameRate(8);
    
    var blue = color(57, 182, 220);
    var red = color(206, 39, 59);
    for (var i = 0; i < dots.length; i++) {
        dots[i].c = i % 2 === 0 ? blue : red;
        dots[i].s = square(dots[i].x, dots[i].y);
    }
}

function draw() {
    background(235);
    
    for (var i = 0; i < dots.length; i++) {
        var dot = dots[i];
        
        push();
        
        translate(dot.x, dot.y);
        rotate(PI / 4);
        translate(-dot.x, -dot.y);
        noFill();
        stroke(dot.c);
        dot.s.draw();;
        dot.s.move();
        
        pop();
    }
    
}

function square(x, y) {
    var values = [];
    var n = 8;
    var base = 1.2;
    var space = base * 20;
    
    for (var i = 0; i < n; i++) {
        values[i] = (n - i) * base;
    }
    
    var draw = function() {
        for (var i = 0; i < values.length; i++) {
            var w = i * space + base;
            strokeWeight(values[i]);
            rect(x, y, w, w);
        }
    }
    
    var move = function() {
        var value = values.pop();
        values.splice(0, 0, value);
    }
    
    return {
        draw: draw,
        move: move
    }
}