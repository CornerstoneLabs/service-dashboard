var Monitor = require('../../models/Monitor.js');

function status (req, res) {
	var promises = [];
	var context = {};
	context.showAdd = false;

	if (req.query.add) {
		context.showAdd = true;
	}

	if (req.query.id) {
		promises.push(new Promise((resolve, reject) => {
			Monitor
				.get(req.query.id)
				.then(function (data) {
					context.data = data;
					context.showAdd = true;

					resolve();
				}, function (error) {
					reject(error);
				});
		}));
	}

	promises.push(new Promise((resolve, reject) => {
		Monitor
			.list()
			.then(function (status) {
				context.status = status;

				resolve();
			}, function (error) {
				reject(error);
			});
	}));

	Promise
		.all(promises)
		.then(function () {
			res.render('monitors', context);
		}, function (error) {
			res.send(500, error);
		});
}

module.exports = status;
