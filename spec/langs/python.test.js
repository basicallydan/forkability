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
			report.features.passes.should.containEql('setup.py file');
			report.features.passes.should.containEql('requirements.txt file');
			report.features.passes.should.containEql('Documentation');
			report.features.passes.should.containEql('Test suite');
			report.features.passes.should.have.a.lengthOf(4);
			report.features.failures.should.containEql('Contributing document');
			report.features.failures.should.containEql('Readme document');
			report.features.failures.should.containEql('Licence document');
			report.features.failures.should.containEql('Changelog document');
			done();
		});
	});
});