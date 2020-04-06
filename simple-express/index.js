const express = require('./express');
const app = express();

app.get('/sds', (req, res, next) => {
	console.log('2222');
	res.end('hi')
	next()
})

app.get('/', (req, res) => {
	console.log('监听到请求');
	res.end('hello')
})

app.listen('8001', () => {
	console.log('服务已运行在8001端口上');
})