var nock = require('nock');
var forkability = require('..');
var should = require('should');

function mockResponses(responses) {
	responses = responses || {};

	nock('https://api.github.com')
		.get('/repos/thatoneguy/thatonerepo/commits')
		.reply(responses.commitsStatus || 200, responses.commitsBody || [{
			sha: 'fakeshalol'
		}]);

	nock('https://api.github.com')
		.get('/repos/thatoneguy/thatonerepo/git/trees/fakeshalol')
		.reply(responses.firstCommitTreeStatus || 200, responses.firstCommitTreeBody || {
			tree: [{
				path: 'contributing.md'
			}, {
				path: 'readme.md'
			}, {
				path: 'licence.md'
			}]
		});

	nock('https://api.github.com')
		.get('/repos/thatoneguy/thatonerepo/issues?state=open')
		.reply(responses.openIssuesStatus || 200, responses.openIssuesBody || []);
}

describe('forkability', function() {
	beforeEach(function () {
		nock.cleanAll();
	});

	it('should identify that the repo has both contributing and readme docs', function(done) {
		mockResponses();

		forkability('thatoneguy', 'thatonerepo', function (err, report) {
			should(err).eql(null);
			report.files.present.should.containEql('Contributing document');
			report.files.present.should.containEql('Readme document');
			report.files.present.should.containEql('Licence document');
			report.files.present.should.have.a.lengthOf(3);
			report.files.missing.should.be.empty;
			done();
		});
	});

	it('should identify that the repo has just a contributing doc, but nothing else', function(done) {
		mockResponses({
			firstCommitTreeBody: {
				tree: [{
					path: 'contributing.md'
				}]
			}
		});

		forkability('thatoneguy', 'thatonerepo', function (err, report) {
			should(err).not.be.ok;
			report.files.present.should.containEql('Contributing document').and.lengthOf(1);
			report.files.missing.should.containEql('Readme document');
			report.files.missing.should.containEql('Licence document');
			report.files.missing.should.have.a.lengthOf(2);
			done();
		});
	});

	it('should be case insensitive about the presence of files', function(done) {
		mockResponses({
			firstCommitTreeBody: {
				tree: [{
					path: 'CONTRIBUTing.md'
				}]
			}
		});

		forkability('thatoneguy', 'thatonerepo', function (err, report) {
			should(err).eql(null);
			report.files.present.should.containEql('Contributing document').and.lengthOf(1);
			report.files.missing.should.containEql('Readme document');
			report.files.missing.should.containEql('Licence document');
			report.files.missing.should.have.a.lengthOf(2);
			done();
		});
	});

	it('should warn about uncommented issues', function(done) {
		mockResponses({
			firstCommitTreeBody: {
				tree: [{
					path: 'CONTRIBUTing.md'
				}]
			},
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

		forkability('thatoneguy', 'thatonerepo', function (err, report) {
			should(err).eql(null);

			report.files.present.should.containEql('Contributing document').and.lengthOf(1);
			report.files.missing.should.containEql('Readme document');
			report.files.missing.should.containEql('Licence document');
			report.files.missing.should.have.a.lengthOf(2);

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
	
	it('should warn about issues with no comments and no tags', function (done) {
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

		forkability('thatoneguy', 'thatonerepo', function (err, report) {
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