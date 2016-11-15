module.exports = function evaluateFailed(data, schedule, monitor) {
	if (data.ok === false) {
		data.errors.push('Failing');
	}
};