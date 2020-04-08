function compose(middleware) {
	let i = 0;

	return function(ctx, next) {
		return dispatch(i)
		function dispatch(i) {
			let fn = middleware[i];
			if(i === middleware.length) fn = next;
			if(!fn) return Promise.resolve();
			try {
				return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
			} catch (error) {
				return Promise.reject(error)
			}
		}
	}
}

module.exports = compose;