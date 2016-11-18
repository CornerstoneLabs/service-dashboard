var nodeSchedule = require('node-schedule');
var Schedule = require('../models/Schedule.js');
var Monitor = require('../models/Monitor.js');
var Instance = require('../models/Instance.js');
var glob = require('glob');
var path = require('path');

var loadedRules = [];
var job;
var rules = [];
var output = [];
var generated = [];
var oldCountFailed = 0;
var _oldScrobble = {};
var _scrobble = {};

glob.sync('./rules/**/*.js').forEach(function(file) {
	var r = require(path.resolve(file));
	loadedRules.push(r);
});

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

			loadedRules.forEach((rule)=> {
				rule(result, schedule, monitor);
			});

			if (result.errors.length > 0) {
				status = 'red';

			}

			let payload = {
				name: monitor.name,
				monitor: monitor,
				instance: instance,
				schedule: schedule,
				status: status,
				message: result.messages,
				errors: result.errors,
				checkedAgo: result.checkedAgo,
				information: null
			};

			generated.push(payload);

			_scrobble[monitor._id + '_' + instance._id + '_' + schedule._id] = payload;
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

var NOTIFY_USERS = JSON.parse(process.env['NOTIFY_USERS']);

function notify (text) {
	let Twit = require('twit')

	let twit = new Twit({
		consumer_key: process.env['CONSUMER_KEY'],
		consumer_secret: process.env['CONSUMER_SECRET'],
		access_token: process.env['ACCESS_TOKEN'],
		access_token_secret: process.env['ACCESS_TOKEN_SECRET'],
		timeout_ms: 60*1000
	});

	NOTIFY_USERS.forEach((screenName) => {
		let payload = {
			screen_name: screenName,
			text: text
		};

		twit.post('direct_messages/new', payload, function (err, data, response) {
			console.log(err);
			console.log(data);
		})
	});
}

notify('Starting up dashboard');

function run () {
	generated = [];
	rules.forEach(async(rule) => {
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

	notifyFailedSucceeded();
}

function notifyFailedSucceeded () {
	let countFailed = 0;
	Object.keys(_scrobble).forEach((rule) => {
		if (_scrobble[rule].status && _scrobble[rule].status === 'red') {
			if (!_oldScrobble[rule] || (
				_oldScrobble[rule] &&
				_oldScrobble[rule].status &&
				_oldScrobble[rule].status === 'green')) {
				notify(_scrobble[rule].instance.name + ' ' +
					_scrobble[rule].monitor.name +
					' warning. ' + _scrobble[rule].errors.join(' '));
			}

			countFailed++;
		}

		if (_scrobble[rule].status && _scrobble[rule].status === 'green') {
			if (_oldScrobble[rule] &&
				_oldScrobble[rule].status &&
				_oldScrobble[rule].status === 'red') {
				notify(_scrobble[rule].instance.name + ' ' +
					_scrobble[rule].monitor.name +
					' recovered.');
			}

			countFailed++;
		}

		_oldScrobble[rule] = _scrobble[rule];
	});

	if (countFailed !== oldCountFailed) {
		// report failed
		//notify(countFailed + ' failing rule');
	}
	oldCountFailed = countFailed;
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