const canvas = document.getElementById("glCanvas");
Object.assign(canvas, {
    width: canvas.clientWidth,
    height: canvas.clientHeight,
});
const stats = new Stats();
stats.showPanel(0); // 0: FPS, 1: MS (Rendering time), 2: MB (Memory)
document.body.appendChild(stats.dom);

// 1. 初始化 REGL（自动适配高清屏）
const regl = createREGL({
    canvas,
    devicePixelRatio: window.devicePixelRatio || 1,
    attributes: { antialias: true }, // 开启硬件抗锯齿
    extensions: ["ANGLE_instanced_arrays"],
});

// 2. 定义顶点数据（红色三角形）
const triangleVertices = [
    [-1.0, -1.0], // 左下
    [1.0, -1.0], // 右下
    [0.0, 1.0], // 顶部
];

// 3. 创建绘制命令
const drawTriangle = regl({
    // 顶点着色器
    vert: `
precision mediump float;
attribute vec2 aPosition;
varying vec2 vPosition;
void main() {
    vPosition = aPosition;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
            `,

    // 片段着色器
    frag: `
precision mediump float;
varying vec2 vPosition;
void main() {
    mediump vec2 color = vPosition * 0.5 + 0.5;
    gl_FragColor = vec4(color, 0.0, 1.0);
}
            `,

    // 顶点属性
    attributes: {
        aPosition: triangleVertices,
    },

    // 绘制数量
    count: 3,
});

// 4. 渲染循环
regl.frame(() => {
    stats.begin();
    regl.clear({
        color: [0, 0, 0, 1], // 黑色背景
        depth: 1,
    });
    drawTriangle(); // 绘制三角形
    stats.end();
});

// 5. 窗口大小调整（REGL 已自动处理 pixelRatio）
window.addEventListener("resize", () => {
    regl.poll(); // 通知 REGL 更新视口
    console.log("Window resized, regl updated.");
});
