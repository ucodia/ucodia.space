// vintage by lionel ringenbach @ ucodia.space

var t = 0;
var n = 100;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB);
}

function draw() {
    background(0);
    translate(width /2, height / 2);

    var colorRange = 360 / 6;
    var colorCursor = t % 360;
    var color = map(colorCursor, 0, 360, colorCursor, colorCursor + colorRange);
    stroke(color, 80, 80, 0.9);
    strokeWeight(2);

    for (var i = 0; i < n; i++) {
        var inc = i * 0.5;
        line(x1(t + inc), y1(t + inc),
             x2(t + inc), y2(t + inc));
    }

    for (var i = 0; i < n; i++) {
        var inc = i * 0.5;
        line(x3(t + inc), y3(t + inc),
             x4(t + inc), y4(t + inc));
    }

    t += map(mouseX, 0, width, -4, 4);
}

function x1(t) {
    return sin(t / 10) * 300 + sin(t / 10) * 20;
}

function y1(t) {
    return cos(t / 10) * 100;
}

function x2(t) {
    return sin(t / 10) * 300 + sin(t) * 2;
}

function y2(t) {
    return cos(t / 20) * 100 + cos(t /12) * 200;
}

function x3(t) {
    return sin(t / 5) * 200 + sin(t / 7) * 50;
}

function y3(t) {
    return cos(t / 10) * 300;
}

function x4(t) {
    return sin(t / 10) * 300 + sin(t / 45) * 2;
}

function y4(t) {
    return cos(t / 20) * 100 + cos(t / 19) * 200;
}