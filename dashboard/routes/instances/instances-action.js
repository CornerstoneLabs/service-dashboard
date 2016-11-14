var Status = require('../../models/Instance.js');

function instancesAction (req, res) {
	function success () {
		res.redirect('/instances');
	}

	function fail () {
		res.send(500);
	}

	switch (req.body.action) {
	case 'delete':
		Status
			.remove(req.body.selected)
			.then(success, fail);
		break;

	default:
		success();
	}
}

module.exports = instancesAction;
