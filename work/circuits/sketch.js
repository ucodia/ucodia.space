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
	
	var nColors = randomInt(2, 4);
	var colorOffset = random(0, 1);
	palette = createPalette(nColors, colorOffset);
	
	var cols = Math.ceil(width / spacing);
	var rows = Math.ceil(height / spacing);	
	circuit = createCircuit(cols, rows, nColors);
	
	display(circuit, palette);
}

function display(circuit, palette) {
	background(backColor);
	
	for (var i = 0; i < circuit.paths.length; i++) {
		var path = circuit.paths[i];
		var current = path.head;
		
		// define path color
		var c = palette[path.color];
		
		while (current) {
			var pos = getPosition(current);
			
			// current node is a link
			if (current.left && current.right) {
				displayLink(current.left, current, c);
			}
			
			current = current.right;
		}
			
		if (path.size > 1) {
			displayLink(path.tail.left, path.tail, c);
			displayEndpoint(path.tail, c, path.style);
		}
		
		displayEndpoint(path.head, c, path.style);
	}
}

function displayEndpoint(node, c, s) {
	var pos = getPosition(node);
	
	// style = 0 -> outline endpoint
	if (s === 0) {
		stroke(c);
		strokeWeight(linkSize);
		fill(backColor);
		ellipse(pos.x, pos.y, nodeSize, nodeSize);
	}
	// style = 1 -> full endpoint
	else if (s > 0) {
		noStroke();
		fill(c);
		ellipse(pos.x, pos.y, nodeSize, nodeSize);
	}
}

function displayLink(left, right, c) {
	stroke(c);
	strokeWeight(linkSize);
	
	var lPos = getPosition(left);
	var rPos = getPosition(right);
	line(lPos.x, lPos.y, rPos.x, rPos.y);
}

function getPosition(node) {
	return {
		x: offset + (spacing * node.x),
		y: offset + (spacing * node.y)
	}
}

function createCircuit(cols, rows, nColors) {	
	// initialize node grid
	var nodes = [];
	for	(var i = 0; i < cols; i++) {
		if (!nodes[i]) nodes[i] = [];
		for	(var j = 0; j < rows; j++) {
			nodes[i][j] = null;
		}	
	}
	
	// initialize paths
	var paths = [];
	
	// generate circuit
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			// skip if node is already defined
			if (nodes[i][j]) continue;

			// create a new node and start new path
			var current = createNode(i, j);
			var path = createPath(current, cols, nColors);
			
			if (path.size > 0) {
				nodes[i][j] = current;
				paths.push(path);
					
				var count = 1;
				var last = current;
				
				// generate path
				while (count < path.size) {
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
					
					// next position is outside boundaries
					// or already has a node
					if (nextX >= cols || nextY >= rows ||
						nodes[nextX][nextY]) {
						// stop the path prematurely
						path.size = count;
						break;
					}
					
					// initialize next node
					var next = createNode(nextX, nextY);
					nodes[nextX][nextY] = next;
					
					// link nodes
					last.right = next;
					next.left = last;
					path.tail = next;
					
					// update chain condition
					last = next;
					count++;
				}			
			}
		}
	}
	
	return {
		cols: cols,
		rows: rows,
		nodes: nodes,
		paths: paths
	}
}

function createNode(x, y) {
	return {
		type: 'empty',
		x: x,
		y: y,
		left: null,
		right: null
	}
}

function createPath(head, max, nColors) {
	var size = randomInt(0, max);
	var color = randomInt(0, nColors - 1);
	var style = randomInt(0, 1);
	
	return {
		size: size,
		color: color,
		style: style,
		head: head,
		tail: head
	}
}

function createPalette(n, offset) {
	if (!offset) offset = 0;
	
	var palette = []
		
	push();	
	for (var i = 0; i < n; i++) {
		var hue = (i + offset) % n;
		colorMode(HSB, n, 100, 100);
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