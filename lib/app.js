(function() {
	var headers = {};
	if (typeof XMLHttpRequest === 'undefined') {
		headers['User-Agent'] = 'Forkability';
	}
	var request = require('./request').defaults({
		json: true,
		headers: headers
	});
	var Q = require('q');
	var get = Q.denodeify(request.get);

	var points = {
		'Contributing document': /contributing.(txt|md)/i,
		'Readme document': /readme.(txt|md)/i,
		'Licence document': /licence.(txt|md)/i,
	};



	function forkability(username, repo, callback) {
		var present = [];
		var missing = [];
		var warnings = [];
		var congrats = [];

		get('https://api.github.com/repos/' + username + '/' + repo + '/commits')
			.then(function (response) {
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
								url: issue.html_url,
								title: issue.title
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