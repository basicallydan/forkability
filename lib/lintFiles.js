var merge = require('merge');

module.exports = function(tree, options) {
	var passes = [];
	var failures = [];
	options = merge({ containsCode : false, files : {} }, options);
	var resolveRelevance = function (feature) {
		return (!feature.relevant || feature.relevant === true || feature.relevant());
	};
	var files = {
		'Contributing document': /^contributing/i,
		'Readme document': /^readme/i,
		'Licence document': /^(licen[cs]e|copying)/i,
		'Changelog document': /^change(s|log)/i,
		'.gitignore file': /^gitignore/i,
		'Test suite': {
			type: 'tree',
			path: /(spec|tests?)/i,
			relevant: function () {
				return options.containsCode;
			}
		}
	};
	
	files = merge(files, options.files);

	var pointKeys = Object.keys(files);

	pointKeys.forEach(function(p) {
		var passed = false;
		var i;
		for (i = tree.length - 1; i >= 0; i--) {
			if (typeof files[p].shouldExist === 'boolean') {
				if (files[p].type && files[p].path) {
					if (resolveRelevance(files[p]) && (files[p].path.test(tree[i].path) === files[p].shouldExist)) {
						passed = true;
						break;
					}
				} else if (files[p].test(tree[i].path) === files[p].shouldExist) {
					passed = true;
					break;
				}
			} else if (files[p].type && files[p].path) {
				if (resolveRelevance(files[p]) && files[p].path.test(tree[i].path)) {
					passed = true;
					break;
				}
			} else if (files[p].test(tree[i].path)) {
				passed = true;
				break;
			}
		}

		// If something should not exist, and there's nothing in the tree then of
		// COURSE it doesn't exist
		if (tree.length === 0 && typeof files[p].shouldExist === 'boolean') {
			passed = true;
		}

		if (passed) {
			passes.push({ message : p });
		// Is this confusing? Either there's no opinion about relevancy, or it's a function.
		// If no opinion, failures. If function, use that to determine.
		} else if (!files[p].relevant || files[p].relevant(tree)) {
			failures.push({ message : p });
		}
	});

	return {
		passes: passes,
		failures: failures
	};
};
