function elasticSearchMapper(input) {
	var result = {};

	try {
		result.date = input.date;
	} catch (e) {
		// do nothing
	}

	try {
		result.data = input.data._all.total.docs.count;
	} catch (e) {
		// do nothing
	}

	return result;
}

module.exports = elasticSearchMapper;
