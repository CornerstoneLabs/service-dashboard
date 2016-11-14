class ViewModel {
	constructor () {
		this.context = {};
		this.promises = [];
	}

	add (contextKey, fn) {
		var context = this.context;

		var functionExecutor = (resolve, reject) => {
			fn()
				.then(function (data) {
					context[contextKey] = data;

					resolve();
				}, reject);
		};

		var promise = new Promise(functionExecutor);

		this.promises.push(promise);
	}

	error (fn) {
		this.errorHandler = fn;
	}

	execute (fn) {
		var context = this.context;

		Promise
			.all(this.promises)
			.then(function () {
				fn(context);
			}, this.errorHandler);
	}
}

module.exports = ViewModel;