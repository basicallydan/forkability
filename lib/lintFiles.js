module.exports = function(tree) {
	var present = [];
	var missing = [];
	var points = {
		'Contributing document': /contributing.(txt|md)/i,
		'Readme document': /readme.(txt|md)/i,
		'Licence document': /licence.(txt|md)/i,
	};
	var pointKeys = Object.keys(points);
	pointKeys.forEach(function(p) {
		var found = false;
		var i;
		for (i = tree.length - 1; i >= 0; i--) {
			if (points[p].test(tree[i].path)) {
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

	return {
		present: present,
		missing: missing
	};
};