# 使用例子

我们用官网的例子来展开对`koa`的分析
```js
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

# koa入口

```js
// lib/application.js
module.exports = class Application extends Emitter {
	// ...
}
```
例子中引入的`Koa`是由类实现，实例化后的`koa`对象可以调用创建服务、生成context等方法

# app.use

```js
// lib/application.js
use(fn) {
  if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
  if (isGeneratorFunction(fn)) {
    deprecate('Support for generators will be removed in v3. ' +
              'See the documentation for examples of how to convert old middleware ' +
              'https://github.com/koajs/koa/blob/master/docs/migration.md');
    fn = convert(fn);
  }
  debug('use %s', fn._name || fn.name || '-');
  this.middleware.push(fn);
  return this;
}
```

`app.use`主要逻辑就是判断传入的是不是函数，并将fn放入`middleware`数组中
例子中使用`app.use`来创建中间件，这个中间件能响应任何请求，koa中的核心是中间件模式，其他模块都是通过中间件进行拓展。

# app.listen

```js
// lib/application.js
listen(...args) {
  debug('listen');
  const server = http.createServer(this.callback());
  return server.listen(...args);
}

callback() {
	const fn = compose(this.middleware);

	if (!this.listenerCount('error')) this.on('error', this.onerror);

  const handleRequest = (req, res) => {
    const ctx = this.createContext(req, res);
    return this.handleRequest(ctx, fn);
	};

  return handleRequest;
}
```
`app.listen`来开启服务并监听请求，这里通过`compose`来构成koa的洋葱模型的中间件模式，然后使用`createContext`来合并`request`、`response`生成`context`，理解koa的核心就是要理解koa怎么处理我们传入的中间件。
