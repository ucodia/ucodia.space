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
