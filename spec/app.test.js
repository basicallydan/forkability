var forkability = require('..');
var should = require('should');
var mockResponses = require('./helper.mockResponses.js');
// var nock = require('nock');

describe('forkability', function() {
	// beforeEach(function () {
	// 	nock.cleanAll();
	// });

	it('should identify that the repo has all recommended features', function(done) {
		mockResponses();

		forkability({
			user: 'thatoneguy',
			repository: 'thatonerepo'
		},
		function (err, report) {
			should(err).eql(null);
			report.features.passes.should.containEql({ message : 'Contributing document' });
			report.features.passes.should.containEql({ message : 'Readme document' });
			report.features.passes.should.containEql({ message : 'Licence document' });
			report.features.passes.should.containEql({ message : 'Test suite' });
			report.features.passes.should.containEql({ message : 'Changelog document' });
			report.features.passes.should.containEql({ message : 'All open issues have been acknowledged' });
			report.features.passes.should.have.a.lengthOf(6);
			report.features.failures.should.be.empty;
			done();
		});
	});

	// Fairly sure this test is a false positive
	it('should identify that the repo has all recommended features when basic auth specified', function(done) {
		mockResponses({
			firstCommitTreeRequestHeaders: {
				auth: {
					username: 'thatoneguy',
					password: 'password'
				},
				'User-Agent': 'Forkability (http://github.com/basicallydan/forkability) (Daniel Hough <daniel.hough@gmail.com>)'
			}
		});

		forkability({
			user: 'thatoneguy',
			repository: 'thatonerepo',
			auth: {
				username: 'thatoneguy',
				password: 'password'
			}
		},
		function (err, report) {
			should(err).eql(null);
			report.features.passes.should.containEql({ message : 'Contributing document' });
			report.features.passes.should.containEql({ message : 'Readme document' });
			report.features.passes.should.containEql({ message : 'Licence document' });
			report.features.passes.should.containEql({ message : 'Test suite' });
			report.features.passes.should.containEql({ message : 'Changelog document' });
			report.features.passes.should.containEql({ message : 'All open issues have been acknowledged' });
			report.features.passes.should.have.a.lengthOf(6);
			report.features.failures.should.be.empty;
			done();
		});
	});

	// Fairly sure this test is a false positive
	it('should identify that the repo has all recommended features when an auth token is provided', function(done) {
		mockResponses({
			firstCommitTreeRequestHeaders: {
				auth: {
					token: 'whatevs'
				},
				'User-Agent': 'Forkability (http://github.com/basicallydan/forkability) (Daniel Hough <daniel.hough@gmail.com>)'
			}
		});

		forkability({
			user: 'thatoneguy',
			repository: 'thatonerepo',
			auth: {
				token: 'whatevs'
			}
		},
		function (err, report) {
			should(err).eql(null);
			report.features.passes.should.containEql({ message : 'Contributing document' });
			report.features.passes.should.containEql({ message : 'Readme document' });
			report.features.passes.should.containEql({ message : 'Licence document' });
			report.features.passes.should.containEql({ message : 'Test suite' });
			report.features.passes.should.containEql({ message : 'Changelog document' });
			report.features.passes.should.containEql({ message : 'All open issues have been acknowledged' });
			report.features.passes.should.have.a.lengthOf(6);
			report.features.failures.should.be.empty;
			done();
		});
	});

	it('should warn about uncommented issues', function(done) {
		mockResponses({
			openIssuesBody: [
				{
					number: 1234,
					title: 'Your repo sucks',
					state: 'open',
					html_url: 'https://github.com/thatoneguy/thatonerepo/issues/1234',
					user: {
						login: 'notthatoneguy'
					},
					comments: 0,
					labels: [{}]
				},
				{
					number: 2345,
					title: 'This is the worst open source project ever',
					html_url: 'https://github.com/thatoneguy/thatonerepo/issues/2345',
					state: 'open',
					labels: [{}],
					user: {
						login: 'someoneelse'
					},
					comments: 0
				},
				{
					number: 3456,
					html_url: 'https://github.com/thatoneguy/thatonerepo/issues/3456',
					state: 'open',
					labels: [{}],
					user: {
						login: 'thatoneguy'
					},
					comments: 0
				}
			]
		});

		forkability({
			user: 'thatoneguy',
			repository: 'thatonerepo'
		},
		function (err, report) {
			should(err).eql(null);

			report.features.failures.should.containEql({
				message: 'Uncommented issue',
				details: {
					url: 'https://github.com/thatoneguy/thatonerepo/issues/1234',
					title: 'Your repo sucks',
					suggestion: 'Comment on the issue to indicate acknowledgement'
				}
			});

			report.features.failures.should.containEql({
				message: 'Uncommented issue',
				details: {
					url: 'https://github.com/thatoneguy/thatonerepo/issues/2345',
					title: 'This is the worst open source project ever',
					suggestion: 'Comment on the issue to indicate acknowledgement'
				}
			});

			done();
		});
	});
	
	it('should warn about issues with no comments and no tags (untouched issues)', function (done) {
		mockResponses({
			openIssuesBody: [
				{
					number: 1234,
					title: 'This issue has no comments and no labels',
					state: 'open',
					html_url: 'https://github.com/thatoneguy/thatonerepo/issues/1234',
					user: {
						login: 'notthatoneguy'
					},
					labels: [],
					comments: 0
				},
				{
					number: 3456,
					html_url: 'https://github.com/thatoneguy/thatonerepo/issues/3456',
					state: 'open',
					user: {
						login: 'thatoneguy'
					},
					labels: [],
					comments: 0
				}
			]
		});

		forkability({
			user: 'thatoneguy',
			repository: 'thatonerepo'
		},
		function (err, report) {
			should(err).eql(null);
			report.features.failures.should.containEql({
				message: 'Untouched issue',
				details: {
					title: 'This issue has no comments and no labels',
					url: 'https://github.com/thatoneguy/thatonerepo/issues/1234',
					suggestion: 'Comment or label the issue to indicate acknowledgement'
				}
			});
			done();
		});
	});

	it('should warn about tag failures', function (done) {
		mockResponses({
			tagsBody: []
		});

		forkability({
			user: 'thatoneguy',
			repository: 'thatonerepo'
		},
		function (err, report) {
			console.log('Report!', report);
			should(err).eql(null);
			report.features.failures.should.containEql({
				message: 'No tags',
				details: {
					title: 'The project does not make use of git tags',
					suggestion: 'Before releasing a new version, create a tag to represent the code at the point of that release.'
				}
			});
			done();
		});
	});
});