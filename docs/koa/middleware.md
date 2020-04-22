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
![koa](https://hawksights.obs.cn-east-2.myhuaweicloud.com/ceshi/1587516895161.jpg)
- `compose`将中间件数组形成一个连续可调用的闭环，当前中间件可以决定是否调用下一个中间件。

- `compose`处处是闭包，许多优秀的框架都是运用了闭包的艺术，如`redux`。

- `compose`首先判断`middleware`的类型，并返回函数供处理请求时使用。

- 在`compose`闭包函数中返回`dispatch(0)`, 这就是在执行第一个中间件，`dispatch`函数首先处理一些边界情况，最后返回`Promise.resolve(fn(context, dispatch.bind(null, i + 1)))`。根据返回的	Promise，我们就可以在自己编写的中间件中来决定何时调用下一个中间件。