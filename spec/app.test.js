var nock = require('nock');
var forkability = require('..');
require('should');

describe('forkability', function() {
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
				}]
			});

		forkability('thatoneguy', 'thatonerepo', function (present, missing) {
			present.should.containEql('Contributing document').and.containEql('Readme document').and.lengthOf(2);
			missing.should.be.empty;
			done();
		});
	});

	it('should identify that the repo has just a contributing doc, but no readme', function(done) {
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
			missing.should.containEql('Readme document').and.lengthOf(1);
			done();
		});
	});
});