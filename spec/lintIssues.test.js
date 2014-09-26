var lintIssues = require('../lib/lintIssues');

describe('lintIssues', function () {
	it('should return presence of a readme with a markdown extension', function () {
		var issues = [
			{
				user: {
					login: 'jimbob'
				},
				comments: 0,
				labels: [],
				title: 'This issue has no comments',
				html_url: 'This is a URL'
			}
		];

		var warnings = lintIssues(issues, 'joebloggs');

		warnings.should.containEql({
			message: 'Uncommented issue',
			details: {
				url: 'This is a URL',
				title: 'This issue has no comments'
			}
		});
	});
});