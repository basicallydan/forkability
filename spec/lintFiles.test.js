var lintFiles = require('../lib/lintFiles');

describe('lintFiles', function () {
	it('should return presence of a readme with a markdown extension', function () {
		var tree = [
			{
				path:'readme.md'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Readme document');
	});

	it('should return presence of a readme with a txt extension', function () {
		var tree = [
			{
				path:'readme.txt'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Readme document');
	});

	it('should return presence of an upper-case readme with a txt extension', function () {
		var tree = [
			{
				path:'README.txt'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Readme document');
	});

	it('should return presence of an upper-case readme with no extension at all', function () {
		var tree = [
			{
				path:'README'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Readme document');
	});

	it('should return presence of a licence with a markdown extension', function () {
		var tree = [
			{
				path:'licence.md'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Licence document');
		report.missing.should.not.containEql('Licence document');
	});

	it('should return presence of a licence with a txt extension', function () {
		var tree = [
			{
				path:'licence.txt'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Licence document');
		report.missing.should.not.containEql('Licence document');
	});

	it('should return presence of an upper-case licence with a txt extension', function () {
		var tree = [
			{
				path:'LICENCE.txt'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Licence document');
		report.missing.should.not.containEql('Licence document');
	});

	it('should return presence of an upper-case licence with no extension at all', function () {
		var tree = [
			{
				path:'LICENCE'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Licence document');
		report.missing.should.not.containEql('Licence document');
	});

	it('should return presence of licence where the spelling is in the UK verb form, "License"', function () {
		var tree = [
			{
				path:'LICENSE'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Licence document');
		report.missing.should.not.containEql('Licence document');
	});

	it('should return presence of a contributing with a markdown extension', function () {
		var tree = [
			{
				path:'contributing.md'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Contributing document');
		report.missing.should.not.containEql('Contributing document');
	});

	it('should return presence of a contributing with a txt extension', function () {
		var tree = [
			{
				path:'contributing.txt'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Contributing document');
	});

	it('should return presence of an upper-case contributing with a txt extension', function () {
		var tree = [
			{
				path:'CONTRIBUTING.txt'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Contributing document');
	});

	it('should return presence of an upper-case contributing with no extension at all', function () {
		var tree = [
			{
				path:'CONTRIBUTING'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Contributing document');
	});

	it('should not return presence of files which merely contain the words contributing, readme or licence', function () {
		var tree = [
			{
				path:'guide to contributing'
			},
			{
				path:'this is a readme'
			},
			{
				path:'our licence'
			}
		];

		var report = lintFiles(tree);

		report.present.should.not.containEql('Contributing document');
		report.present.should.not.containEql('Readme document');
		report.present.should.not.containEql('Licence document');
	});

	it('should return presence of test suite if the repo has any code in it and a spec folder', function () {
		var tree = [
			{
				path:'spec',
				type:'tree'
			}
		];

		var report = lintFiles(tree, ['JavaScript']);

		report.present.should.containEql('Test suite');
	});

	it('should disregard presence of a test suite if the repo has no code in it and no spec folder', function () {
		var tree = [
			{
				path:'contributing.md',
				type:'blob'
			}
		];

		var report = lintFiles(tree, []);

		report.present.should.containEql('Contributing document');
		report.present.should.not.containEql('Test suite');
		report.missing.should.not.containEql('Test suite');
	});

	it('should return presence of a changelog called changes with a markdown extension', function () {
		var tree = [
			{
				path:'changes.md'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Changelog document');
		report.missing.should.not.containEql('Changelog document');
	});

	it('should return presence of a changelog called changelog with a markdown extension', function () {
		var tree = [
			{
				path:'changelog.md'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Changelog document');
	});

	it('should return presence of a changelog called changelog with no extension', function () {
		var tree = [
			{
				path:'changelog'
			}
		];

		var report = lintFiles(tree);

		report.present.should.containEql('Changelog document');
		report.missing.should.not.containEql('Changelog document');
	});
});