module.exports = function(issues, username) {
	var passes = [];
	var failures = [];
	issues.forEach(function(issue) {
		if (issue.user.login !== username && issue.comments === 0) {
			failures.push({
				message: 'Uncommented issue',
				details: {
					title: issue.title,
					url: issue.html_url
				}
			});
		}

		if (issue.user.login !== username && issue.labels.length === 0 && issue.comments === 0) {
			failures.push({
				message: 'Untouched issue',
				details: {
					title: issue.title,
					url: issue.html_url
				}
			});
		}
	});

	return {
		passes: passes,
		failures: failures
	};
};