# 使用例子

我们用官网的例子来展开对`express`的分析
```js
const express = require('express')
// 获取app实例
const app = express()
const port = 3000
// 注册路由
app.get('/', (req, res) => res.send('Hello World!'))
// 开启服务并监听3000端口
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```

# express入口

```js
// lib/express.js
var EventEmitter = require('events').EventEmitter;
var mixin = require('merge-descriptors');
var proto = require('./application');

function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

	mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init();
  return app;
}

exports = module.exports = createApplication;
```

我们引入的express就是这里的`createApplication`函数，这里在`createApplication`里创建了app，它也是一个函数，并在app上混合事件原型和app的各种原型方法，这里express将app原型的相关代码分离到了`application`中，接着在app上创建了`request`和`response`原型对象，然后执行app原型上`init`方法，最终将app返回。我们接着看`init`方法的实现，定义在`lib/application.js`中。

# application

```js
// lib/application.js

app.init = function init() {
  this.cache = {};
  this.engines = {};
  this.settings = {};

  this.defaultConfiguration();
};

/**
 * Initialize application configuration.
 * @private
 */

app.defaultConfiguration = function defaultConfiguration() {
  var env = process.env.NODE_ENV || 'development';

  // default settings
  this.enable('x-powered-by');
  this.set('etag', 'weak');
  this.set('env', env);
  this.set('query parser', 'extended');
  this.set('subdomain offset', 2);
  this.set('trust proxy', false);

  // trust proxy inherit back-compat
  Object.defineProperty(this.settings, trustProxyDefaultSymbol, {
    configurable: true,
    value: true
  });

  debug('booting in %s mode', env);

  this.on('mount', function onmount(parent) {
    // inherit trust proxy
    if (this.settings[trustProxyDefaultSymbol] === true
      && typeof parent.settings['trust proxy fn'] === 'function') {
      delete this.settings['trust proxy'];
      delete this.settings['trust proxy fn'];
    }

    // inherit protos
    setPrototypeOf(this.request, parent.request)
    setPrototypeOf(this.response, parent.response)
    setPrototypeOf(this.engines, parent.engines)
    setPrototypeOf(this.settings, parent.settings)
  });

  // setup locals
  this.locals = Object.create(null);

  // top-most app is mounted at /
  this.mountpath = '/';

  // default locals
  this.locals.settings = this.settings;

  // default configuration
  this.set('view', View);
  this.set('views', resolve('views'));
  this.set('jsonp callback name', 'callback');

  if (env === 'production') {
    this.enable('view cache');
  }

  Object.defineProperty(this, 'router', {
    get: function() {
      throw new Error('\'app.router\' is deprecated!\nPlease see the 3.x to 4.x migration guide for details on how to update your app.');
    }
  });
};
```


`init`函数中对app上的参数进行初始化，并调用`defaultConfiguration`对app进行默认配置，这里我们不详细展开，但我们要留意一点，`defaultConfiguration`没有对`router即路由模块`进行初始化，这是因为开发者在执行`const app = express()`后可能会更改配置，而路由模块初始化需要读取相关配置，`express`这里就使用`懒实例化`路由模块的方式来延迟初始化路由。
