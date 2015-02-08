var forkability = require('..');
var should = require('should');
var mockResponses = require('./helper.mockResponses.js');

describe('files at a depth', function() {

	describe('custom depth', function(){

		it('should return the presence of a requirement that is filled after the default depth -but within the range of the custom depth', function(done){
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
					}, {
						path: 'source/main/second',
						type: 'tree',
						sha: 'thirdSha',
						url: 'https://api.github.com/repos/thatoneguy/thatonerepo/git/trees/thirdSha'
					}, {
						path: 'source/main/second/third/',
						type: 'tree',
						sha: 'fourthSha',
						url: 'https://api.github.com/repos/thatoneguy/thatonerepo/git/trees/fourthSha'
					}, {
						path: 'source/main/second/third/tests',
						type: 'tree'
					}]
				}
			}, 4);

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				fileDepth: 4
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
});