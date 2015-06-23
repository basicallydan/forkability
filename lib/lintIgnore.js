var merge = require('merge');

module.exports = function(tree, options) {
	var passes = [];
	var failures = [];
	var resolveRelevance = function (feature) {
		return (!feature.relevant || feature.relevant === true || feature.relevant());
	};
	var files = {};
	files = merge(files, options.ignore);

	var pointKeys = Object.keys(options.ignore);

	pointKeys.forEach(function(p) {
		var fileExists = false;
		var i;
		for (i = tree.length - 1; i >= 0; i--) {
			if (typeof files[p].shouldExist === 'boolean') {
				if (files[p].type && files[p].path) {
					if (resolveRelevance(files[p]) && (files[p].path.test(tree[i].path) === files[p].shouldExist)) {
						fileExists = true;
						break;
					}
				} else if (files[p].test(tree[i].path) === files[p].shouldExist) {
					fileExists = true;
					break;
				}
			} else if (files[p].type && files[p].path) {
				if (resolveRelevance(files[p]) && files[p].path.test(tree[i].path)) {
					fileExists = true;
					break;
				}
			} else if (files[p].test(tree[i].path)) {
				fileExists = true;
				break;
			}
		}

		// If something should not exist, and there's nothing in the tree then of
		// COURSE it doesn't exist
		if (tree.length === 0 && typeof files[p].shouldExist === 'boolean') {
			fileExists = false;
		}

		if (fileExists) {
			failures.push({ message : p });
		} else  {
			passes.push({ message : p });
		}
	});

	return {
		passes: passes,
		failures: failures
	};
};