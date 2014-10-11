module.exports = function(issues, username) {
	var passes = [];
	var failures = [];
	issues.forEach(function(issue) {
		if (issue.user.login !== username && issue.comments === 0) {
			failures.push({
				message: 'Uncommented issue',
				details: {
					title: issue.title,
					url: issue.html_url,
					suggestion: 'Comment on the issue to indicate acknowledgement'
				}
			});
		}

		if (issue.user.login !== username && issue.labels.length === 0 && issue.comments === 0) {
			failures.push({
				message: 'Untouched issue',
				details: {
					title: issue.title,
					url: issue.html_url,
					suggestion: 'Comment or label the issue to indicate acknowledgement'
				}
			});
		}

		if (failures.length === 0) {
			passes.push({
				message: 'All open issues have been acknowledged'
			});
		}
	});

	return {
		passes: passes,
		failures: failures
	};
};