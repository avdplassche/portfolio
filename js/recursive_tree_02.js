      const sketch = (p) => {
            let canvasParent;
            const branchColor = [6, 182, 212]; // Cyan Accent (RGB)
            let zoff = 0; // Z-axis offset for Perlin Noise time evolution

            p.setup = () => {
                canvasParent = document.getElementById('p5-container');
                // The canvas fills the container
                p.createCanvas(canvasParent.clientWidth, canvasParent.clientHeight).parent(canvasParent);
                p.angleMode(p.DEGREES);
                p.frameRate(60);
                p.noiseDetail(2, 0.5); // Adjust noise detail for smoother results
            };

            p.draw = () => {
                // Clear the canvas with the Deep Navy color
                p.background(16, 21, 45);

                p.push();

                // 1. Translate to the bottom center of the canvas
                // This makes the tree grow upwards, which looks more natural with wind.
                p.translate(p.width / 2, p.height);

                // 2. Initial sway effect for the entire tree
                // Use a subtle Perlin noise for the root motion (x-axis noise for left/right sway)
                let rootSway = p.map(p.noise(zoff * 0.5), 0, 1, -10, 10); // Sway range +/- 10 degrees
                p.rotate(rootSway * 0.2); // Apply a gentle sway to the root

                zoff += 0.005; // Increment time for the noise field

                // 3. Start the recursive drawing
                // Start with a branch length relative to the screen height
                p.stroke(255);
                // Draw the main trunk
                drawBranch(p.height / 5, 0, 10);

                p.pop();
            };

            function drawBranch(len, currentAngle, generation) {
                if (len < 5 || generation <= 0) {
                    return;
                }

                // Adjust stroke weight based on length (thicker at base, thinner at tips)
                p.strokeWeight(p.map(len, p.height / 5, 5, 3, 0.5));

                // Color fades with generation
                let c = p.color(
                    branchColor[0],
                    branchColor[1],
                    branchColor[2],
                    p.map(generation, 10, 0, 255, 50)
                );
                p.stroke(c);

                // Draw the line segment (upwards)
                p.line(0, 0, 0, -len);

                // Move to the end of the line segment
                p.translate(0, -len);

                // --- Wind Simulation with Perlin Noise ---

                // Base noise coordinates for this branch's position and time
                let noiseX = generation * 0.1;
                let noiseY = zoff; // Use zoff for time

                // Get Perlin Noise value for this specific branch's movement
                // The noise creates a smooth, random-like value between 0 and 1
                let windForce = p.noise(noiseX, noiseY);

                // Map the noise value to a rotational angle (+ bias for consistent wind direction)
                // The angle shift is directional, making it look like wind is pushing all branches to the right.
                // Multiplying by 'generation' makes outer branches move more dramatically.
                let angleShift = p.map(windForce, 0, 1, -8, 8) * (generation / 10);

                let newLen = len * 0.75;

                // Branch 1 (Right side)
                p.push();
                // Apply the base angle (35) plus the wind shift
                p.rotate(35 + angleShift);
                drawBranch(newLen, currentAngle + 35, generation - 1);
                p.pop();

                // Branch 2 (Left side)
                p.push();
                // Apply the base angle (-35) plus the wind shift
                p.rotate(-35 + angleShift);
                drawBranch(newLen, currentAngle - 35, generation - 1);
                p.pop();
            }

            p.windowResized = () => {
                canvasParent = document.getElementById('p5-container');
                p.resizeCanvas(canvasParent.clientWidth, canvasParent.clientHeight);
            };
        };

        // Create a new p5 instance
        new p5(sketch, 'p5-container');
