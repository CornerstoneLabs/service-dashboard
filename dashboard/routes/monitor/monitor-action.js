var Monitor = require('../../models/Monitor.js');

function monitorAction (req, res) {
	function success () {
		res.redirect('/monitor');
	}

	function fail () {
		res.send(500);
	}

	switch (req.body.action) {
	case 'delete':
		Monitor
			.remove(req.body.selected)
			.then(success, fail);
		break;

	default:
		success();
	}
}

module.exports = monitorAction;
