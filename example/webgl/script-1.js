// Initialize WebGL and Stats.js
const canvas = document.getElementById("glCanvas"),
    gl = canvas.getContext("webgl"),
    stats = new Stats();

/**
 * Initializes the WebGL context and checks for errors.
 */
function basicCheck() {
    stats.showPanel(0); // 0: FPS, 1: MS (Rendering time), 2: MB (Memory)
    document.body.appendChild(stats.dom);

    if (!gl) {
        let msg = 'Can not initialize WebGL. Your browser may not support it.';
        alert(msg);
        console.error(msg);
    } else {
        console.log('WebGL initialized successfully!');
    }
}

basicCheck();

/**
 * Sets the canvas size to the window size and updates the WebGL viewport.
 */
function fullSizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', fullSizeCanvas);
fullSizeCanvas();



/**
 * Draws the scene.
 */
function draw() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Black background
    gl.clearDepth(1.0);                 // Clear depth
    gl.enable(gl.DEPTH_TEST);           // Enable depth test
    gl.depthFunc(gl.LEQUAL);            // Near objects occlude far objects
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Other drawing operations go here
    // ...
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
}

/**
 * Renders the scene at the current time.
 * @param {} now Current time in milliseconds.
 */
function render(now) {
    stats.begin()
    now *= 0.001; // Convert to seconds
    draw();
    stats.end(); // Update stats panel
    requestAnimationFrame(render);
}
requestAnimationFrame(render);