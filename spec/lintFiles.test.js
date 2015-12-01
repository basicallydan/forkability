var lintFiles = require('../lib/lintFiles');

describe('lintFiles', function () {
	it('should return presence of a readme with a markdown extension', function () {
		var tree = [
			{
				path:'readme.md'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'Readme document' });
	});

	it('should return presence of a readme with a txt extension', function () {
		var tree = [
			{
				path:'readme.txt'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'Readme document' });
	});

	it('should return presence of an upper-case readme with a txt extension', function () {
		var tree = [
			{
				path:'README.txt'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'Readme document' });
	});

	it('should return presence of an upper-case readme with no extension at all', function () {
		var tree = [
			{
				path:'README'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'Readme document' });
	});

	it('should return presence of a licence with a markdown extension', function () {
		var tree = [
			{
				path:'licence.md'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'License document' });
		report.failures.should.not.containEql({ message : 'License document' });
	});

	it('should return presence of a licence with a txt extension', function () {
		var tree = [
			{
				path:'licence.txt'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'License document' });
		report.failures.should.not.containEql({ message : 'License document' });
	});

	it('should return presence of an upper-case licence with a txt extension', function () {
		var tree = [
			{
				path:'LICENCE.txt'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'License document' });
		report.failures.should.not.containEql({ message : 'License document' });
	});

	it('should return presence of an upper-case licence with no extension at all', function () {
		var tree = [
			{
				path:'LICENCE'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'License document' });
		report.failures.should.not.containEql({ message : 'License document' });
	});

	it('should return presence of licence where the spelling is in the UK verb form, "License"', function () {
		var tree = [
			{
				path:'LICENSE'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'License document' });
		report.failures.should.not.containEql({ message : 'License document' });
	});

	it('should return presence of licence when COPYING file exists', function () {
		var tree = [
			{
				path:'COPYING'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'License document' });
		report.failures.should.not.containEql({ message : 'License document' });
	});

	it('should return presence of a contributing with a markdown extension', function () {
		var tree = [
			{
				path:'contributing.md'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'Contributing document' });
		report.failures.should.not.containEql({ message : 'Contributing document' });
	});

	it('should return presence of a contributing with a txt extension', function () {
		var tree = [
			{
				path:'contributing.txt'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'Contributing document' });
	});

	it('should return presence of an upper-case contributing with a txt extension', function () {
		var tree = [
			{
				path:'CONTRIBUTING.txt'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'Contributing document' });
	});

	it('should return presence of an upper-case contributing with no extension at all', function () {
		var tree = [
			{
				path:'CONTRIBUTING'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'Contributing document' });
	});

	it('should not return presence of features which merely contain the words contributing, readme or licence', function () {
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

		report.passes.should.not.containEql({ message : 'Contributing document' });
		report.passes.should.not.containEql({ message : 'Readme document' });
		report.passes.should.not.containEql({ message : 'License document' });
	});

	it('should return presence of test suite if the repo has any code in it and a spec folder', function () {
		var tree = [
			{
				path:'spec',
				type:'tree'
			}
		];

		var report = lintFiles(tree, {
			containsCode: true
		});

		report.passes.should.containEql({ message : 'Test suite' });
	});

	it('should disregard presence of a test suite if the repo has no code in it and no spec folder', function () {
		var tree = [
			{
				path:'contributing.md',
				type:'blob'
			}
		];

		var report = lintFiles(tree, {
			containsCode: false
		});

		report.passes.should.containEql({ message : 'Contributing document' });
		report.passes.should.not.containEql({ message : 'Test suite' });
		report.failures.should.not.containEql({ message : 'Test suite' });
	});

	it('should return presence of a changelog called changes with a markdown extension', function () {
		var tree = [
			{
				path:'changes.md'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'Changelog document' });
		report.failures.should.not.containEql({ message : 'Changelog document' });
	});

	it('should return presence of a changelog called changelog with a markdown extension', function () {
		var tree = [
			{
				path:'changelog.md'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'Changelog document' });
	});

	it('should return presence of a changelog called history with a markdown extension', function () {
		var tree = [
			{
				path:'history.md'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'Changelog document' });
	});

	it('should return presence of a changelog called changelog with no extension', function () {
		var tree = [
			{
				path:'changelog'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : 'Changelog document' });
		report.failures.should.not.containEql({ message : 'Changelog document' });
	});

	it('should return presence of a .gitignore file called .gitignore', function () {
		var tree = [
			{
				path:'.gitignore'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.containEql({ message : '.gitignore file' });
	});

	it('should disregard presence  of a .gitignore file called .GITIGNORE in all caps', function () {
		var tree = [
			{
				path:'.GITIGNORE'
			}
		];

		var report = lintFiles(tree);

		report.passes.should.not.containEql({ message : '.gitignore file' });
		report.failures.should.containEql({ message : '.gitignore file' });
	});

	it('should return presence of a feature specified in options', function () {
		var tree = [
			{
				path:'package.json'
			}
		];

		var report = lintFiles(tree, {
			files: {
				'package.json file':/^package\.json/i
			}
		});

		report.passes.should.containEql({ message : 'package.json file' });
		report.failures.should.not.containEql({ message : 'package.json file' });
	});

	it('should return presence of a feature specified in options to not exist', function () {
		var tree = [];

		var report = lintFiles(tree, {
			files: {
				'No node_modules folder':{
					path:/^node_modules/i,
					type:'tree',
					shouldExist:false
				}
			}
		});

		report.passes.should.containEql({ message : 'No node_modules folder' });
		report.failures.should.not.containEql({ message : 'No node_modules folder' });
	});

	it('should return failure of a feature specified in options to not exist', function () {
		var tree = [
			{
				path:'node_modules',
				type:'tree'
			}
		];

		var report = lintFiles(tree, {
			files: {
				'No node_modules folder':{
					path:/^node_modules/i,
					type:'tree',
					shouldExist:false
				}
			}
		});

		report.passes.should.not.containEql({ message : 'No node_modules folder' });
		report.failures.should.containEql({ message : 'No node_modules folder' });
	});

	it('should return allow two features of the same name but different type where one is allowed but not another', function () {
		var tree = [
			{
				path:'node_modules',
				type:'tree'
			},
			{
				path:'node_modules',
				type:'blob'
			}
		];

		var report = lintFiles(tree, {
			files: {
				'No node_modules folder':{
					path:/^node_modules/i,
					type:'tree',
					shouldExist:false
				},
				'A node_modules file':{
					path:/^node_modules/i,
					type:'blob',
					shouldExist:true
				}
			}
		});
		report.passes.should.not.containEql({ message : 'No node_modules folder' });
		report.failures.should.containEql({ message : 'No node_modules folder' });
		
		report.passes.should.containEql({ message : 'A node_modules file' });
		report.failures.should.not.containEql({ message : 'A node_modules file' });
	});
});