// Define the main sketch function
const sketch = (p) => {
	let canvasParent;
	const branchColor = [6, 182, 212]; // Cyan Accent (RGB)

	p.setup = () => {
		canvasParent = document.getElementById('p5-container');
		p.createCanvas(canvasParent.clientWidth, canvasParent.clientHeight).parent(canvasParent);
		p.angleMode(p.DEGREES);
		p.frameRate(60);
	};

	p.draw = () => {
		// Clear the canvas with the Deep Navy color (from CSS variable)
		p.background(16, 21, 45);

		p.push();

		// 1. Translate to the bottom center of the canvas
		p.translate(p.width , p.height * 0.5);

		// 2. Initial rotation for a slight sway effect (based on time)
		let swayAngle = p.sin(p.frameCount * 0.5) * 2; // Subtle +/- 2 degrees
		p.rotate(swayAngle);

		// 3. Start the recursive drawing
		// Start with a branch length relative to the screen height
		p.stroke(255);
		drawBranch(p.height / 5, 0, 10);

		p.pop();
	};

	function drawBranch(len, currentAngle, generation) {
		if (len < 5 || generation <= 0) {
			return;
		}

		p.strokeWeight(p.map(len, p.height/5, 5, 3, 0.5));

		let c = p.color(
			branchColor[0],
			branchColor[1],
			branchColor[2],
			p.map(generation, 10, 0, 255, 50)
		);
		p.stroke(c);

		p.line(0, 0, 0, -len);

		p.translate(0, -len);

		let angleShift = p.sin(p.frameCount * 0.8 + len * 0.5) * 1.5;
		let newLen = len * 0.70;

		p.push();
		p.rotate(35 + angleShift);
		drawBranch(newLen, currentAngle + 35, generation - 1);
		p.pop();


		p.push();
		p.rotate(-35 - angleShift);
		drawBranch(newLen, currentAngle - 35, generation - 1);
		p.pop();
	}

	p.windowResized = () => {
		canvasParent = document.getElementById('p5-container');
		p.resizeCanvas(canvasParent.clientWidth, canvasParent.clientHeight);
	};

	window.onload = () => {
		p.windowResized();
	}
};

// Create a new p5 instance
new p5(sketch, 'p5-container');