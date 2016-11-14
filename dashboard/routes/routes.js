function registerCrud(app, mountPoint, moduleName) {
	app.get(`${mountPoint}/`, require(`./${moduleName}/${moduleName}.js`));
	app.post(`${mountPoint}/add`, require(`./${moduleName}/${moduleName}-add.js`));
	app.post(`${mountPoint}/action`, require(`./${moduleName}/${moduleName}-action.js`));
	app.get(`${mountPoint}/action`, require(`./${moduleName}/${moduleName}-action.js`));
}

function routes (app) {
	app.get('/', require('./home.js'));

	registerCrud(app, '/monitor', 'monitor');
	registerCrud(app, '/instances', 'instances');
	registerCrud(app, '/schedule', 'schedule');
}

module.exports = routes;
