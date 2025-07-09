# WebGL vs. REGL


WebGL 和 REGL 之间的关系可以类比为 **JavaScript 与 jQuery** 的关系——前者是底层标准，后者是基于前者的高级封装库。以下是详细对比和关联分析：

---
<!-- MarkdownTOC -->

- **1. 核心关系**
- **2. REGL 如何封装 WebGL？**
  - **\(1\) 自动状态管理**
  - **\(2\) 简化着色器与数据传递**
  - **\(3\) 内置抗锯齿与高清屏适配**
- **3. 性能对比**
- **4. 何时选择 WebGL 或 REGL？**
  - **选择 WebGL 当：**
  - **选择 REGL 当：**
- **5. 代码示例对比**
  - **\(1\) 绘制三角形（WebGL）**
  - **\(2\) 绘制三角形（REGL）**
- **6. 混合使用场景**
- **总结**

<!-- /MarkdownTOC -->



## **1. 核心关系**

| **维度**     | **WebGL**                          | **REGL**                     |
| ------------ | ---------------------------------- | ---------------------------- |
| **定位**     | 原生图形 API (OpenGL ES 的 Web 版) | WebGL 的轻量级封装库         |
| **抽象级别** | 底层（直接操作 GPU）               | 高层（简化流程，声明式 API） |
| **代码量**   | 冗长（需手动管理状态）             | 简洁（自动状态管理）         |
| **学习曲线** | 陡峭                               | 平缓                         |
| **适用场景** | 需要极致控制/复杂渲染              | 快速原型开发、中等复杂度项目 |

---

## **2. REGL 如何封装 WebGL？**

### **(1) 自动状态管理**

- **WebGL**：需手动绑定帧缓冲、纹理、着色器程序：

  ```javascript
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.useProgram(program);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  ```

- **REGL**：自动处理状态切换：

  ```javascript
  regl({
    framebuffer: fbo,
    program: shader,
    texture: myTexture,
  })();
  ```

### **(2) 简化着色器与数据传递**

- **WebGL**：需手动编译着色器、定位变量：

  ```javascript
  const posLoc = gl.getAttribLocation(program, "position");
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  ```

- **REGL**：声明式绑定：

  ```javascript
  attributes: {
    position: regl.buffer([
      [-1, 0],
      [0, 1],
      [1, 0],
    ]); // 自动关联到着色器
  }
  ```

### **(3) 内置抗锯齿与高清屏适配**

- **WebGL**：需手动处理 `devicePixelRatio` 和 MSAA：

  ```javascript
  canvas.width = canvas.clientWidth * window.devicePixelRatio;
  const gl = canvas.getContext("webgl", { antialias: true });
  ```

- **REGL**：自动适配：

  ```javascript
  const regl = createREGL({ antialias: true }); // 一键开启抗锯齿
  ```

---

## **3. 性能对比**

| **场景**       | **WebGL**            | **REGL**                 |
| -------------- | -------------------- | ------------------------ |
| **初始化速度** | ⚡️ 更快（无抽象开销） | ⚠️ 稍慢（需加载库）       |
| **渲染性能**   | ⚡️ 最优（直接控制）   | 🔥 接近原生（智能批处理） |
| **内存占用**   | 更低                 | 略高（封装层开销）       |

REGL 通过 **命令批处理** 和 **自动状态合并** 优化性能，在多数场景下损失 <5% FPS。

---

## **4. 何时选择 WebGL 或 REGL？**

### **选择 WebGL 当：**

- 需要极致性能（如 3A 级游戏引擎）
- 深度定制渲染管线（如自定义多 Pass 渲染）
- 学习图形学底层原理

### **选择 REGL 当：**

- 快速开发可视化项目（如数据可视化、艺术创作）
- 需要抗锯齿、响应式布局等常见功能
- 团队 JavaScript 熟练但 WebGL 经验较少

---

## **5. 代码示例对比**

### **(1) 绘制三角形（WebGL）**

```javascript
// 初始化（约50行代码）
const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

// 编译着色器、绑定数据、渲染...
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  "attribute vec2 p; void main() { gl_Position=vec4(p,0,1); }"
);
gl.compileShader(vertexShader);
// ...（省略20行）

// 绘制
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

### **(2) 绘制三角形（REGL）**

```javascript
const regl = createREGL();

const drawTriangle = regl({
  vert: `attribute vec2 p; void main() { gl_Position=vec4(p,0,1); }`,
  frag: `void main() { gl_FragColor=vec4(1,0,0,1); }`,
  attributes: {
    p: [
      [-1, 0],
      [0, 1],
      [1, 0],
    ],
  },
  count: 3,
});

regl.frame(() => drawTriangle());
```

---

## **6. 混合使用场景**

REGL 可与原生 WebGL 共存：

```javascript
const regl = createREGL();

// 使用 REGL 创建纹理
const texture = regl.texture("...");

// 切换到原生 WebGL 操作
regl._gl.bindTexture(regl._gl.TEXTURE_2D, texture);

// 切换回 REGL
regl({ texture })();
```

---

## **总结**

- **WebGL** 是浏览器提供的 **底层图形标准**，功能强大但使用复杂。
- **REGL** 是 WebGL 的 **高效封装库**，通过声明式 API 提升开发效率。
- 两者并非竞争关系，而是互补：REGL 适合 90% 的常见需求，WebGL 用于剩余 10% 的极端定制场景。
