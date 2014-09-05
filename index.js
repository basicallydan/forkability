var request = require('request');
var colors = require('colors');

var points = {
	'Contributing document':/contributing.(txt|md)/i,
	'Readme document':/readme.(txt|md)/i,
};

request.get({ url:'https://api.github.com/repos/basicallydan/interfake/commits', headers: {'User-Agent':'Forkability'}, json: true}, function (err, response, data) {
	var sha = data[0].sha;
	var url = 'https://api.github.com/repos/basicallydan/interfake/git/trees/' + sha;
	console.log(url);
	request.get({ url:url, headers: {'User-Agent':'Forkability'}, json: true}, function (err, response, data) {
		// console.log(data);
		var pointKeys = Object.keys(points);
		pointKeys.forEach(function (p) {
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
				console.log('✓'.green, p);
			} else {
				console.log('✘'.red, p);
			}
		});
	});
});