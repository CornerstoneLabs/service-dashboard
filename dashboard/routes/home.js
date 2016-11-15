var Instance = require('../models/Instance.js');
var homeViewModel = require('../viewmodels/home-view-model.js');
var rulesEngine = require('../app/rules-engine.js');
var updateManager = require('../app/update-manager.js');

async function home (req, res) {
	try {
		var context = await homeViewModel();

		context.updateStatus = updateManager.status();
		context.rules = rulesEngine.status();
		context.instances = await Instance.list();

		context.rulesInstances = {};
		var hosts = [];

		context.rules.forEach((rule) => {
			console.log(rule);

			let key = `${rule.instance.name}`;

			if (hosts.indexOf(key) === -1) {
				hosts.push(key);
			}

			if (typeof context.rulesInstances[key] === 'undefined') {
				context.rulesInstances[key] = [];
			}
			context.rulesInstances[key].push(rule);
		});

		context.instanceData = [];

		hosts.forEach((host) => {
			context.rulesInstances[host].sort((a, b) => {
				if (a.name > b.name) {
					return 1;
				}

				if (a.name < b.name) {
					return -1;
				}

				return 0;
			});

			context.rulesInstances[host].sort();
			context.instanceData.push({
				ip: host,
				rules: context.rulesInstances[host]
			});
		});

		context.instanceData.sort((a, b) => {
			if (a.ip > b.ip) {
				return 1;
			}

			if (a.ip < b.ip) {
				return -1;
			}

			return 0;
		});

		res.render('home', context);
	} catch (e) {
		res.send(500);
	}
}

module.exports = home;
