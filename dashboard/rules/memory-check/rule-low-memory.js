function memoryParser (data) {
	var result = {};

	data.data.forEach((item) => {
		result[item.name] = item.value;
	});

	return result;
}

var THRESHOLD = 25;

module.exports = function evaluateMemory(data, schedule, monitor) {
	if (monitor.fabricCommand === 'status__memory_free') {
		try {
			var parsedData = memoryParser(data);
			var available = parseInt(parsedData.available || parsedData.free);
			var total = parseInt(parsedData.total);
			var percentage = parseInt((parseFloat(available) / parseFloat(total)) * 100);
			var quarter = (total * (THRESHOLD / 100));

			if (available < quarter) {
				data.errors.push('Free memory lower than ' + THRESHOLD + '%');
			}

			data.messages.push(`${available} of ${total}. ${percentage}% free`);
		} catch (e) {

		}
	}
};