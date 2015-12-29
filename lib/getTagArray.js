var fs = require('fs');
var path = require('path');

module.exports = function (absoluteDirectoryPath) {
	var tagsPath = path.resolve(absoluteDirectoryPath, '.git/refs/tags/');
	return fs.readdirSync(tagsPath);
};


// var NodeGit = require('nodegit');

// var pathToRepo = require('path').resolve('./../.git');

// NodeGit.Repository.open(pathToRepo)
// 	// Open the master branch.
// 	.then(function(repo) {
// 		console.log('Got repo:', repo);
// 		NodeGit.Tag.list(repo).then(function(array) {
// 			console.log(array);
// 		});
// 	}).catch(function(reasonForFailure) {
// 		console.log('Fail:', reasonForFailure);
// 	});
