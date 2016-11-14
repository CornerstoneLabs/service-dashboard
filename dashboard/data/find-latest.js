function findLatest(data) {
	var result = null;
	var oldDate = null;

	data.forEach((item) => {
		var itemIsNewer =
			(oldDate === null) ||
			(
				(oldDate !== null) &&
				(item.date > oldDate)
			);

		if (itemIsNewer) {
			oldDate = item.date;
			result = item.data;
		}
	});

	return {
		date: oldDate,
		data: result
	};
}

module.exports = findLatest;
