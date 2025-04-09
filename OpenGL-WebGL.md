# OpenGL vs. WebGL

OpenGL 和 WebGL 是密切相关的图形 API，它们之间的关系可以从以下几个方面来理解：

[toc]

---

## **1. 技术继承关系**

- **OpenGL** (Open Graphics Library)

  - 跨平台的 **底层图形渲染 API**（1992 年发布）
  - 直接操作 GPU，用于开发高性能 2D/3D 图形应用（如游戏、CAD）
  - 桌面端使用（Windows/macOS/Linux）

- **WebGL** (Web Graphics Library)
  - 基于 OpenGL ES（移动端/嵌入式版 OpenGL）的 **Web 版图形 API**（2011 年发布）
  - 通过 JavaScript 在浏览器中调用 GPU 加速渲染
  - 本质上是 **OpenGL ES 的 JavaScript 绑定**

---

## **2. 核心区别**

| 特性         | OpenGL                            | WebGL                                                      |
| ------------ | --------------------------------- | ---------------------------------------------------------- |
| **运行环境** | 原生应用（C/C++）                 | 浏览器（JavaScript）                                       |
| **标准版本** | OpenGL 4.6（最新）                | WebGL 1.0（≈OpenGL ES 2.0）<br>WebGL 2.0（≈OpenGL ES 3.0） |
| **编程语言** | C/C++                             | JavaScript                                                 |
| **扩展机制** | 通过 `glGetString(GL_EXTENSIONS)` | 通过 `gl.getExtension()`                                   |
| **内存管理** | 手动控制                          | 受浏览器垃圾回收限制                                       |
| **典型用途** | 3A 游戏、专业图形软件             | 网页 3D 可视化、在线游戏                                   |

---

## **3. 版本对应关系**

- **WebGL 1.0** → 基于 **OpenGL ES 2.0**

  - 支持固定渲染管线（Fixed-Function Pipeline）
  - 必须使用着色器（Shader）
  - 功能较基础（如不支持实例化渲染）

- **WebGL 2.0** → 基于 **OpenGL ES 3.0**
  - 支持更多纹理格式（如 3D 纹理）
  - 新增 Transform Feedback、实例化渲染
  - 更高效的缓冲区操作

---

## **4. 代码对比示例**

### **绘制一个三角形**

- **OpenGL (C++)**

  ```cpp
  // 顶点数据
  float vertices[] = { -0.5f, -0.5f, 0.0f, 0.5f, -0.5f, 0.0f, 0.0f, 0.5f, 0.0f };

  // 创建缓冲
  GLuint VBO;
  glGenBuffers(1, &VBO);
  glBindBuffer(GL_ARRAY_BUFFER, VBO);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

  // 渲染
  glDrawArrays(GL_TRIANGLES, 0, 3);
  ```

- **WebGL (JavaScript)**

  ```javascript
  // 顶点数据
  const vertices = new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0, 0.5, 0]);

  // 创建缓冲
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // 渲染
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  ```

---

## **5. 设计差异**

- **安全限制**  
  WebGL 比 OpenGL 更严格，例如：

  - 禁止直接访问内存（防止浏览器漏洞）
  - 着色器必须通过字符串传递（非二进制）
  - 默认限制纹理尺寸（通常 ≤2048×2048）

- **上下文丢失处理**  
  WebGL 需要处理 `webglcontextlost` 事件（如移动端页面切换时 GPU 资源被回收）。

---

## **6. 发展趋势**

- **WebGPU**：下一代 Web 图形 API，不再基于 OpenGL，而是借鉴 Vulkan/Metal/D3D12 的现代架构。
- **OpenGL 的淘汰**：苹果已弃用 OpenGL（推荐 Metal），但 WebGL 仍长期支持。

---

## **总结**

- WebGL 是 **OpenGL ES 的 Web 移植版**，专为浏览器设计。
- 学会 OpenGL 有助于理解 WebGL 底层原理，但 WebGL 更注重安全性和跨平台兼容性。
- 对于 Web 开发者，WebGL 是唯一的选择；对于原生开发者，OpenGL/Vulkan/Metal 更强大。
