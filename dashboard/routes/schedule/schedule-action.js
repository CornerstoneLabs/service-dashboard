var ScheduleAction = require('./ScheduleAction.js');

function scheduleAction (req, res) {
	var scheduleAction = new ScheduleAction(req, res);
	scheduleAction.handle();
}

module.exports = scheduleAction;
