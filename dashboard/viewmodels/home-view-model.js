var elasticSearchMapper = require('../mappers/elastic-search-mapper.js');
var memoryFreeMapper = require('../mappers/memory-free-mapper.js');
var findLatest = require('../data/find-latest.js');
var connect = require('../repositories/mongo.js').connect;

var queries = [
	{
		name: 'elasticsearch',
		collection: 'elasticsearch',
		mapper: elasticSearchMapper,
		partial: 'elasticsearch',
		latest: true
	},
	{
		name: 'memoryFree',
		collection: 'memory-free',
		mapper: memoryFreeMapper,
		partial: 'memory-free',
		latest: true
	}
];

function homeViewModel() {
	var _db;

	function executeQuery(query) {
		return new Promise((resolve, reject) => {
			var collection = _db.collection(query.collection);

			if (query.latest) {
				collection.find().sort({date:-1}).limit(1).toArray(function(err, results) {
					query.data = results.map(query.mapper);
					query.latest = findLatest(query.data);

					resolve();
				});
			}
		});
	}

	function complete(resolve) {
		var context = {};

		queries.forEach((query) => {
			context[query.name] = query;
		});

		context.partials = queries.map((item) => {
			return () => {
				return item.partial;
			};
		});

		resolve(context);

		_db.close();
	}

	function checkAll(resolve, reject) {
		return function () {
			var success = true;

			queries.forEach((query) => {
				if (typeof query.data === 'undefined') {
					success = false;
				}
			});

			if (success) {
				complete(resolve);
			}
		};
	}

	function executeQueries(db) {
		_db = db;
		var promises = [];

		queries.forEach((query) => {
			promises.push(executeQuery(query));
		});

		return Promise.all(promises);
	}

	return new Promise((resolve, reject) => {
		connect()
			.then(executeQueries)
			.then(checkAll(resolve, reject), reject);
	});
}

module.exports = homeViewModel;
