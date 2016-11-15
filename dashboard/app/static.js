var express = require('express');

function staticFiles(app) {
	var options = {
		dotfiles: 'ignore',
		index: false,
		maxAge: '1d',
		redirect: false
	};

	app.use(express.static('public', options));
	app.use('/theme', express.static('../paper-dashboard-free-v1.1/assets', options));
}

module.exports = staticFiles;
