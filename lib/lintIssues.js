module.exports = function(issues, username) {
	var warnings = [];
	issues.forEach(function(issue) {
		if (issue.user.login !== username && issue.comments === 0) {
			warnings.push({
				message: 'Uncommented issue',
				details: {
					title: issue.title,
					url: issue.html_url
				}
			});
		}

		if (issue.user.login !== username && issue.labels.length === 0 && issue.comments === 0) {
			warnings.push({
				message: 'Untouched issue',
				details: {
					title: issue.title,
					url: issue.html_url
				}
			});
		}
	});

	return warnings;
};