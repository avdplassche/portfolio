let treeCanvas;
		// Constants for the tree drawing
		const MAX_DEPTH = 8;
		const ANGLE_VARIANCE = 0.45;
		const LENGTH_REDUCTION = 0.68;
		const BASE_LENGTH_FACTOR = 0.30;

		// P5.js setup function
		function setup() {
			const container = document.getElementById('p5-container');

			// Create the canvas based on the container's current size
			treeCanvas = createCanvas(container.clientWidth, container.clientHeight);
			treeCanvas.parent('p5-container');
			angleMode(RADIANS);
			noLoop(); // Stop the draw loop for a static background

			// CRITICAL FIX: Ensure redraw happens AFTER the browser has finalized the container's size.
			// This is necessary for responsive containers when using noLoop().
			setTimeout(() => {
				redraw();
			}, 100);
		}

		// P5.js draw function (runs once because of noLoop() or when redraw() is called)
		function draw() {
			const w = width;
			const h = height;

			// Clear the background using the card color (34, 34, 34 is #222222)
			background(34, 34, 34);

			// Start drawing the tree from the bottom center of the canvas
			translate(w / 2, h);

			// Set line properties
			stroke(6, 182, 212, 255); // Accent color
			strokeWeight(2);

			// Initial call to the recursive function, use container height for scale
			const initialLength = h * BASE_LENGTH_FACTOR;
			branch(initialLength, MAX_DEPTH);
		}

		// Recursive branch function
		function branch(len, depth) {
			if (depth === 0) {
				// Draw a small circle at the end of the branch
				noStroke();
				fill(6, 182, 212);
				ellipse(0, 0, 3, 3);
				return;
			}

			// 1. Draw the current branch segment
			line(0, 0, 0, -len);

			// Move the coordinate system to the end of the current branch
			translate(0, -len);

			// Scale down the stroke weight for visual effect
			const currentStroke = map(depth, 1, MAX_DEPTH, 0.5, 2);
			strokeWeight(currentStroke);

			// 2. Left Branch
			push();
			rotate(ANGLE_VARIANCE);
			branch(len * LENGTH_REDUCTION, depth - 1);
			pop();

			// 3. Right Branch
			push();
			rotate(-ANGLE_VARIANCE);
			branch(len * LENGTH_REDUCTION, depth - 1);
			pop();
		}

		// P5.js function for responsiveness
		function windowResized() {
			const container = document.getElementById('p5-container');
			// Only resize the canvas to the size of its parent container
			resizeCanvas(container.clientWidth, container.clientHeight);
			// Redraw the tree when the window changes size
			redraw();
		}

