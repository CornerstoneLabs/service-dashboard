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

				data.messages.push(`${name}: ${use_percent}% of ${size}`);
			});
		} catch (e) {
		}
	}
};
