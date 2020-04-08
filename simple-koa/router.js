const Layer = require('./layer')
const compose = require('./util')

function createRouter() {
	const router = new Router();
	return router;
}

function Router() {
	this.stack = [];
}

Router.prototype.get = function(path) {
	console.log('====================================');
	console.log(Array.prototype.slice.call(arguments, 1));
	console.log('====================================');
	const route = new Layer(path, Array.prototype.slice.call(arguments, 1))
	this.stack.push(route);
}

Router.prototype.routes = function() {
	let routes = this.stack;

	return function(ctx, next) {
		const url = ctx.req.url;
		const route = routes.find(route => route.path === url)
		return compose(route.stack)(ctx)
	}
}

module.exports = createRouter;