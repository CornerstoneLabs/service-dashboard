var updateManager = require('../../app/update-manager.js');

function update(request, response) {
	updateManager.doUpdate();

	response.redirect(request.headers.referer || '/');
}

module.exports = update;