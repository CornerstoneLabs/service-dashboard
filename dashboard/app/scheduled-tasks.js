let nodeSchedule = require('node-schedule');
let Instance = require('../models/Instance.js');
let Monitor = require('../models/Monitor.js');
let Schedule = require('../models/Schedule.js');
let exec = require('child_process').exec;

let jobs = [];
let CWD = './fabric-plugins/';
let COMMAND = 'source ../../env/bin/activate && fab ';
let DASHBOARD_MONGO_DATABASE = 'dumteedum_status';

/**
 * Clone the local environment, then override some variables
 *
 * @param instance
 * @param schedule
 * @param monitor
 * @returns {{evironment}}
 */
function childEnvironmentFactory(instance, schedule, monitor) {
	let environment = {};
	for (let e in process.env) {
		environment[e] = process.env[e];
	}

	environment.hosts = instance.ip;
	environment.user = instance.user;
	environment.DASHBOARD_SCHEDULE_ID = schedule._id;
	environment.DASHBOARD_MONGO_COLLECTION = monitor.mongoCollection;
	environment.DASHBOARD_MONGO_DATABASE = DASHBOARD_MONGO_DATABASE;
	environment.DASHBOARD_PARAMETERS = schedule.parameters || '';
	environment.DASHBOARD_MONGO_CONNECTION = '192.168.1.90';

	return environment;
}

function executeScheduledItemCallback (schedule, monitor, instance) {
	return function (error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		console.log(error);
	};
}

/**
 * Execute the scheduled item.
 *
 * @param schedule
 */
async function executeScheduledItem (schedule) {
	console.log('Preparing to execute scheduled task');

	let monitor = await Monitor.get(schedule.monitor);
	let instance = await Instance.get(schedule.instance);
	let commandText = `${COMMAND} ${monitor.fabricCommand}`;
	let environment = childEnvironmentFactory(instance, schedule, monitor);
	let params = {
		cwd: CWD,
		env: environment,
		shell: '/bin/bash'
	};

	console.log(`Exec: ${commandText}`);
	console.log(environment);
	exec(commandText, params, executeScheduledItemCallback(schedule, monitor, instance));
	console.log('Executed.')
}

/**
 * Enqueue scheduled task in the jobs list.
 *
 * @param schedule
 */
function enqueueJob (schedule) {
	console.log(`Scheduling task ${schedule.monitor} for ${schedule.cron}`);

	try {
		let job = nodeSchedule.scheduleJob(schedule.cron, function () {
			console.log(`Executing task ${schedule.monitor} for ${schedule.cron}`);
			executeScheduledItem(schedule);
		});

		jobs.push(job);
	} catch (e) {
		console.log(e);
	}

	console.log('Created job, pushing into jobs stack.');
}

/**
 * Schedule all jobs in the scheduler to be run.
 */
async function scheduleJobs () {
	let schedules = await Schedule.list();

	schedules.forEach(enqueueJob);
}

async function start () {
	scheduleJobs();
}

/**
 * Cancel all jobs and re-schedule.
 */
function reset() {
	jobs.forEach((job) => {
		job.cancel();
	});

	scheduleJobs();
}

module.exports = {
	start: start,
	reset: reset,
	executeScheduledItem: executeScheduledItem
};
