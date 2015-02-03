var forkability = require('..');
var should = require('should');
var mockResponses = require('./helper.mockResponses.js');
var nock = require('nock');

describe('files at a depth', function() {

	describe('default depth', function() {

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
					}, {
						path: 'readme'
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
				report.passes.should.containEql({ message : 'Readme document' });
				report.failures.should.containEql({ message : 'Contributing document' });
				report.failures.should.containEql({ message : 'Licence document' });
				report.failures.should.containEql({ message : 'Changelog document' });
				done();
			});
		});

		it('should return the presence of a requirement that is filled only at the third level', function(done){
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
					path: 'source/main/second',
					type: 'tree',
					sha: 'thirdSha',
					url: 'https://api.github.com/repos/thatoneguy/thatonerepo/git/trees/thirdSha'
				}]
			});

			nock('https://api.github.com')
			.get('/repos/thatoneguy/thatonerepo/git/trees/thirdSha')
			.reply(200, {
				tree: [{
					path: 'source/main/second/tests',
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

		it('should return the absence of a requirement that is filled after the third level', function(done){
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
					path: 'source/main/second',
					type: 'tree',
					sha: 'thirdSha',
					url: 'https://api.github.com/repos/thatoneguy/thatonerepo/git/trees/thirdSha'
				}]
			});

			nock('https://api.github.com')
			.get('/repos/thatoneguy/thatonerepo/git/trees/thirdSha')
			.reply(200, {
				tree: [{
					path: 'source/main/second/third/',
					type: 'tree',
					sha: 'fourthSha',
					url: 'https://api.github.com/repos/thatoneguy/thatonerepo/git/trees/fourthSha'
				}]
			});

			nock('https://api.github.com')
			.get('/repos/thatoneguy/thatonerepo/git/trees/fourthSha')
			.reply(200, {
				tree: [{
					path: 'source/main/second/third/tests',
					type: 'tree'
				}]
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo'
			},
			function(err, report){
				should(err).eql(null);
				report.failures.should.containEql({ message : 'Test suite' });
				report.failures.should.containEql({ message : 'Contributing document' });
				report.failures.should.containEql({ message : 'Readme document' });
				report.failures.should.containEql({ message : 'Licence document' });
				report.failures.should.containEql({ message : 'Changelog document' });
				done();
			});
		});
	});

	describe('custom depth', function(){

		it('should return the presence of a requirement that is filled after at the default depth', function(done){
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
					path: 'source/main/second',
					type: 'tree',
					sha: 'thirdSha',
					url: 'https://api.github.com/repos/thatoneguy/thatonerepo/git/trees/thirdSha'
				}]
			});

			nock('https://api.github.com')
			.get('/repos/thatoneguy/thatonerepo/git/trees/thirdSha')
			.reply(200, {
				tree: [{
					path: 'source/main/second/third/',
					type: 'tree',
					sha: 'fourthSha',
					url: 'https://api.github.com/repos/thatoneguy/thatonerepo/git/trees/fourthSha'
				}]
			});

			nock('https://api.github.com')
			.get('/repos/thatoneguy/thatonerepo/git/trees/fourthSha')
			.reply(200, {
				tree: [{
					path: 'source/main/second/third/tests',
					type: 'tree'
				}]
			});

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

		it('should return the absence of a requirement that is filled after the specified depth', function(done){
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
					path: 'source/main/second',
					type: 'tree',
					sha: 'thirdSha',
					url: 'https://api.github.com/repos/thatoneguy/thatonerepo/git/trees/thirdSha'
				}]
			});

			nock('https://api.github.com')
			.get('/repos/thatoneguy/thatonerepo/git/trees/thirdSha')
			.reply(200, {
				tree: [{
					path: 'source/main/second/tests',
					type: 'tree'
				}]
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				fileDepth: 2
			},
			function(err, report){
				should(err).eql(null);
				report.failures.should.containEql({ message : 'Test suite' });
				report.failures.should.containEql({ message : 'Contributing document' });
				report.failures.should.containEql({ message : 'Readme document' });
				report.failures.should.containEql({ message : 'Licence document' });
				report.failures.should.containEql({ message : 'Changelog document' });
				done();
			});
		});
	});
});