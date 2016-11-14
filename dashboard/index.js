//
// Set up environment.
//
var dotenv = require('dotenv');
dotenv.config();
require("babel-register");
require("babel-polyfill");

//
// Now load dependencies.
//
var helpers = require('./app/helpers.js');
var initialise = require('./app/initialise.js');
var routes = require('./routes/routes.js');
var start = require('./app/start.js');
var staticFiles = require('./app/static.js');
var scheduledTasks = require('./app/scheduled-tasks.js');
var rulesEngine = require('./app/rules-engine.js');

//
// Start app.
//
var app = initialise();
helpers();
routes(app);
staticFiles(app);
start(app);

//
// Now the app is started, start the monitors and rules engine.
//
scheduledTasks.start();
rulesEngine.start();