# 源码结构

`express`源码不多，但相关逻辑较多，核心代码实现在`lib`文件夹下，其结构如下

```js
.
├── application.js
├── express.js
├── middleware
│   ├── init.js
│   └── query.js
├── request.js
├── response.js
├── router
│   ├── index.js
│   ├── layer.js
│   └── route.js
├── test.js
├── utils.js
└── view.js
```

有关express运行流程有这几个文件:
- `express.js`: express入口文件，导出app、router等模块
- `application.js`: 实现了app类，主要对路由、中间件、处理函数进行调度
- `router`: 提供router类，管理其下的`layer`和`route`类，实现了路由路径解析、路径对应处理函数等功能