var lintTags = require('../lib/lintTags');

describe('lintTags', function () {
	it('should return warning of no tags found', function () {
		var tags = [];

		var report = lintTags(tags, 'joebloggs');

		report.failures.should.containEql({
			message: 'No tags',
			details: {
				title: 'The project does not make use of git tags',
				suggestion: 'Before releasing a new version, create a tag to represent the code at the point of that release.'
			}
		});

		report.failures.length.should.eql(1);
	});
});