var BaseModel = require('./BaseModel.js');
var connect = require('../repositories/mongo.js').connect;

class Monitor extends BaseModel {
	static _collection() {
		return 'MONITOR';
	}

	_latest(mongoCollection, ip) {
		return new Promise(async function (resolve, reject) {
			try {
				let db = await connect();
				let collection = db.collection(mongoCollection);

				collection
					.find({
						ip: ip
					})
					.sort({date: -1})
					.limit(1)
					.toArray((err, results) => {
						if (err) {
							db.close();
							reject(err);
						} else {
							db.close();
							resolve(results);
						}
					});
			} catch (e) {
				db.close();
				reject(e);
			}
		});
	}

	latest (ip) {
		return this._latest(this.mongoCollection, ip);
	}
}

module.exports = Monitor;
