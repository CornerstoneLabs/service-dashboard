var THRESHOLD = 80;

module.exports = function evaluateDisk(data, schedule, monitor) {
	if (monitor.fabricCommand === 'status__disk') {
		try {
			data.data.forEach(function (disk) {
				let name = disk.name;
				let use_percent = disk.use_percent;
				let size = disk.size + 'KB';

				if (disk.size > 1024) {
					size = parseInt(disk.size / 1024) + 'MB';
				}

				if (disk.size > 1024*1024) {
					size = parseInt(disk.size / (1024*1024)) + 'GB';
				}

				let crossedThreshold = false;

				if (parseInt(use_percent.replace('%', '')) > THRESHOLD) {
					crossedThreshold = true;
				}

				if (crossedThreshold) {
					data.errors.push(`${name}: ${use_percent} used of ${size}`);
				} else {
					data.messages.push(`${name}: ${use_percent} used of ${size}.`);
				}
			});
		} catch (e) {
		}
	}
};
