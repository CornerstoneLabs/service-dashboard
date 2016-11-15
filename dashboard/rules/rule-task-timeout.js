module.exports = function (data, schedule) {
	var timeDifference = parseInt((new Date() - data.date) / 1000);
	var result = timeDifference > schedule.timeout;

	if (result === true) {
		data.errors.push(`Checked ${timeDifference} seconds ago! `);
	} else {
		data.checkedAgo = `Checked ${timeDifference}s ago.`;

		if (timeDifference > 60) {
			let newTimeDifference = parseInt(timeDifference / 60);
			data.checkedAgo = `Checked ${newTimeDifference}m ago.`;
		}

		if (timeDifference > 3600) {
			let newTimeDifference = parseInt(timeDifference / 3600);
			data.checkedAgo = `Checked ${newTimeDifference}h ago.`;
		}
	}
};