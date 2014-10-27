module.exports = function(tags, options) {
	var failures = [];
	var passes = [];
	if (tags.length === 0) {
		failures.push({
			message: 'No tags',
			details: {
				title: 'The project does not make use of git tags',
				suggestion: 'Before releasing a new version, create a tag to represent the code at the point of that release.'
			}
		});
	} else {
		passes.push({
			message: 'Tags are being used'
		});
	}

	if (options && options.tags) {
		Object.keys(options.tags).forEach(function (testName) {
			var result = options.tags[testName](tags);
			if (!result.pass) {
				failures.push({
					message: testName,
					details: {
						title: result.title,
						suggestion: result.suggestion
					}
				});
			} else {
				passes.push({
					message: result.message || testName
				});
			}
		});
	}

	return {
		failures: failures,
		passes: passes
	};
};