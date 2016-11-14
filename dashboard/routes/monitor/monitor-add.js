var Monitor = require('../../models/Monitor.js');

function monitorAdd (req, res) {
	var data = {
		name: req.body.monitorName,
		fabricCommand: req.body.fabricCommand,
		mongoCollection: req.body.mongoCollection
	};

	if (req.body._id) {
		Monitor
			.update(req.body._id, data)
			.then(function () {
				res.redirect('/monitor?id=' + req.body._id);
			}, function (error) {
				res.send(500, error);
			});
	} else {
		Monitor
			.insert(data)
			.then(function () {
				res.redirect('/monitor');
			}, function (error) {
				res.send(500, error);
			});
	}
}

module.exports = monitorAdd;
