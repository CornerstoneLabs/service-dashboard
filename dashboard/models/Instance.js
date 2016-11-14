var BaseModel = require('./BaseModel.js');

class Instance extends BaseModel {
	static _collection() {
		return 'INSTANCES';
	}
}

module.exports = Instance;
