import { debounce } from "lodash";

export const meta = {
  name: "Circuits",
  year: "2016"
};

export default p5 => {
  // display parameters
  var scaling = 40;
  var nodeSize = scaling * 0.45;
  var linkSize = nodeSize * 0.1;
  var offset = { x: scaling / 2, y: scaling / 2 };

  // theming
  var themes;
  var currentTheme;

  // data
  var currentModel;

  // debounced layout
  const efficientLayout = debounce(layout, 400);

  function layout() {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
    currentModel = generateModel();
    drawModel(currentModel);
  }

  p5.setup = () => {
    p5.createCanvas(100, 100);

    // defaults
    themes = {
      dark: { backColor: p5.color(0) },
      light: { backColor: p5.color(255) }
    };
    currentTheme = themes.dark;

    layout();
  };

  function generateModel() {
    // generate color palette
    var nColors = randomInt(2, 4);
    var colorOffset = p5.random(0, 1);
    var palette = createPalette(nColors, colorOffset);

    // generate pad styles
    var padStyles = [regularPadStyle, padWithHoleStyle];

    // generate circuit
    var cols = p5.ceil(p5.width / scaling);
    var rows = p5.ceil(p5.height / scaling);
    var circuit = createCircuit(cols, rows, palette.length, padStyles.length);

    return {
      circuit: circuit,
      palette: palette,
      padStyles: padStyles
    };
  }

  ///////////////////////
  // drawing functions //
  ///////////////////////

  function drawModel(model) {
    p5.background(currentTheme.backColor);

    for (var i = 0; i < model.circuit.paths.length; i++) {
      var path = model.circuit.paths[i];

      // pick path color and pad style
      var color = model.palette[path.color];
      var padStyle = model.padStyles[path.padStyle];

      drawPath(path, color, padStyle);
    }
  }

  function drawPath(path, color, padStyle) {
    drawTrace(path.nodes, color);

    drawPad(path.nodes[0], color, padStyle);
    if (path.nodes.length > 1)
      drawPad(path.nodes[path.nodes.length - 1], color, padStyle);
  }

  function drawTrace(nodes, color) {
    for (var i = 0; i < nodes.length - 1; i++) {
      p5.stroke(color);
      p5.strokeWeight(linkSize);

      var lPos = getPosition(nodes[i], scaling, offset);
      var rPos = getPosition(nodes[i + 1], scaling, offset);
      p5.line(lPos.x, lPos.y, rPos.x, rPos.y);
    }
  }

  function drawPad(node, color, style) {
    var pos = getPosition(node, scaling, offset);

    // apply style and draw pad
    style(color);
    p5.ellipse(pos.x, pos.y, nodeSize, nodeSize);
  }

  // pad styles
  function regularPadStyle(color) {
    p5.noStroke();
    p5.fill(color);
  }
  function padWithHoleStyle(color) {
    p5.stroke(color);
    p5.strokeWeight(linkSize);
    p5.fill(currentTheme.backColor);
  }

  //////////////////////
  // model generation //
  //////////////////////

  function createCircuit(cols, rows, nColors, nStyles) {
    // create reference grid
    var grid = [];
    for (let i = 0; i < cols; i++) {
      if (!grid[i]) grid[i] = [];
      for (let j = 0; j < rows; j++) {
        grid[i][j] = null;
      }
    }

    // initialize paths
    var paths = [];

    // generate circuit
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // skip if node is already defined
        if (grid[i][j]) continue;

        // roll a dice for empty node
        var empty = rollDice(4);

        if (!empty) {
          // generate new path length
          var pathLength = randomInt(1, cols);

          // start new path with new node
          var current = createNode(i, j);
          var path = createPath(nColors, nStyles);
          path.nodes.push(current);
          paths.push(path);

          // update referennce grid
          grid[i][j] = current;

          // generate path
          while (path.nodes.length < pathLength) {
            var last = path.nodes[path.nodes.length - 1];
            var nextX = last.x;
            var nextY = last.y;
            var dir = randomInt(0, 1);

            // dir = 0 -> navigate to right
            if (dir === 0) {
              nextX++;
            }
            // dir = 1 -> navigate to bottom right
            else if (dir === 1) {
              nextX++;
              nextY++;
            }

            // exit prematurely in case
            // next position is outside boundaries
            // or already has a node
            if (nextX >= cols || nextY >= rows || grid[nextX][nextY]) break;

            // initialize next node
            var next = createNode(nextX, nextY);
            path.nodes.push(next);

            // update reference grid
            grid[nextX][nextY] = next;
          }
        }
      }
    }

    return {
      cols: cols,
      rows: rows,
      paths: paths
    };
  }

  function createNode(x, y) {
    return {
      x: x,
      y: y
    };
  }

  function createPath(nColors, nSytles) {
    var nodes = [];
    var color = randomInt(0, nColors - 1);
    var padStyle = randomInt(0, nSytles - 1);

    return {
      nodes: nodes,
      color: color,
      padStyle: padStyle
    };
  }

  function createPalette(n, offset) {
    if (!offset) offset = 0;

    var palette = [];

    p5.push();
    p5.colorMode(p5.HSB, n, 100, 100);
    for (var i = 0; i < n; i++) {
      var hue = (i + offset) % n;
      palette[i] = p5.color(hue, 70, 90);
    }
    p5.pop();

    return palette;
  }

  ///////////////////
  // event hookups //
  ///////////////////

  p5.windowResized = () => {
    efficientLayout();
  };

  p5.touchStarted = () => {
    currentModel = generateModel();
    drawModel(currentModel);
  };

  p5.keyPressed = () => {
    if (p5.key === " ") {
      currentTheme = currentTheme === themes.dark ? themes.light : themes.dark;
      drawModel(currentModel);
    }
  };

  ///////////////
  // utilities //
  ///////////////

  function getPosition(pos, scale, offset) {
    if (!scale) scale = 1;
    if (!offset) offset = { x: 0, y: 0 };

    return {
      x: pos.x * scale + offset.x,
      y: pos.y * scale + offset.y
    };
  }

  function randomInt(min, max) {
    return p5.floor(p5.random() * (max - min + 1)) + min;
  }

  function rollDice(faces) {
    return randomInt(1, faces) === 1;
  }
};
