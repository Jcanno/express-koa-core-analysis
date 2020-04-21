const http = require('http');
const Router = require('./router')
const app = {
	handle(req, res) {
		const finnalHandler = function(req, res) {
			console.log('没有匹配到路由');
		}

		this._router.handle(req, res, finnalHandler);
	},
	
	get(path, ...handlers) {
		this._router.get(path, ...handlers);
	},
	
	listen() {
		const server = http.createServer(this);
		return server.listen.apply(server, arguments);
	},

	init() {
		this._router = new Router();
	}
}

module.exports = app;