// thedotismoving - number 1 by lionel ringenbach @ ucodia.space

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

var n = 8;
var space = 100;
var dots2 = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    rectMode(CENTER);
    frameRate(8);
    
    var blue = color(57, 182, 220);
    var red = color(206, 39, 59);
    for (var i = 0; i < dots.length; i++) {
        dots[i].c = i % 2 === 0 ? blue : red;
        dots[i].s = square(dots[i].x, dots[i].y);
    }
}

// function layout() {
//     for (var i = 0; i < n; i++) {
//         dots2[i] = [];
//         var n2 = i % 2 === 0 ? n : n - 1;
//         var offset = i % 2 === 0 ? 0 : space / 2;
//         for (var j = 0; j < n2; j++) {
//             var dots2[i][j] = {
//                 x: i * i * space,
//                 y: j * i
//             };
//         }
//     }
// }

function draw() {
    clear();
    
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

function hypot(opp, adj) {
    if (!adj) adj = opp;
    return Math.sqrt(Math.pow(opp, 2) + Math.pow(adj));
}