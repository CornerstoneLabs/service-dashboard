var Schedule = require('../../models/Schedule.js');
var scheduletasks = require('../../app/scheduled-tasks.js');

function scheduleAdd (req, res) {
	var data = {
		monitor: req.body.scheduleMonitor,
		instance: req.body.scheduleInstance,
		cron: req.body.scheduleCron,
		timeout: req.body.timeout,
		parameters: req.body.parameters
	};

	if (req.body._id) {
		Schedule
			.update(req.body._id, data)
			.then(function () {
				res.redirect('/schedule?id=' + req.body._id);
			}, function (error) {
				res.send(500, error);
			});
	} else {
		Schedule
			.insert(data)
			.then(function () {
				res.redirect('/schedule');
			}, function (error) {
				res.send(500, error);
			});
	}

	scheduletasks.reset();
}

module.exports = scheduleAdd;
