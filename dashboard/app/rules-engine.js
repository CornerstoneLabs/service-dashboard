var nodeSchedule = require('node-schedule');
var Schedule = require('../models/Schedule.js');
var Monitor = require('../models/Monitor.js');
var Instance = require('../models/Instance.js');
var job;
var rules = [];
var output = [];
var generated = [];

function evaluateTimeOut(data, schedule) {
	var timeDifference = parseInt((new Date() - data.date) / 1000);
	var result = timeDifference > schedule.timeout;

	if (result === true) {
		data.errors.push(`Checked ${timeDifference} seconds ago! `);
	} else {
		data.checkedAgo = `Checked ${timeDifference}s ago.`;

		if (timeDifference > 60) {
			let newTimeDifference = parseInt(timeDifference / 60);
			data.checkedAgo = `Checked ${newTimeDifference}m ago.`;
		}

		if (timeDifference > 3600) {
			let newTimeDifference = parseInt(timeDifference / 3600);
			data.checkedAgo = `Checked ${newTimeDifference}h ago.`;
		}
	}
}

function evaluateFailed(data, schedule) {
	if (data.ok === false) {
		data.errors.push('Failing');
	}
}

function memoryParser (data) {
	var result = {};

	data.data.forEach((item) => {
		result[item.name] = item.value;
	});

	return result;
}

function evaluateMemory(data, schedule, monitor) {
	if (monitor.fabricCommand === 'status__memory_free') {
		try {
			var parsedData = memoryParser(data);
			var available = parseInt(parsedData.available);
			var total = parseInt(parsedData.total);
			var percentage = parseInt((parseFloat(available) / parseFloat(total)) * 100);
			var quarter = (total / 4);

			if (available < quarter) {
				data.errors.push('Free memory lower than 25%');
			}

			data.messages.push(`${available} of ${total}. ${percentage}% free`);
		} catch (e) {
			//data.errors.push(e);
		}
	}
}

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

			evaluateTimeOut(result, schedule);
			evaluateFailed(result, schedule);
			evaluateMemory(result, schedule, monitor);

			if (result.errors.length > 0) {
				status = 'red';
			}

			generated.push({
				name: monitor.name,
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
		var result = await rule();
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