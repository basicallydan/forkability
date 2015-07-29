var forkability = require('..');
var should = require('should');
var mockResponses = require('./helper.mockResponses.js');

describe('linting for file from .gitignore', function () {

	describe('no files specified', function () {

		it('should not lint if no options.ignore is specified', function (done) {
			mockResponses({
				firstCommitTreeBody: {
					tree: [{
						path: 'first.csproj'
					}, {
							path: 'source/Unit Tests',
							type: 'tree'
						}]
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo'
			},
				function (err, report) {
					should(err).eql(null);
					report.passes.should.containEql({ message: 'Test suite' });
					report.failures.should.containEql({ message: 'Contributing document' });
					report.failures.should.containEql({ message: 'Readme document' });
					report.failures.should.containEql({ message: 'Licence document' });
					report.failures.should.containEql({ message: 'Changelog document' });
					done();
				});
		});

		it('should not lint if options.ignore contains no files', function (done) {
			mockResponses({
				firstCommitTreeBody: {
					tree: [{
						path: 'first.csproj'
					}, {
							path: 'source/Unit Tests',
							type: 'tree'
						}]
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				ignore: {}
			},
				function (err, report) {
					should(err).eql(null);
					report.passes.should.containEql({ message: 'Test suite' });
					report.failures.should.containEql({ message: 'Contributing document' });
					report.failures.should.containEql({ message: 'Readme document' });
					report.failures.should.containEql({ message: 'Licence document' });
					report.failures.should.containEql({ message: 'Changelog document' });
					done();
				});
		});
	});
	describe('specified files exist', function () {
		it('should fail if directories specified in the ignore object are in the repository', function (done) {
			mockResponses({
				firstCommitTreeBody: {
					tree: [{
						path: 'first.csproj'
					}, {
							path: 'source/Unit Tests',
							type: 'tree'
						}, {
							path: 'debug',
							type: 'tree'
						}]
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				ignore: {
					'No debug folder': {
						path: /^debug/i,
						shouldExist: false,
						type: 'tree'
					}
				}
			},
				function (err, report) {
					should(err).eql(null);
					report.passes.should.containEql({ message: 'Test suite' });
					report.failures.should.containEql({ message: 'Contributing document' });
					report.failures.should.containEql({ message: 'No debug folder' });
					report.failures.should.containEql({ message: 'Readme document' });
					report.failures.should.containEql({ message: 'Licence document' });
					report.failures.should.containEql({ message: 'Changelog document' });
					done();
				});
		});

		it('should fail if files specified in the ignore object are in the repository', function (done) {
			mockResponses({
				firstCommitTreeBody: {
					tree: [{
						path: 'first.csproj'
					}, {
							path: 'source/Unit Tests',
							type: 'tree'
						}, {
							path: 'randomExtension.rnd'
						}]
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				ignore: {
					'randomExtension': /^.+\.rnd/i
				}
			},
				function (err, report) {
					should(err).eql(null);
					report.passes.should.containEql({ message: 'Test suite' });
					report.failures.should.containEql({ message: 'Contributing document' });
					report.failures.should.containEql({ message: 'randomExtension' });
					report.failures.should.containEql({ message: 'Readme document' });
					report.failures.should.containEql({ message: 'Licence document' });
					report.failures.should.containEql({ message: 'Changelog document' });
					done();
				});
		});
	});
	describe('specified files do not exist', function () {

		it('should pass if all the files specified in the ignore object are not in the repository', function (done) {
			mockResponses({
				firstCommitTreeBody: {
					tree: [{
						path: 'first.csproj'
					}, {
							path: 'source/Unit Tests',
							type: 'tree'
						}]
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				ignore: {
					'randomExtension': /^.+\.rnd/i
				}
			},
				function (err, report) {
					should(err).eql(null);
					report.passes.should.containEql({ message: 'Test suite' });
					report.passes.should.containEql({ message: 'randomExtension' });
					report.failures.should.containEql({ message: 'Contributing document' });
					report.failures.should.containEql({ message: 'Readme document' });
					report.failures.should.containEql({ message: 'Licence document' });
					report.failures.should.containEql({ message: 'Changelog document' });
					done();
				});
		});

		it('should pass with an empty tree and a simple value for ignore', function (done) {
			mockResponses({
				firstCommitTreeBody: {
					tree: []
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				ignore: {
					'No debug folder': {
						path: /^debug/i,
						shouldExist: false,
						type: 'tree'
					}
				}
			},
				function (err, report) {
					should(err).eql(null);
					report.passes.should.containEql({ message: 'No debug folder' });
					report.failures.should.containEql({ message: 'Contributing document' });
					report.failures.should.containEql({ message: 'Readme document' });
					report.failures.should.containEql({ message: 'Licence document' });
					report.failures.should.containEql({ message: 'Changelog document' });
					done();
				});
		});

		it('should pass with an empty tree and a value for ignore that includes a shouldExist key', function (done) {
			mockResponses({
				firstCommitTreeBody: {
					tree: []
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				ignore: {
					'randomExtension': /^.+\.rnd/i,
					shouldExist: false
				}
			},
				function (err, report) {
					should(err).eql(null);
					report.passes.should.containEql({ message: 'randomExtension' });
					report.failures.should.containEql({ message: 'Contributing document' });
					report.failures.should.containEql({ message: 'Readme document' });
					report.failures.should.containEql({ message: 'Licence document' });
					report.failures.should.containEql({ message: 'Changelog document' });
					done();
				});
		});
	});
	describe('language specific ignore linting', function(){
		
		it('should lint also based on per language ignore options with no options passed in', function (done) {
			var csharp = require('../lib/langs/csharp');
			csharp.ignore = {
				'randomExtension': /^.+\.rnd/i
			};

			mockResponses({
				firstCommitTreeBody: {
					tree: [{
						path: 'first.csproj'
					}, {
							path: 'source/Unit Tests',
							type: 'tree'
						}, {
							path: 'randomExtension.rnd'
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
					report.passes.should.containEql({ message: 'Test suite' });
					report.failures.should.containEql({ message: 'randomExtension' });
					report.failures.should.containEql({ message: 'Contributing document' });
					report.failures.should.containEql({ message: 'Readme document' });
					report.failures.should.containEql({ message: 'Licence document' });
					report.failures.should.containEql({ message: 'Changelog document' });
					delete csharp.ignore;
					done();
				});
		});

		it('should lint also based on per language ignore options with options passed in', function (done) {
			var csharp = require('../lib/langs/csharp');
			csharp.ignore = {
				'randomExtension': /^.+\.rnd/i
			};

			mockResponses({
				firstCommitTreeBody: {
					tree: [{
						path: 'first.csproj'
					}, {
							path: 'source/Unit Tests',
							type: 'tree'
						}, {
							path: 'randomExtension.rnd'
						}, {
							path: 'debug',
							type: 'tree'
						}]
				}
			});

			forkability({
				user: 'thatoneguy',
				repository: 'thatonerepo',
				languages: ['csharp'],
				ignore: {
					'No debug folder': {
						path: /^debug/i,
						shouldExist: false,
						type: 'tree'
					}
				}
			},
				function (err, report) {
					should(err).eql(null);
					report.passes.should.containEql({ message: 'Test suite' });
					report.failures.should.containEql({ message: 'randomExtension' });
					report.failures.should.containEql({ message: 'No debug folder' });
					report.failures.should.containEql({ message: 'Contributing document' });
					report.failures.should.containEql({ message: 'Readme document' });
					report.failures.should.containEql({ message: 'Licence document' });
					report.failures.should.containEql({ message: 'Changelog document' });
					done();
				});
		});
	});
});