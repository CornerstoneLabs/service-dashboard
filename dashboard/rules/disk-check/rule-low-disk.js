module.exports = function evaluateDisk(data, schedule, monitor) {
	if (monitor.fabricCommand === 'status__disk') {
		try {
			data.forEach(function (disk) {
				data.messages.push(`${disk.name}: ${disk.use_percent}% of ${disk.size}`);
			});
		} catch (e) {

		}
	}
};
