module.exports = function evaluateDisk(data, schedule, monitor) {
	if (monitor.fabricCommand === 'status__elasticsearch') {
		try {
			var parsedData = JSON.parse(data.data);
			let allDocs = parsedData._all.primaries.docs.count;
			let successfulShards = parsedData._shards.successful;
			let totalShards = parsedData._shards.total;

			data.messages.push(`${allDocs} docs.`);
			data.messages.push(`${successfulShards} of ${totalShards} shards.`);

		} catch (e) {
		}
	}
};
