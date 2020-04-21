# 源码结构

`koa`的源码量相比`express`更少，在于`koa`将核心留下来，通过其他模块进行拓展，其源码目录结构如下:

```js
.
├── application.js
├── context.js
├── request.js
└── response.js
```

- `application.js`: koa骨架文件
- `context.js`: 提供context原型
- `request.js`: 封装request
- `response.js` 封装response