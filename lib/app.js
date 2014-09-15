(function() {
	var Q = require('q');
	// Linters for various steps
	var lintIssues = require('./lintIssues');
	var lintFiles = require('./lintFiles');

	// Request varies depending on whether browser or Node
	var request = require('./request');

	var headers = {};

	if (typeof XMLHttpRequest === 'undefined') {
		headers['User-Agent'] = 'Forkability (http://github.com/basicallydan/forkability) (Daniel Hough <daniel.hough@gmail.com>)';
	}

	function forkability(options, callback) {
		var present = [];
		var missing = [];
		var warnings = [];
		var congrats = [];
		var username = options.user;
		var repo = options.repository;
		var firstCommitSha;
		var repoLanguages;
		var get;
		var defaults = {
			json: true,
			headers: headers
		};

		if (options.auth && options.auth.username && options.auth.password) {
			defaults.auth = {
				user: options.auth.username,
				pass: options.auth.password
			};
		}

		if (options.auth && options.auth.token) {
			defaults.headers.Authorization = 'Token ' + options.auth.token;
		}

		request = request.defaults(defaults);
		get = Q.denodeify(request.get);

		get('https://api.github.com/repos/' + username + '/' + repo + '/commits')
			.then(function(response) {
				if (response[0] && response[0].statusCode == 403) {
					console.log(response[1]);
					throw new Error({
						message: 'The GitHub API is refusing requests',
						innerError: response[1]
					});
				}
				var data = response[1];
				firstCommitSha = data[0].sha;
				var url = 'https://api.github.com/repos/' + username + '/' + repo + '/languages';
				return get(url);
			})
			.then(function(response) {
				repoLanguages = response[1];
				var url = 'https://api.github.com/repos/' + username + '/' + repo + '/git/trees/' + firstCommitSha;
				return get(url);
			})
			.then(function(response) {
				var tree = response[1].tree;
				var result = lintFiles(tree);

				present = present.concat(result.present);
				missing = missing.concat(result.missing);

				return get('https://api.github.com/repos/' + username + '/' + repo + '/issues?state=open');
			})
			.then(function(response) {
				var issueWarnings = lintIssues(response[1], username);

				warnings = warnings.concat(issueWarnings);

				return;
			})
			.then(function () {
				callback(null, {
					files: {
						present: present,
						missing: missing
					},
					warnings: warnings
				});
			})
			.fail(function(err) {
				console.log(err);
				callback(err);
			});
	}

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