let Instance = require('../models/Instance.js');
let homeViewModel = require('../viewmodels/home-view-model.js');
let rulesEngine = require('../app/rules-engine.js');
let updateManager = require('../app/update-manager.js');

async function home (req, res) {
	let startTime = new Date();

	try {
		let context = await homeViewModel();

		context.updateStatus = updateManager.status();
		context.rules = rulesEngine.status();
		context.instances = await Instance.list();

		context.rulesInstances = {};
		let hosts = [];

		context.rules.forEach((rule) => {
			if (req.query.instanceid) {
				if (rule.instance._id.toString() !== req.query.instanceid) {
                    return;
				}
			}

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

		let template = 'home';
		if (req.query.sparse && (req.query.sparse === 'true')) {
			template = 'home-sparse';
			context.layout = false;
		}

		context.timed = new Date().getTime() - startTime.getTime();

		res.render(template, context);
	} catch (e) {
		res.send(500);
	}
}

module.exports = home;
