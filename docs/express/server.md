# 开启服务

注册路由后，例子中又执行`app.listen(port, () => console.log(`Example app listening on port ${port}!`))`开启服务并监听端口。

其源码在`lib/application.js`中

```js
// lib/application.js

app.listen = function listen() {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};
```

`app.listen`的方法就是调用了node中`http`模块的两个方法，通过`createServer`创建服务，再通过`listen`监听对应端口。