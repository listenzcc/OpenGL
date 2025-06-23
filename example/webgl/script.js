/**
 * 异步加载顶点和片段着色器文件
 * @returns {Promise<{vertex: string, fragment: string}>}
 */
async function loadShaders() {
    try {
        const [vertexShader, fragmentShader] = await Promise.all([
            fetch('shaders/vertex.glsl').then(res => res.text()),
            fetch('shaders/fragment.glsl').then(res => res.text())
        ]);
        return { vertex: vertexShader, fragment: fragmentShader };
    } catch (error) {
        console.error('Failed to load shaders:', error);
        throw error; // 抛出错误以便外部捕获
    }
}

/**
 * 初始化 WebGL 上下文
 * @param {HTMLCanvasElement} canvas 
 * @returns {WebGLRenderingContext}
 */
function initWebGL(canvas) {
    const gl = canvas.getContext('webgl', { antialias: true }) || canvas.getContext('experimental-webgl');
    if (!gl) {
        throw new Error('WebGL not supported');
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // 默认黑色背景
    gl.clear(gl.COLOR_BUFFER_BIT);

    console.log(gl instanceof WebGL2RenderingContext)

    return gl;
}


/**
 * 创建并链接着色器程序
 * @param {WebGLRenderingContext} gl 
 * @param {string} vertexShaderSource 
 * @param {string} fragmentShaderSource 
 * @returns {WebGLProgram}
 */
function createShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
    // 编译着色器
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // 创建程序并链接
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // 检查链接状态
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Shader program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}


// 辅助函数：编译单个着色器
function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Shader compile error (${type === gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT'}):`, gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// 主入口函数
async function init() {
    const canvas = document.getElementById('glCanvas');
    Object.assign(canvas, { width: canvas.clientWidth, height: canvas.clientHeight });
    if (!canvas) throw new Error('Canvas not found');
    console.log(canvas.width, canvas.height);
    console.log(canvas.clientWidth, canvas.clientHeight);

    const stats = new Stats();
    stats.showPanel(0); // 0: FPS, 1: MS (Rendering time), 2: MB (Memory)
    document.body.appendChild(stats.dom);

    try {
        // 1. 异步加载着色器
        const shaders = await loadShaders();
        console.log('Shaders loaded:', shaders);

        // 2. 初始化 WebGL
        const gl = initWebGL(canvas);

        // 3. 创建着色器程序
        const program = createShaderProgram(gl, shaders.vertex, shaders.fragment);

        // 4. 触发自定义事件，传递必要的对象
        document.dispatchEvent(new CustomEvent('webgl-ready', {
            detail: { gl, program, stats }
        }));
    } catch (error) {
        console.error('Initialization failed:', error);
        document.dispatchEvent(new CustomEvent('webgl-error', { detail: error }));
    }
}

// 监听事件并启动渲染
document.addEventListener('webgl-ready', (e) => {
    const { gl, program, stats } = e.detail;

    // 1. 定义顶点数据（一个简单的三角形）
    const vertices = new Float32Array([
        -1.0, -1.0,  // 左下角
        1.0, -1.0,  // 右下角
        0.0, 1.0   // 顶部
    ]);

    // 2. 创建并绑定顶点缓冲区
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // 3. 获取着色器中的 attribute 位置
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);
    // 渲染循环
    function render() {
        stats.begin();
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3); // 绘制三角形
        // 这里添加实际的绘制代码（例如绑定缓冲区、设置 uniforms 等）
        // ...
        stats.end();

        requestAnimationFrame(render);
    }
    render();
});

// 错误处理
document.addEventListener('webgl-error', (e) => {
    console.error('WebGL Error:', e.detail);
    alert(`WebGL初始化失败: ${e.detail.message}`);
});

// 启动初始化流程
init();