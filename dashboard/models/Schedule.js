var BaseModel = require('./BaseModel.js');
var Instance= require('./Instance.js');
var Monitor = require('./Monitor.js');

class Schedule extends BaseModel {
	static _collection() {
		return 'SCHEDULE';
	}

	Instance () {
		var instanceId = this.instance;

		return new Promise(async (resolve, reject) => {
			try {
				var instance = await Instance.get(instanceId);
				resolve(instance);
			} catch (e) {
				reject(e);
			}
		})
	}

	Monitor () {
		var monitorId = this.monitor;

		return new Promise(async (resolve, reject) => {
			try {
				var monitor = await Monitor.get(monitorId);
				resolve(monitor);
			} catch (e) {
				reject(e);
			}
		})
	}
}

module.exports = Schedule;
