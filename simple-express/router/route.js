const Layer = require('./layer');

function Route(handlers) {
	this.stack = [];

	for(let i = 0; i < handlers.length; i++) {
		const layer = new Layer('/', handlers[i]);
		this.stack.push(layer)
	}
}

Route.prototype.dispatch = function(req, res, next) {
	this.stack.forEach(layer => {
		layer.handler(req, res, next);
	})
}

module.exports = Route;