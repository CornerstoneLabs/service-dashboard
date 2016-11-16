module.exports = function evaluateDisk(data, schedule, monitor) {
	if (monitor.fabricCommand === 'status__disk') {
		try {
			data.forEach(function (disk) {
				let name = disk.name;
				let use_percent = disk.use_percent;
				let size = disk.size + 'KB';

				if (disk.size > 1024) {
					size = disk.size + 'MB';
				}

				if (disk.size > 1024*1024) {
					size = disk.size + 'GB';
				}

				data.messages.push(`${name}: ${use_percent}% of ${size}`);
			});
		} catch (e) {
			console.log(e);
		}
	}
};
