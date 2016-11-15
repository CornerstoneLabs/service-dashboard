var UPDATE_CHECK = "[ $(git rev-parse HEAD) = $(git ls-remote $(git rev-parse --abbrev-ref @{u} | sed 's/\\// /g') | cut -f1) ] && echo up to date || echo not up to date";
var UPDATE_UPDATE = "git pull";
var UPDATE_CRON = "0 * * * * *";
var exec = require('child_process').exec;
var nodeSchedule = require('node-schedule');
var job;
var _hasUpdates;
var _isUpdating;

function hasUpdates (value) {
	if (typeof value !== 'undefined') {
		_hasUpdates = value;
	}
}

function status () {
	return {
		hasUpdates: _hasUpdates,
		isUpdating: _isUpdating
	};
}

function checkForUpdatesDelegate (error, stdout, stderr) {
	stdout = stdout.trim();
	if (typeof stdout === 'string'
		&& stdout === 'not up to date') {
		console.log(stdout);
		hasUpdates(true);
	} else {
		hasUpdates(false);
	}
}

function checkForUpdates () {
	exec(UPDATE_CHECK, checkForUpdatesDelegate);
}

function doUpdateDelegate (error, stdout, stderr) {
	console.log(error);
	console.log(stdout);
	console.log(stderr);
	_isUpdating = false;
	checkForUpdates();
}

function doUpdate () {
	_isUpdating = true;
	exec(UPDATE_UPDATE, doUpdateDelegate);
}

function scheduleUpdateCheck () {
	job = nodeSchedule.scheduleJob(UPDATE_CRON, function () {
		checkForUpdates();
	});
}

function start () {
	scheduleUpdateCheck();
	checkForUpdates();
}

module.exports = {
	start: start,
	scheduleUpdateCheck: scheduleUpdateCheck,
	checkForUpdates: checkForUpdates,
	checkForUpdatesDelegate: checkForUpdatesDelegate,
	hasUpdates: hasUpdates,
	doUpdate: doUpdate,
	status: status
};