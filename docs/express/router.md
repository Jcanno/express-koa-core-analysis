# 路由

在我们例子实例化express后，调用`app.get('/', (req, res) => res.send('Hello World!'))`注册了路径为`/`的路由。这里express源码把有关路由封装成了类，将所有路由的逻辑都放在`router`模块中编写，`app`暴露了注册的方法，实际上所有的逻辑都交给了`router`来处理。

```js
// lib/application
var methods = require('methods');

methods.forEach(function(method){
  app[method] = function(path){
    if (method === 'get' && arguments.length === 1) {
      // app.get(setting)
      return this.set(path);
    }

    this.lazyrouter();

    var route = this._router.route(path);
    route[method].apply(route, slice.call(arguments, 1));
    return this;
  };
});

app.lazyrouter = function lazyrouter() {
  if (!this._router) {
    this._router = new Router({
      caseSensitive: this.enabled('case sensitive routing'),
      strict: this.enabled('strict routing')
    });

    this._router.use(query(this.get('query parser fn')));
    this._router.use(middleware.init(this));
  }
};

```

[methods](https://www.npmjs.com/package/methods)提供了node支持的所有http方法，上面代码就是提供各http方法来注册路由。在注册的场景中，我们需要用到`router`类，前面我们提到`router`类在init时没有被初始化，这时就需要实例化`router`，`lazyrouter`方法就实例化了一个`router`并生成了两个	`express`内置中间件，有关中间件的内容我们稍后再讨论。接着在`app.get`中调用`this._router.route`来生成`route`，之后又将处理函数传给`route`中对应的http方法。我们先来看`router`中的route方法。

```js
// lib/router/index.js

proto.route = function route(path) {
  var route = new Route(path);

  var layer = new Layer(path, {
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  }, route.dispatch.bind(route));

  layer.route = route;

  this.stack.push(layer);
  return route;
};
```

`router.route`的实现很简单，就是实例化一个`route`和一个`layer`，让`layer`持有`route`, 并将`layer`推入到`router`管理的栈中。我们再来看`route`对各http方法的实现。

```js
// lib/router/route.js

methods.forEach(function(method){
  Route.prototype[method] = function(){
    var handles = flatten(slice.call(arguments));

    for (var i = 0; i < handles.length; i++) {
      var handle = handles[i];

      if (typeof handle !== 'function') {
        var type = toString.call(handle);
        var msg = 'Route.' + method + '() requires a callback function but got a ' + type
        throw new Error(msg);
      }

      debug('%s %o', method, this.path)

      var layer = Layer('/', {}, handle);
      layer.method = method;

      this.methods[method] = true;
      this.stack.push(layer);
    }

    return this;
  };
});
```

这里和app一样遍历`methods`使route支持各http方法，首先通过`flatten`打平`处理函数即handler`的结构，接着遍历handlers数组，生成对应的`layer`，将`layer`推入到`route`管理的栈中。

