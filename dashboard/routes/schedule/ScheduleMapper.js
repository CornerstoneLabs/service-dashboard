class ScheduleMapper {
	findById (items, id) {
		var find = items.filter((x) => {
			return x._id.toString() === id;
		});

		if (find.length > 0) {
			return find[0].name;
		}

		return id;
	}

	constructor (monitors, instances) {
		this.monitors = monitors;
		this.instances = instances;

		var _this = this;

		return function (item) {
			item.monitorName = _this.findById(_this.monitors, item.monitor);
			item.instanceName = _this.findById(_this.instances, item.instance);

			return item;
		};
	}
}

module.exports = ScheduleMapper;