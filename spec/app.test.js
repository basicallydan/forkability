var forkability = require('..');
var should = require('should');
var mockResponses = require('./helper.mockResponses.js');
// var nock = require('nock');

describe('forkability', function() {
	// beforeEach(function () {
	// 	nock.cleanAll();
	// });

	it('should identify that the repo has all recommended files', function(done) {
		mockResponses();

		forkability({
			user: 'thatoneguy',
			repository: 'thatonerepo'
		},
		function (err, report) {
			should(err).eql(null);
			report.files.present.should.containEql('Contributing document');
			report.files.present.should.containEql('Readme document');
			report.files.present.should.containEql('Licence document');
			report.files.present.should.containEql('Test suite');
			report.files.present.should.containEql('Changelog document');
			report.files.present.should.have.a.lengthOf(5);
			report.files.missing.should.be.empty;
			done();
		});
	});

	// Fairly sure this test is a false positive
	it('should identify that the repo has all recommended files when basic auth specified', function(done) {
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
			report.files.present.should.containEql('Contributing document');
			report.files.present.should.containEql('Readme document');
			report.files.present.should.containEql('Licence document');
			report.files.present.should.containEql('Test suite');
			report.files.present.should.containEql('Changelog document');
			report.files.present.should.have.a.lengthOf(5);
			report.files.missing.should.be.empty;
			done();
		});
	});

	// Fairly sure this test is a false positive
	it('should identify that the repo has all recommended files when an auth token is provided', function(done) {
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
			report.files.present.should.containEql('Contributing document');
			report.files.present.should.containEql('Readme document');
			report.files.present.should.containEql('Licence document');
			report.files.present.should.containEql('Test suite');
			report.files.present.should.containEql('Changelog document');
			report.files.present.should.have.a.lengthOf(5);
			report.files.missing.should.be.empty;
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

			report.warnings.should.containEql({
				message: 'Uncommented issue',
				details: {
					url: 'https://github.com/thatoneguy/thatonerepo/issues/1234',
					title: 'Your repo sucks'
				}
			});

			report.warnings.should.containEql({
				message: 'Uncommented issue',
				details: {
					url: 'https://github.com/thatoneguy/thatonerepo/issues/2345',
					title: 'This is the worst open source project ever'
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
			report.warnings.should.containEql({
				message: 'Untouched issue',
				details: {
					title: 'This issue has no comments and no labels',
					url: 'https://github.com/thatoneguy/thatonerepo/issues/1234'
				}
			});
			done();
		});
	});
});