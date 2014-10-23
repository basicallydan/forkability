module.exports = function(tags) {
	var failures = [];
	if (tags.length === 0) {
		failures.push({
			message: 'No tags',
			details: {
				title: 'The project does not make use of git tags',
				suggestion: 'Before releasing a new version, create a tag to represent the code at the point of that release.'
			}
		});
	}

	return {
		failures: failures,
		passes: []
	};
};