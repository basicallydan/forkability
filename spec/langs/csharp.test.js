var forkability = require('../..');
var should = require('should');
var mockResponses = require('../helper.mockResponses.js');

describe('forkability with c#', function () {
	it('should return the correct name for the c# language', function() {
		forkability.languages.csharp.name.should.eql('C#');
	});

	describe('.csproj file', function() {

		it('should return the presence of a .csproj file with a name from lowercase letters (no numbers)', function(done){
			mockResponses({
				firstCommitTreeBody: {
					tree : [{
						path: 'first.csproj'
					},{
						path:'source/Unit Tests',
						type: 'tree'
					}]
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				languages: ['csharp']
			},
			function (err, report) {		
				should(err).eql(null);
				report.passes.should.containEql({ message : 'Test suite' });
				report.passes.should.containEql({ message : 'Project file' });
				report.failures.should.containEql({ message : 'Contributing document' });
				report.failures.should.containEql({ message : 'Readme document' });
				report.failures.should.containEql({ message : 'Licence document' });
				report.failures.should.containEql({ message : 'Changelog document' });
				done();
			});
		});

		it('should return the presence of a .csproj file with a name from lowercase letters and numbers', function(done){
			mockResponses({
				firstCommitTreeBody: {
					tree : [
					{
						path: 'source',
						type: 'tree'
					},
					{
						path: 'source/main',
						type: 'tree'
					},
					{
						path: 'source/main/first1.csproj'
					},{
						path:'source/Unit Tests',
						type: 'tree'
					}]
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				languages: ['csharp']
			},
			function (err, report) {	
				should(err).eql(null);
				report.passes.should.containEql({ message : 'Test suite' });
				report.passes.should.containEql({ message : 'Project file' });
				report.failures.should.containEql({ message : 'Contributing document' });
				report.failures.should.containEql({ message : 'Readme document' });
				report.failures.should.containEql({ message : 'Licence document' });
				report.failures.should.containEql({ message : 'Changelog document' });
				done();
			});
		});

		it('should return the presence of a .csproj file with a name from uppercase letters (no numbers)', function(done){
			mockResponses({
				firstCommitTreeBody: {
					tree : [{
						path: 'FIRST.csproj'
					},{
						path:'source/Unit Tests',
						type: 'tree'
					}]
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				languages: ['csharp']
			},
			function (err, report) {		
				should(err).eql(null);
				report.passes.should.containEql({ message : 'Test suite' });
				report.passes.should.containEql({ message : 'Project file' });
				report.failures.should.containEql({ message : 'Contributing document' });
				report.failures.should.containEql({ message : 'Readme document' });
				report.failures.should.containEql({ message : 'Licence document' });
				report.failures.should.containEql({ message : 'Changelog document' });
				done();
			});
		});

		it('should return the presence of a .csproj file with a name from uppercase letters and numbers', function(done){
			mockResponses({
				firstCommitTreeBody: {
					tree : [{
						path: 'F1RST.csproj'
					},{
						path:'source/Unit Tests',
						type: 'tree'
					}]
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				languages: ['csharp']
			},
			function (err, report) {		
				should(err).eql(null);
				report.passes.should.containEql({ message : 'Test suite' });
				report.passes.should.containEql({ message : 'Project file' });
				report.failures.should.containEql({ message : 'Contributing document' });
				report.failures.should.containEql({ message : 'Readme document' });
				report.failures.should.containEql({ message : 'Licence document' });
				report.failures.should.containEql({ message : 'Changelog document' });
				done();
			});
		});

		it('should return the presence of a .csproj file with a name from numbers', function(done){
			mockResponses({
				firstCommitTreeBody: {
					tree : [{
						path: '1234.csproj'
					},{
						path:'source/Unit Tests',
						type: 'tree'
					}]
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				languages: ['csharp']
			},
			function (err, report) {		
				should(err).eql(null);
				report.passes.should.containEql({ message : 'Test suite' });
				report.passes.should.containEql({ message : 'Project file' });
				report.failures.should.containEql({ message : 'Contributing document' });
				report.failures.should.containEql({ message : 'Readme document' });
				report.failures.should.containEql({ message : 'Licence document' });
				report.failures.should.containEql({ message : 'Changelog document' });
				done();
			});
		});

		it('should indicate the lack of a .csproj file', function(done){
			mockResponses({
				firstCommitTreeBody: {
					tree : [{
						path:'source/Unit Tests',
						type: 'tree'
					}]
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				languages: ['csharp']
			},
			function (err, report) {		
				should(err).eql(null);
				report.passes.should.containEql({ message : 'Test suite' });
				report.failures.should.containEql({ message : 'Project file' });
				report.failures.should.containEql({ message : 'Contributing document' });
				report.failures.should.containEql({ message : 'Readme document' });
				report.failures.should.containEql({ message : 'Licence document' });
				report.failures.should.containEql({ message : 'Changelog document' });
				done();
			});
		});
	});
});