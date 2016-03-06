// circuits by lionel ringenbach @ ucodia.io

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

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);	
	
    // defaults
    themes = {  
        dark: { backColor: color(0) },
        light: { backColor: color(255) }
    }
    currentTheme = themes.light;
    
	// ui
	var themeSel = createSelect();
	themeSel.option('light');
	themeSel.option('dark');
	themeSel.changed(themeChanged);
	var panel = select('#panel');
	panel.child(themeSel);
	
	currentModel = generateModel();
    drawModel(currentModel);
}

function generateModel() {	
	// generate color palette
	var nColors = randomInt(2, 4);
	var colorOffset = random(0, 1);
	var palette = createPalette(nColors, colorOffset);
	
	// generate pad styles		
	var padStyles = [regularPadStyle, padWithHoleStyle];

	// generate circuit
	var cols = Math.ceil(width / scaling);
	var rows = Math.ceil(height / scaling);	
	var circuit = createCircuit(cols, rows, palette.length, padStyles.length);

    return {
        circuit: circuit,
        palette: palette,
        padStyles: padStyles
    }
}

///////////////////////
// drawing functions //
///////////////////////

function drawModel(model) {
	background(currentTheme.backColor);
	
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
		stroke(color);
		strokeWeight(linkSize);
		
		var lPos = getPosition(nodes[i], scaling, offset);
		var rPos = getPosition(nodes[i + 1], scaling, offset);
		line(lPos.x, lPos.y, rPos.x, rPos.y);
	}
}

function drawPad(node, color, style) {
	var pos = getPosition(node, scaling, offset);
	
	// apply style and draw pad
	style(color);
	ellipse(pos.x, pos.y, nodeSize, nodeSize);	
}

// pad styles
function regularPadStyle(color) {
	noStroke();
	fill(color);
}
function padWithHoleStyle(color) {
	stroke(color);
	strokeWeight(linkSize);
	fill(currentTheme.backColor);
}

//////////////////////
// model generation //
//////////////////////

function createCircuit(cols, rows, nColors, nStyles) {	
	// create reference grid
	var grid = [];
	for	(var i = 0; i < cols; i++) {
		if (!grid[i]) grid[i] = [];
		for	(var j = 0; j < rows; j++) {
			grid[i][j] = null;
		}	
	}
	
	// initialize paths
	var paths = [];
	
	// generate circuit
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
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
					if ((nextX >= cols || nextY >= rows) || grid[nextX][nextY])
						break;
					
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
	}
}

function createNode(x, y) {
	return {
		x: x,
		y: y
	}
}

function createPath(nColors, nSytles) {
	var nodes = [];
	var color = randomInt(0, nColors - 1);
	var padStyle = randomInt(0, nSytles - 1);
	
	return {
		nodes: nodes,
		color: color,
		padStyle: padStyle
	}
}

function createPalette(n, offset) {
	if (!offset) offset = 0;
	
	var palette = []
		
	push();
	colorMode(HSB, n, 100, 100);
	for (var i = 0; i < n; i++) {
		var hue = (i + offset) % n;	
		palette[i] = color(hue, 70, 90);
	}
	pop();
	
	return palette;
}

///////////////////
// event hookups //
///////////////////

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
	currentModel = generateModel();
    drawModel(currentModel);
}

function mousePressed() {
	if (mouseButton == RIGHT) return;
	
	currentModel = generateModel();
    drawModel(currentModel);
}

function keyPressed() {
    if (key === ' ') {
        currentTheme = currentTheme === themes.dark ? themes.light : themes.dark;
        drawModel(currentModel);
    }        
}

function themeChanged(evt) {
	evt.preventDefault();
	
	if (evt && evt.target) {
        currentTheme = themes[evt.target.value];
        drawModel(currentModel);
	}
}

///////////////
// utilities //
///////////////

function getPosition(pos, scale, offset) {
	if (!scale) scale = 1;
	if (!offset) offset = { x: 0, y: 0 };
	
	return {
		x: (pos.x * scale) + offset.x,
		y: (pos.y * scale) + offset.y
	}
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollDice(faces) {
	return randomInt(1, faces) === 1;
}