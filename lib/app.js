(function() {
	var headers = {};
	if (typeof XMLHttpRequest === 'undefined') {
		headers['User-Agent'] = 'Forkability (http://github.com/basicallydan/forkability) (Daniel Hough <daniel.hough@gmail.com>)';
	}
	var request = require('./request');
	// request.debug = true;
	var Q = require('q');
	var get;

	var points = {
		'Contributing document': /contributing.(txt|md)/i,
		'Readme document': /readme.(txt|md)/i,
		'Licence document': /licence.(txt|md)/i,
	};



	function forkability(options, callback) {
		var present = [];
		var missing = [];
		var warnings = [];
		var congrats = [];
		var username = options.user;
		var repo = options.repository;
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
			defaults.headers['Authorization'] = 'Token ' + options.auth.token;
		}

		request = request.defaults(defaults);
		get = Q.denodeify(request.get);

		get('https://api.github.com/repos/' + username + '/' + repo + '/commits')
			.then(function (response, reject) {
				if (response[0] && response[0].statusCode == 403) {
					console.log(response[1]);
					throw new Error({
						message: 'The GitHub API is refusing requests',
						innerError: response[1]
					});
				}
				var data = response[1];
				var sha = data[0].sha;
				var url = 'https://api.github.com/repos/' + username + '/' + repo + '/git/trees/' + sha;
				return get(url);
			})
			.then(function (response) {
				var data = response[1];
				var pointKeys = Object.keys(points);
				pointKeys.forEach(function(p) {
					var found = false;
					var i;
					for (i = data.tree.length - 1; i >= 0; i--) {
						// console.log(data.tree[i])
						if (points[p].test(data.tree[i].path)) {
							found = true;
							break;
						}
					}
					if (found) {
						present.push(p);
					} else {
						missing.push(p);
					}
				});
				return get('https://api.github.com/repos/' + username + '/' + repo + '/issues?state=open');
			})
			.then(function (response) {
				var data = response[1];
				data.forEach(function(issue) {
					if (issue.user.login !== username && issue.comments === 0) {
						warnings.push({
							message: 'Uncommented issue',
							details: {
								title: issue.title,
								url: issue.html_url
							}
						});
					}

					if (issue.user.login !== username && issue.labels.length === 0 && issue.comments === 0) {
						warnings.push({
							message: 'Untouched issue',
							details: {
								title: issue.title,
								url: issue.html_url
							}
						});
					}
				});

				callback(null, {
					files: {
						present: present,
						missing: missing
					},
					warnings: warnings
				});
			})
			.fail(function (err) {
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