var forkability = require('../..');
var should = require('should');
var mockResponses = require('../helper.mockResponses.js');

describe('forkability with nodejs', function () {
	it('should identify that the repo also has recommended files for nodejs', function(done) {
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
			report.files.present.should.containEql('package.json file');
			report.files.present.should.containEql('No node_modules folder');
			report.files.present.should.have.a.lengthOf(2);
			report.files.missing.should.containEql('Contributing document');
			report.files.missing.should.containEql('Readme document');
			report.files.missing.should.containEql('Licence document');
			report.files.missing.should.containEql('Test suite');
			report.files.missing.should.containEql('Changelog document');
			done();
		});
	});
});