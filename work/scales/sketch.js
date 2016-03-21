var scaleW = 100;
var scaleH = 120;
var hSpace = 100;
var vSpace = 70;

var gradients = [];
var sel = 0;

function preload() {
  gradients = loadJSON('gradients.json');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  
  // try to get gradient from URL   
  try { sel = JSON.parse(getParameterByName("style")); }
  catch (e) {}
        
  // if there is no proper URL defined gradient
  if (typeof(sel) !== 'number' || sel < 0 || sel > gradients.length - 1)
    sel = randomInt(0, gradients.length - 1);
}

function draw() {
  background(255);

  var gradient = gradients[sel];
  var cols = Math.ceil(width / hSpace) + 1;
  var rows = Math.ceil(height / vSpace);
  var xOffset = (width - (cols * hSpace)) / 2;
  
  for (var i = 0; i < rows; i++) {
    var y = (rows - i - 1) * vSpace;
    var c = lerpGradient(gradient, i / (rows - 1));
      
    for (var j = 0; j < cols; j++) {
      var x = j * hSpace + xOffset;
         
      if (i % 2 !== 0)
        x += hSpace / 2;
      
      noStroke();
      fill(c);
      fishscale(x, y, scaleW, scaleH);
    }
  }
  
  noLoop();
}

function fishscale(x, y, w, h) {
  var mid = h - (w / 2);
  rect(x, y, w, mid);
  arc(x + w / 2, y + mid, w, w, 0, PI, OPEN);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  draw();
}

function mousePressed() {
  sel = randomInt(0, gradients.length - 1);
  
  // set URL parameters
  var url = buildURL({style: sel});
  try { history.pushState(null, "", url); } // TODO: fix back navigation not working
  catch (e) {}
  
  draw();
}

// utilities

function buildURL(params) {
    var paramString = Object.keys(params).map(function(key) {
        return key + '=' + params[key];
    }).join('&');
    return location.origin + location.pathname + "?" + paramString;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function lerpGradient(gradient, amt) {
    if (gradient.colors.length === 2)
        return lerpColor(color(gradient.colors[0]), color(gradient.colors[1]), amt);
    
    var a = Math.floor(gradient.colors.length * amt);
    var b = a + 1;
    var low = a / gradient.colors.length;
    var high = b / gradient.colors.length;
    var pos = map(amt, low, high, 0, 1);
    
    return lerpColor(color(gradient.colors[a]), color(gradient.colors[b]), pos);
}