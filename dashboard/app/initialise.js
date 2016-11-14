var express = require('express');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

function initialise () {
	var app = express();

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.engine('handlebars', exphbs({defaultLayout: 'main'}));
	app.set('view engine', 'handlebars');

	return app;
}

module.exports = initialise;
