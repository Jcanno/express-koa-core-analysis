function Layer(path, middleware) {
	this.path = path;
	this.stack = [];
	this.stack.push(...middleware)
}

module.exports = Layer;