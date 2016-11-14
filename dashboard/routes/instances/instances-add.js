var Instance = require('../../models/Instance.js');

function statusAdd (req, res) {
	var data = {
		name: req.body.instanceName,
		ip: req.body.instanceIp,
		user: req.body.instanceUser
	};

	if (req.body._id) {
		Instance
			.update(req.body._id, data)
			.then(function () {
				res.redirect('/instances?id=' + req.body._id);
			}, function (error) {
				res.send(500, error);
			});
	} else {
		Instance
			.insert(data)
			.then(function () {
				res.redirect('/instances');
			}, function (error) {
				res.send(500, error);
			});
	}
}

module.exports = statusAdd;
