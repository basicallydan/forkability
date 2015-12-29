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

	it('should return an empty array if there are no tags', function() {
		var tags = getTagArray(path.resolve('./spec/noTagsLocalGitRepo'));
		tags.should.be.Array;
		tags.length.should.equal(0);
	});

	it('should report no git repository at all if there is no repo in a local git repository folder', function () {
		should(function () {
			getTagArray(path.resolve('./spec/notLocalGitRepo'));
		}).throw('You have specified a directory which is not a git repository');
	});

	it('should report no git repository at all if there is no repo in a local git repository folder', function () {
		should(function () {
			getTagArray(path.resolve('./spec/brokenLocalGitRepo'));
		}).throw('You have specified a directory with an invalid git repository which is missing the refs folder');
	});
});