var forkability = require('../..');
var should = require('should');
var mockResponses = require('../helper.mockResponses.js');

describe('forkability with c#', function () {
	it('should return the correct name for the c# language', function() {
		forkability.languages.csharp.name.should.eql('C#');
	});

	it('should identify that the repo also has recommended features for c#', function(done) {
		mockResponses({
			firstCommitTreeBody: {
				tree : [{
					path:'unit tests',
					type: 'tree'
				},{
					path: 'first.csproj'
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
			report.passes.should.containEql({ message : 'No unit test folder' });
			report.failures.should.containEql({ message : 'Contributing document' });
			report.failures.should.containEql({ message : 'Readme document' });
			report.failures.should.containEql({ message : 'Licence document' });
			report.failures.should.containEql({ message : 'Changelog document' });
			done();
		});
	});
});