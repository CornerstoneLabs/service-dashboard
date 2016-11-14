var Instance = require("../../models/Instance.js");
var Monitor = require("../../models/Monitor.js");
var Schedule = require("../../models/Schedule.js");
var ViewModel = require("../../viewmodels/ViewModel");
var ScheduleMapper = require("./ScheduleMapper.js");

function schedule (req, res) {
	var modelView = new ViewModel();

	if (req.query.id) {
		modelView.add("data", () => {
			return Schedule.get(req.query.id)
		});
	}

	modelView.add("schedule", () => {
		return Schedule.list();
	});

	modelView.add("monitors", () => {
		return Monitor.list();
	});

	modelView.add("instances", () => {
		return Instance.list();
	});

	modelView.error((error) => {
		res.send(500, error);
	});

	modelView.execute((context) => {
		context.schedule = context.schedule.map(new ScheduleMapper(context.monitors, context.instances));

		context.schedule.sort((a, b) => {
			if (a.instance > b.instance) {
				return 1;
			}

			if (a.instance < b.instance) {
				return -1;
			}

			if (a.monitor > b.monitor) {
				return 1;
			}

			if (a.monitor < b.monitor) {
				return -1;
			}

			return 0;
		});

		context.showAdd = false;

		if (req.query.add || req.query.id) {
			context.showAdd = true;
		}

		res.render("schedule", context);
	});
}

module.exports = schedule;
