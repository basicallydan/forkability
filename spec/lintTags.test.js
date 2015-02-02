var lintTags = require('../lib/lintTags');

xdescribe('lintTags', function () {
	it('should return warning of no tags found', function () {
		var tags = [];

		var report = lintTags(tags);

		report.failures.should.containEql({
			message: 'No tags',
			details: {
				title: 'The project does not make use of git tags',
				suggestion: 'Before releasing a new version, create a tag to represent the code at the point of that release.'
			}
		});

		report.failures.length.should.eql(1);
	});

	it('should return success if a tag found', function () {
		var tags = ['thetag'];

		var report = lintTags(tags);

		report.passes.should.containEql({
			message: 'Tags are being used'
		});

		report.failures.length.should.eql(0);
	});

	it('should return a failure for an injected tag requirement which passes', function () {
		var tags = ['v1.1'];

		var report = lintTags(tags, {
			tags: {
				'No tags called v1.0': function (tags) {
					return {
						pass: false,
						title: 'There was no tag called v1.0',
						suggestion: 'Create a tag called v1.0'
					};
				}
			}
		});

		report.failures.should.containEql({
			message: 'No tags called v1.0',
			details: {
				title: 'There was no tag called v1.0',
				suggestion: 'Create a tag called v1.0'
			}
		});

		report.failures.length.should.eql(1);
		report.passes.length.should.eql(1);
	});

	it('should return a pass for an injected tag requirement which passes', function () {
		var tags = ['v1.0'];

		var report = lintTags(tags, {
			tags: {
				'No tags called v1.0': function (tags) {
					return {
						pass: true,
						message: 'There was a tag called v1.0'
					};
				}
			}
		});

		report.passes.should.containEql({
			message: 'There was a tag called v1.0'
		});

		report.failures.length.should.eql(0);
		report.passes.length.should.eql(2);
	});
});