# 中间件
我们使用`app.use`传入中间件，app会在接收请求时通过`compose`来构成中间件。其源码在`koa-compose`包下

```js
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
			let fn = middleware[i]

      if (i === middleware.length) {
				fn = next;
			}
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

`compose`首先判断`middleware`的类型，并返回函数供处理请求时使用。这个函数中又返回一个`dispatch`函数，其实就是在处理第一个中间件，`dispatch`函数首先处理一些边界情况，最后执行并返回`Promise.resolve(fn(context, dispatch.bind(null, i + 1)))`。这就提供我们使用阻塞的方式来在当前中间件逻辑中先处理下一个中间件的逻辑。