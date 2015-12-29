var getTagArray = require('../lib/getTagArray');
var should = require('should');
var path = require('path');

describe('getTagArray', function() {
	it('should get all the tags in a local git repository folder', function() {
		var tags = getTagArray(path.resolve('./spec/localGitRepo'));
		var expectedTags = [
			'v0.14.1',
			'v0.14.2',
			'v0.15.0',
			'v0.15.1',
			'v0.16.0',
			'v0.16.1',
			'v0.17.0'
		];
		tags.should.be.Array;
		tags.length.should.equal(expectedTags.length);
		tags.forEach(function (tag, index) {
			tag.should.equal(expectedTags[index]);
		});
	});

	// it('should report no git repository at all if there is no repo in a local git repository folder', function () {
	// 	var tags = 
	// 	should.throw(getTagArray(path.resolve('./spec/notLocalGitRepo')));
	// });
});