// circuits by lionel ringenbach @ ucodia.io

// display parameters
var spacing = 40;
var nodeSize = spacing * 0.45;
var linkSize = nodeSize * 0.1;
var offset = spacing / 2;
var backColor;

function setup() {
	createCanvas();	
	
	// defaults
	backColor = color(0);
	
	// ui
	var themeSel = createSelect();
	themeSel.option('dark');
	themeSel.option('light');
	themeSel.changed(themeChanged);
	var panel = select('#panel');
	panel.child(themeSel);
	
	generate();
}

function generate() {
	resizeCanvas(window.innerWidth, window.innerHeight);
	
	// generate color palette
	var nColors = randomInt(2, 4);
	var colorOffset = random(0, 1);
	palette = createPalette(nColors, colorOffset);
	
	// generate pad styles		
	var padStyles = [regularPadStyle, padWithHoleStyle];

	// generate circuit
	var cols = Math.ceil(width / spacing);
	var rows = Math.ceil(height / spacing);	
	circuit = createCircuit(cols, rows, palette.length, padStyles.length);
	
	drawCircuit(circuit, palette, padStyles);
}

function drawCircuit(circuit, palette, padStyles) {
	background(backColor);
	
	for (var i = 0; i < circuit.paths.length; i++) {
		var path = circuit.paths[i];
		
		// pick path color and pad style
		var color = palette[path.color];
		var padStyle = padStyles[path.padStyle];
		
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
		
		var lPos = getNodePosition(nodes[i]);
		var rPos = getNodePosition(nodes[i + 1]);
		line(lPos.x, lPos.y, rPos.x, rPos.y);
	}
}

function drawPad(node, color, style) {
	var pos = getNodePosition(node);
	
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
	fill(backColor);
}


function getNodePosition(node) {
	return {
		x: offset + (spacing * node.x),
		y: offset + (spacing * node.y)
	}
}

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

			// generate new path length
			var pathLength = randomInt(0, cols);
					
			if (pathLength > 0) {
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

// event hookups

function windowResized() {
	generate();
}

function mousePressed() {
	if (mouseButton == RIGHT) return;
	
	generate();
}

function themeChanged(evt) {
	evt.preventDefault();
	
	if (evt && evt.target) {
		theme = evt.target.value;
		
		if (theme === 'light')
			backColor = color(255);
		else
			backColor = color(0);
		
		generate();
	}
}

// utilities

function randomInt(min, max) {
	return Math.round(random(min, max));
}