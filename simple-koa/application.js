const http = require('http');
const compose = require('./util');

class Koa {
	constructor() {
		this.middleware = []
	}

	use(fn) {
		this.middleware.push(fn);
	}

	listen(...args) {
		const server = http.createServer(this.callback());
		server.listen(...args)
	}

	callback() {
		const middleware = this.middleware
		const handleRequest = function handleRequest(req, res){
			const context = {req, res};
			const fnMiddleware = compose(middleware);
			return fnMiddleware(context)
		}

		return handleRequest;
	}
}

module.exports = Koa;