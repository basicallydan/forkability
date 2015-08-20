(function() {
	var Q = require('q');
	// Linters for various steps
	var lintIssues = require('./lintIssues');
	var lintFiles = require('./lintFiles');
	var lintIgnore = require('./lintIgnore');
	var lintTags = require('./lintTags');
	var languages = require('./languages');
	var merge = require('merge');

	// Request varies depending on whether browser or Node
	var request = require('./request');

	var headers = {};

	if (typeof XMLHttpRequest === 'undefined') {
		headers['User-Agent'] = 'Forkability (http://github.com/basicallydan/forkability) (Daniel Hough <daniel.hough@gmail.com>)';
	}

	function forkability(options, callback) {
		options = merge({
			languages: [],
			fileDepth: 2
		}, options);
		var passes = [];
		var failures = [];
		var warnings = [];
		var congrats = [];
		var username = options.user;
		var repo = options.repository;
		var firstCommitSha;
		var repoLanguages;
		var get, r;
		var badgeURL = 'https://img.shields.io/badge/forkable-yes-brightgreen.svg';
		var forkabilityURL = 'https://basicallydan.github.io/forkability/?u=' + options.user + '&r=' + options.repository;
		var defaults = {
			json: true,
			headers: headers
		};
		var lintOptions = {};

		for (var i = options.languages.length - 1; i >= 0; i--) {
			if (languages[options.languages[i]]) {
				lintOptions = merge(lintOptions, languages[options.languages[i]]);
			} else {
				console.warn('Sorry, Forkability doesn\'t support the language', options.languages[i] + '. If you\'re keen you can open a pull request at https://github.com/basicallydan/forkability/issues');
			}
		}

		if (options.auth && options.auth.username && options.auth.password) {
			defaults.auth = {
				user: options.auth.username,
				pass: options.auth.password
			};
		}

		if (options.auth && options.auth.token) {
			defaults.headers.Authorization = 'Token ' + options.auth.token;
		}

		r = request.defaults(defaults);
		get = Q.denodeify(r.get);

		get('https://api.github.com/repos/' + username + '/' + repo + '/commits')
			.then(function(response) {
				var err;
				if (response[0] && response[0].statusCode == 401) {
					err = new Error('Invalid GitHub credentials supplied');
					err.errorName = 'invalid-credentials';
					throw err;
				} else if (response[0] && response[0].statusCode == 403) {
					err = new Error('The GitHub API is refusing requests, probably because of lack of authentication. See forkablity --help for more');
					err.errorName = 'request-limit-hit';
					throw err;
				} else if (response[0] && response[0].statusCode == 404) {
					err = new Error('The GitHub Repository ' + username + '/' + repo + ' does not exist');
					err.errorName = 'repo-not-found';
					throw err;
				}
 				var data = response[1];
				firstCommitSha = data[0].sha;
				var url = 'https://api.github.com/repos/' + username + '/' + repo + '/languages';
				return get(url);
			})
			.then(function(response) {
				repoLanguages = Object.keys(response[1] || []);
				lintOptions = merge(lintOptions, {
					containsCode: repoLanguages.length > 0
				});
				var url = 'https://api.github.com/repos/' + username + '/' + repo + '/git/trees/' + firstCommitSha + '?recursive=' + options.fileDepth;
				return get(url);
			})
			.then(function(response) {
				var tree = response[1].tree;
				var report = lintFiles(tree, lintOptions);

				passes = passes.concat(report.passes);
				failures = failures.concat(report.failures);

				if(options.ignore || lintOptions.ignore) {
					var ignoreOptions = merge(options.ignore, lintOptions.ignore);

					report = lintIgnore(tree, ignoreOptions);
					passes = passes.concat(report.passes);
					failures = failures.concat(report.failures);
				}
				return get('https://api.github.com/repos/' + username + '/' + repo + '/issues?state=open');
			})
			.then(function(response) {
				var report = lintIssues(response[1], username);

				passes = passes.concat(report.passes);
				failures = failures.concat(report.failures);

				return get('https://api.github.com/repos/' + username + '/' + repo + '/tags');
			})
			.then(function(response) {
				var report = lintTags(response[1]);

				passes = passes.concat(report.passes);
				failures = failures.concat(report.failures);

				return;
			})
			.then(function() {
				var badges = {
					svg: badgeURL,
					markdown: '[![This is a forkable respository](' + badgeURL + ')](' + forkabilityURL + ')',
					html: '<a href="' + forkabilityURL + '"><img alt="This is a forkable respository" src="' + badgeURL + '"></a>'
				};
				callback(null, {
					passes: passes,
					failures: failures,
					badges: badges
				});
			})
			.fail(function(err) {
				callback(err);
			});
	}

	forkability.languages = languages;

	module.exports = forkability;

	// Export the create function for **Node.js** or other
	// commonjs systems. Otherwise, add it as a global object to the root
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = forkability;
		}
		exports.forkability = forkability;
	}
	if (typeof window !== 'undefined') {
		window.forkability = forkability;
	}
}).call(this);