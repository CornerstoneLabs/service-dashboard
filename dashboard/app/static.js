var express = require('express');

function staticFiles(app) {
	var options = {
		dotfiles: 'ignore',
		index: false,
		maxAge: '1d',
		redirect: false
	};

	app.use(express.static('public', options));
}

module.exports = staticFiles;
