const proto = require('./application');

function createApplication() {
	const app = function(req, res, next) {
		app.handle(req, res, next);
	}

	Object.assign(app, proto);

	app.init();
	return app;
}

module.exports = createApplication;