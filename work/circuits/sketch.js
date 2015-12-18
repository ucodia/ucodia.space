// circuits

var spacing = 40;
var nodeSize = spacing * 0.45;
var linkSize = nodeSize * 0.1;
var offset = spacing / 2;
var circuit;
var colors = [];


function setup() {
	colors.push(color("#ff7e00"));
	colors.push(color("#33b7bc"));
	colors.push(color("#b6c000"));
	colors.push(color("#f1e2ab"));
	
	createCanvas();
	generate();
}

function generate() {
	resizeCanvas(window.innerWidth, window.innerHeight);
	init();
	display();
}

function display() {
	background(0);
	
	for (var i = 0; i < circuit.paths.length; i++) {
		var path = circuit.paths[i];
		var current = path.head;
		
		// define path color
		colorMode(HSB, 100);
		var c = colors[path.color];
		
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
		fill(0, 0, 0);
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

function init() {
	var cols = Math.ceil(width / spacing);
	var rows = Math.ceil(height / spacing);
	
	circuit = createCircuit(cols, rows);
	
	//generate circuit
	for (var i = 0; i < circuit.cols; i++) {
		for (var j = 0; j < circuit.rows; j++) {
			// skip if node is already defined
			if (circuit.nodes[i][j]) continue;

			// create a new node and start new path
			var current = createNode(i, j);
			var path = createPath(current, cols);
			
			if (path.size > 0) {
				circuit.nodes[i][j] = current;
				circuit.paths.push(path);
					
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
					if (nextX >= circuit.cols || nextY >= circuit.rows ||
						circuit.nodes[nextX][nextY]) {
						// stop the path prematurely
						path.size = count;
						break;
					}
					
					// initialize next node
					var next = createNode(nextX, nextY);
					circuit.nodes[nextX][nextY] = next;
					
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

function createCircuit(cols, rows) {
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
	
	return {
		cols: cols,
		rows: rows,
		nodes: nodes,
		paths: paths
	}
}

function createPath(head, max) {
	var size = randomInt(0, max);
	var color = randomInt(0, 3);
	var style = randomInt(0, 1);
	
	return {
		size: size,
		color: color,
		style: style,
		head: head,
		tail: head
	}
}

// event hookups

function windowResized() {
	generate();
}

function mousePressed() {
	generate();
}

// utilities

function randomInt(min, max) {
	return Math.round(random(min, max));
}