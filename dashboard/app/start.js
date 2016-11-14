function start (app) {
	var port = parseInt(process.env.SERVER_PORT);

	app.listen(port);

	console.log('Started on port', port);
}

module.exports = start;
