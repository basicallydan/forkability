var merge = require('merge');

module.exports = function(tree, options) {
	var passes = [];
	var failures = [];
	options = merge({ containsCode : false, features : {} }, options);
	var resolveRelevance = function (feature) {
		return (!feature.relevant || feature.relevant === true || feature.relevant());
	};
	var features = {
		'Contributing document': /^contributing/i,
		'Readme document': /^readme/i,
		'Licence document': /^(licen[cs]e|copying)/i,
		'Changelog document': /^change(s|log)/i,
		'Test suite': {
			type: 'tree',
			path: /(spec|tests?)/i,
			relevant: function () {
				return options.containsCode;
			}
		}
	};
	
	features = merge(features, options.features);

	var pointKeys = Object.keys(features);

	pointKeys.forEach(function(p) {
		var passed = false;
		var i;
		for (i = tree.length - 1; i >= 0; i--) {
			if (typeof features[p].shouldExist === 'boolean') {
				if (features[p].type && features[p].path) {
					if (resolveRelevance(features[p]) && (features[p].path.test(tree[i].path) === features[p].shouldExist)) {
						passed = true;
						break;
					}
				} else if (features[p].test(tree[i].path) === features[p].shouldExist) {
					passed = true;
					break;
				}
			} else if (features[p].type && features[p].path) {
				if (resolveRelevance(features[p]) && features[p].path.test(tree[i].path)) {
					passed = true;
					break;
				}
			} else if (features[p].test(tree[i].path)) {
				passed = true;
				break;
			}
		}

		// If something should not exist, and there's nothing in the tree then of
		// COURSE it doesn't exist
		if (tree.length === 0 && typeof features[p].shouldExist === 'boolean') {
			passed = true;
		}

		if (passed) {
			passes.push(p);
		// Is this confusing? Either there's no opinion about relevancy, or it's a function.
		// If no opinion, failures. If function, use that to determine.
		} else if (!features[p].relevant || features[p].relevant(tree)) {
			failures.push(p);
		}
	});

	return {
		passes: passes,
		failures: failures
	};
};