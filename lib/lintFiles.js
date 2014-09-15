module.exports = function(tree, languages) {
	var present = [];
	var missing = [];
	var points = {
		'Contributing document': /^contributing/i,
		'Readme document': /^readme/i,
		'Licence document': /^licence/i,
		'Test suite': {
			type: 'tree',
			path: /(spec|tests?)/i,
			relevant: function () {
				return languages instanceof Array && languages.length > 0;
			}
		}
	};
	var pointKeys = Object.keys(points);
	pointKeys.forEach(function(p) {
		var found = false;
		var i;
		for (i = tree.length - 1; i >= 0; i--) {
			if (points[p].type && points[p].path) {
				if (points[p].relevant() && points[p].path.test(tree[i].path)) {
					found = true;
					break;
				}
			} else if (points[p].test(tree[i].path)) {
				found = true;
				break;
			}
		}
		if (found) {
			present.push(p);
		// Is this confusing? Either there's no opinion about relevancy, or it's a function.
		// If no opinion, missing. If function, use that to determine.
		} else if (!points[p].relevant || points[p].relevant()) {
			missing.push(p);
		}
	});

	return {
		present: present,
		missing: missing
	};
};