var forkability = require('../..');
var should = require('should');
var mockResponses = require('../helper.mockResponses.js');

describe('forkability with nodejs', function () {
	it('should return the correct name for the nodejs language', function() {
		forkability.languages.nodejs.name.should.eql('Node JS');
	});

	it('should identify that the repo also has recommended features for nodejs', function(done) {
		mockResponses({
			firstCommitTreeBody: {
				tree : [{
					path:'package.json'
				}]
			}
		});

		forkability({
			user: 'thatoneguy',
			repository: 'thatonerepo',
			languages: ['nodejs']
		},
		function (err, report) {
			should(err).eql(null);
			report.features.passes.should.containEql({ message : 'package.json file' });
			report.features.passes.should.containEql({ message : 'No node_modules folder' });
			report.features.failures.should.containEql({ message : 'Contributing document' });
			report.features.failures.should.containEql({ message : 'Readme document' });
			report.features.failures.should.containEql({ message : 'Licence document' });
			report.features.failures.should.containEql({ message : 'Test suite' });
			report.features.failures.should.containEql({ message : 'Changelog document' });
			done();
		});
	});
});