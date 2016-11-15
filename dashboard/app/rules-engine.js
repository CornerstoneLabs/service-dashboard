var nodeSchedule = require('node-schedule');
var Schedule = require('../models/Schedule.js');
var Monitor = require('../models/Monitor.js');
var Instance = require('../models/Instance.js');
var ruleTaskTimeout = require('../rules/rule-task-timeout.js');
var ruleTaskFailed = require('../rules/rule-task-failed.js');
var ruleLowMemory = require('../rules/memory-check/rule-low-memory.js');

var loadedRules = [];
var job;
var rules = [];
var output = [];
var generated = [];

async function checkSchedule (schedule) {
	let monitorId = schedule.monitor;
	let monitor = await Monitor.get(monitorId);
	let instance = await Instance.get(schedule.instance);
	let results = await monitor.latest(instance.ip);

	results.forEach((result) => {
		try {
			result.errors = [];
			result.messages = [];

			let status = 'green';

			ruleTaskTimeout(result, schedule);
			ruleTaskFailed(result, schedule);
			ruleLowMemory(result, schedule, monitor);

			if (result.errors.length > 0) {
				status = 'red';
			}

			generated.push({
				name: monitor.name,
				monitor: monitor,
				instance: instance,
				schedule: schedule,
				status: status,
				message: result.messages,
				errors: result.errors,
				checkedAgo: result.checkedAgo,
				information: null
			});
		} catch (e) {
			generated.push({
				name: 'MongoDB',
				instance: {
					ip: 'localhost',
					name: 'localhost'
				},
				schedule: {
					_id: null
				},
				monitor: {
					_id: null
				},
				status: 'red',
				message: 'Error connecting to database',
				information: e
			});
		}
	});
}

rules.push(async () => {
	try {
		var schedules = await Schedule.list();

		schedules.forEach(checkSchedule);
	} catch (e) {
		console.log('Error getting schedule list');
		console.log(e);
	}
});

function run () {
	generated = [];
	rules.forEach(async (rule) => {
		await rule();
	});

	output = [];
	output.push({
		name: 'Rules engine',
		status: 'green',
		message: `Running ${rules.length}.`,
		information: null,
		instance: {
			ip: 'localhost',
			name: 'localhost'
		},
		schedule: {
			_id: null
		},
		monitor: {
			_id: null
		}
	});

	generated.forEach((item) => {
		output.push(item);
	});
}

function start () {
	job = nodeSchedule.scheduleJob('* * * * * *', function () {
		run();
	});
}

function status () {
	generated.sort((a, b) => {
		if (a.instance > b.instance) {
			return 1;
		}

		if (a.instance < b.instance) {
			return 0;
		}

		return 0;
	});
	return generated;
}

module.exports = {
	start: start,
	status: status
};