var nock = require('nock');
var forkability = require('..');
require('should');

describe('forkability', function() {
	beforeEach(function () {
		nock.cleanAll();
	});

	it('should identify that the repo has both contributing and readme docs', function(done) {
		nock('https://api.github.com')
			.get('/repos/thatoneguy/thatonerepo/commits')
			.reply(200, [{
				sha: 'fakeshalol'
			}]);

		nock('https://api.github.com')
			.get('/repos/thatoneguy/thatonerepo/git/trees/fakeshalol')
			.reply(200, {
				tree: [{
					path: 'contributing.md'
				}, {
					path: 'readme.md'
				}, {
					path: 'licence.md'
				}]
			});

		forkability('thatoneguy', 'thatonerepo', function (present, missing) {
			present.should.containEql('Contributing document');
			present.should.containEql('Readme document');
			present.should.containEql('Licence document');
			present.should.have.a.lengthOf(3);
			missing.should.be.empty;
			done();
		});
	});

	it('should identify that the repo has just a contributing doc, but nothing else', function(done) {
		nock('https://api.github.com')
			.get('/repos/thatoneguy/thatonerepo/commits')
			.reply(200, [{
				sha: 'fakeshalol'
			}]);

		nock('https://api.github.com')
			.get('/repos/thatoneguy/thatonerepo/git/trees/fakeshalol')
			.reply(200, {
				tree: [{
					path: 'contributing.md'
				}]
			});

		forkability('thatoneguy', 'thatonerepo', function (present, missing) {
			present.should.containEql('Contributing document').and.lengthOf(1);
			missing.should.containEql('Readme document');
			missing.should.containEql('Licence document');
			missing.should.have.a.lengthOf(2);
			done();
		});
	});

	it('should be case insensitive about the presence of files', function(done) {
		nock('https://api.github.com')
			.get('/repos/thatoneguy/thatonerepo/commits')
			.reply(200, [{
				sha: 'fakeshalol'
			}]);

		nock('https://api.github.com')
			.get('/repos/thatoneguy/thatonerepo/git/trees/fakeshalol')
			.reply(200, {
				tree: [{
					path: 'CONTRIBUTing.md'
				}]
			});

		forkability('thatoneguy', 'thatonerepo', function (present, missing) {
			present.should.containEql('Contributing document').and.lengthOf(1);
			missing.should.containEql('Readme document');
			missing.should.containEql('Licence document');
			missing.should.have.a.lengthOf(2);
			done();
		});
	});
});