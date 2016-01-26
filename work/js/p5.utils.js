p5.prototype.lerpGradient = function (palette, amt) {
  var pos = map(amt, 0, 1, 0, palette.length);
  var sel = Math.floor(pos) % palette.length;
   
  var from = palette[sel];
  var to = palette[(sel + 1) % palette.length];
  var innerPos = pos % 1; 
  
  return lerpColor(from, to, innerPos);
}

p5.prototype.equi = function (x, y, size, mode) {
  // the mode changes vertical centering
  var m = mode | 0;
  var h = triHeight(size, size / 2);
  var h3 = h / 3;

  var x1 = x;
  var x2 = x - size / 2;
  var x3 = x + size / 2;

  if (mode == 0) {
    var y1 = y - 2 * h3;
    var y2 = y + h3;
    var y3 = y + h3;
  }
  else {
    var y1 = y - h / 2;
    var y2 = y + h / 2;
    var y3 = y + h / 2;
  }

  this.triangle(x1, y1, x2, y2, x3, y3);
}

// functions
function triHeight(hypo, a) {
  return sqrt(pow(hypo, 2) - pow(a, 2));
}
