const Layer = require('./layer');
const Route = require('./route');

function Router() {
	this.stack = [];

}

Router.prototype.get = function(path, ...handlers) {
	let route = new Route(handlers);
	let layer = new Layer(path, route.dispatch.bind(route));

	layer.route = route;
	this.stack.push(layer);
}

Router.prototype.handle = function(req, res, out) {
	let idx = 0;
	let url = req.url;
	let stack = this.stack;

	next()

	function next() {
		let matched = false;

		while(!matched && idx < stack.length) {
			let layer = stack[idx];

			idx++
			if(url === layer.path) {
				matched = true;
				layer.handle_request(req, res, next);
			}
		}
	}
}


module.exports = Router;