var forkability = require('..');
var should = require('should');
var mockResponses = require('./helper.mockResponses.js');
var nock = require('nock');

describe('files at depth of two', function() {

	it('should return the presence of a requirement that is filled only at the second level', function(done){
		mockResponses({
				firstCommitTreeBody: {
					tree:[{
						path: 'source',
						type: 'tree'
					}, {
						path: 'source/main',
						type: 'tree',
						sha: 'secondSha',
						url: 'https://api.github.com/repos/thatoneguy/thatonerepo/git/trees/secondSha'
					}]
				}
			});

			nock('https://api.github.com')
			.get('/repos/thatoneguy/thatonerepo/git/trees/secondSha')
			.reply(200, {
				tree: [{
					path: 'source/main/tests',
					type: 'tree'
				}]
			});
			
			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo'
			},
			function(err, report){
				should(err).eql(null);
				report.passes.should.containEql({ message : 'Test suite' });
				report.failures.should.containEql({ message : 'Contributing document' });
				report.failures.should.containEql({ message : 'Readme document' });
				report.failures.should.containEql({ message : 'Licence document' });
				report.failures.should.containEql({ message : 'Changelog document' });
				done();
			});
	});

});