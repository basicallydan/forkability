var forkability = require('../..');
var should = require('should');
var mockResponses = require('../helper.mockResponses.js');

describe('forkability with python', function () {
	it('should return the correct name for the python language', function() {
		forkability.languages.python.name.should.eql('Python');
	});

	it('should identify that the repo also has recommended features for python', function(done) {
		mockResponses({
			firstCommitTreeBody: {
				tree : [{
					path:'setup.py'
				},{
					path:'requirements.txt'
				},{
					path:'docs',
					type:'tree'
				},{
					path:'tests',
					type:'tree'
				}]
			}
		});

		forkability({
			user: 'thatoneguy',
			repository: 'thatonerepo',
			languages: ['python']
		},
		function (err, report) {
			should(err).eql(null);
			report.features.passes.should.containEql({ message : 'setup.py file' });
			report.features.passes.should.containEql({ message : 'requirements.txt file' });
			report.features.passes.should.containEql({ message : 'Documentation' });
			report.features.passes.should.containEql({ message : 'Test suite' });
			report.features.failures.should.containEql({ message : 'Contributing document' });
			report.features.failures.should.containEql({ message : 'Readme document' });
			report.features.failures.should.containEql({ message : 'Licence document' });
			report.features.failures.should.containEql({ message : 'Changelog document' });
			done();
		});
	});
});