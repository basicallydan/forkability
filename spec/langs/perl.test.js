var forkability = require('../..');
var should = require('should');
var mockResponses = require('../helper.mockResponses.js');

xdescribe('forkability with perl', function () {
	it('should return the correct name for the Perl language', function() {
		forkability.languages.perl.name.should.eql('Perl');
	});

	it('should identify that the repo also has recommended features for Perl', function(done) {
		mockResponses({
			firstCommitTreeBody: {
				tree : [{
					path:'Makefile.PL'
				}]
			}
		});

		forkability({
			user: 'thatoneguy',
			repository: 'thatonerepo',
			languages: ['perl']
		},
		function (err, report) {
			should(err).eql(null);
			report.passes.should.containEql({ message : 'Build/requirements file' });
			report.failures.should.containEql({ message : 'Test suite' });
			done();
		});
	});
});
