import autoStretchP5 from "@/utils/autoStretchP5";

export const meta = {
  name: "Circuit",
  created: "2016-04-06",
};

const circuits = (sketch) => {
  // display parameters
  const gridSize = 30;
  const padSizeRatio = 0.45;
  const traceWidthRatio = 0.15 * padSizeRatio;
  let isDarkTheme = true;

  // data
  let currentModel;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

    autoStretchP5(sketch, () => {
      currentModel = generateModel();
      sketch.draw();
    });
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };

  sketch.keyPressed = () => {
    switch (sketch.key) {
      case "s": {
        sketch.save(`circuit.png`);
        break;
      }
      case "b": {
        isDarkTheme = !isDarkTheme;
        sketch.draw();
        break;
      }
      case "n": {
        currentModel = generateModel();
        sketch.draw();
        break;
      }
      default: {
      }
    }
  };

  sketch.mousePressed = () => {
    currentModel = generateModel();
    sketch.draw();
    return false;
  };

  sketch.draw = () => {
    sketch.clear();
    sketch.background(isDarkTheme ? "#000" : "#fff");
    sketch.push();

    const tX = (sketch.width - currentModel.circuit.cols * gridSize) / 2;
    const tY = (sketch.height - currentModel.circuit.rows * gridSize) / 2;
    sketch.translate(tX, tY);

    for (var i = 0; i < currentModel.circuit.paths.length; i++) {
      var path = currentModel.circuit.paths[i];
      var color = currentModel.palette[path.color];
      var padStyle = currentModel.padStyles[path.padStyle];

      drawPath(path, color, padStyle);
    }

    sketch.pop();
    sketch.noLoop();
  };

  function generateModel() {
    var nColors = randomInt(2, 4);
    var colorOffset = sketch.random(0, 1);
    var palette = createPalette(nColors, colorOffset);
    var padStyles = [
      (color) => {
        sketch.fill(color);
      },
      () => {
        sketch.noFill();
      },
    ];

    var cols = sketch.floor(sketch.width / gridSize);
    var rows = sketch.floor(sketch.height / gridSize);
    var circuit = createCircuit(cols, rows, palette.length, padStyles.length);

    return {
      circuit,
      palette,
      padStyles,
    };
  }

  function drawPath(path, color, padStyle) {
    sketch.strokeWeight(gridSize * traceWidthRatio);

    drawTrace(path.nodes, color);

    drawPad(path.nodes[0], color, padStyle);
    if (path.nodes.length === 1) return;
    drawPad(path.nodes[path.nodes.length - 1], color, padStyle);
  }

  function drawTrace(nodes, color) {
    sketch.noFill();
    sketch.beginShape();

    for (let i = 0; i < nodes.length - 1; i++) {
      sketch.stroke(color);

      let origin = getPosition(nodes[i], gridSize);
      let target = getPosition(nodes[i + 1], gridSize);

      // if first node in path
      if (i === 0) {
        const angle = target.copy().sub(origin).heading();
        const newOrigin = pointOnCircle(
          origin.x,
          origin.y,
          angle,
          (gridSize * padSizeRatio) / 2
        );
        origin.set(newOrigin);
      }
      // if last node in path
      if ((i === 0 && nodes.length === 2) || i === nodes.length - 2) {
        const angle = origin.copy().sub(target).heading();
        const newTarget = pointOnCircle(
          target.x,
          target.y,
          angle,
          (gridSize * padSizeRatio) / 2
        );
        target.set(newTarget);
      }

      sketch.vertex(origin.x, origin.y);
      sketch.vertex(target.x, target.y);
    }
    sketch.endShape();
  }

  function drawPad(node, color, padStyle) {
    const pos = getPosition(node, gridSize);

    sketch.stroke(color);
    padStyle(color);
    sketch.ellipse(
      pos.x,
      pos.y,
      gridSize * padSizeRatio,
      gridSize * padSizeRatio
    );
  }

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
        const empty = randomInt(1, 4) === 1;
        if (empty) continue;

        // generate new path length
        var pathLength = randomInt(1, cols);

        // start new path with new node
        var current = { x: i, y: j };
        var path = {
          nodes: [],
          color: randomInt(0, nColors - 1),
          padStyle: randomInt(0, nStyles - 1),
        };
        path.nodes.push(current);
        paths.push(path);

        // update reference gridnn
        grid[i][j] = current;

        // generate path
        while (path.nodes.length < pathLength) {
          const last = path.nodes[path.nodes.length - 1];
          const next = { x: last.x, y: last.y };
          const dir = randomInt(0, 1);

          // dir = 0 -> navigate to right
          if (dir === 0) {
            next.x++;
          }
          // dir = 1 -> navigate to bottom right
          else if (dir === 1) {
            next.x++;
            next.y++;
          }

          // exit prematurely in case
          // next position is outside boundaries
          // or already has a node
          if (next.x >= cols || next.y >= rows || grid[next.x][next.y]) break;

          // update reference grid
          grid[next.x][next.y] = next;
          path.nodes.push(next);
        }
      }
    }

    return {
      cols: cols,
      rows: rows,
      paths: paths,
    };
  }

  function createPalette(n, offset) {
    var palette = [];

    sketch.push();
    sketch.colorMode(sketch.HSB, n, 100, 100);
    for (var i = 0; i < n; i++) {
      var hue = (i + offset) % n;
      palette[i] = sketch.color(hue, 70, 90);
    }
    sketch.pop();

    return palette;
  }

  function getPosition(pos, scale) {
    return new sketch.createVector(
      pos.x * scale + scale / 2,
      pos.y * scale + scale / 2
    );
  }

  function pointOnCircle(x, y, angle, radius) {
    return new sketch.createVector(
      radius * Math.cos(angle) + x,
      radius * Math.sin(angle) + y
    );
  }

  function randomInt(min, max) {
    return sketch.floor(sketch.random() * (max - min + 1)) + min;
  }
};

export default circuits;
