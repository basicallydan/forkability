var merge = require('merge');

module.exports = function(tree, ignores) {
	var passes = [];
	var failures = [];
	var resolveRelevance = function (feature) {
		return (!feature.relevant || feature.relevant === true || feature.relevant());
	};

	var pointKeys = Object.keys(ignores);

	pointKeys.forEach(function(p) {
		var fileExists = false;
		var i;
		for (i = tree.length - 1; i >= 0; i--) {
			if (typeof ignores[p].shouldExist === 'boolean') {
				if (ignores[p].type && ignores[p].path) {
					if (resolveRelevance(ignores[p]) && (ignores[p].path.test(tree[i].path) === ignores[p].shouldExist)) {
						fileExists = true;
						break;
					}
				} else if (ignores[p].test(tree[i].path) === ignores[p].shouldExist) {
					fileExists = true;
					break;
				}
			} else if (ignores[p].type && ignores[p].path) {
				if (resolveRelevance(ignores[p]) && ignores[p].path.test(tree[i].path)) {
					fileExists = true;
					break;
				}
			} else if (ignores[p].test(tree[i].path)) {
				fileExists = true;
				break;
			}
		}

		// If something should not exist, and there's nothing in the tree then of
		// COURSE it doesn't exist
		if (tree.length === 0 && typeof ignores[p].shouldExist === 'boolean') {
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