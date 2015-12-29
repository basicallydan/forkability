var fs = require('fs');
var path = require('path');

module.exports = function (absoluteDirectoryPath) {
	var gitPath = path.resolve(absoluteDirectoryPath, '.git');
	var refsPath = path.resolve(gitPath, 'refs');
	var tagsPath = path.resolve(refsPath, 'tags');
	
	if (!fs.existsSync(gitPath)) {
		throw new Error('You have specified a directory which is not a git repository');
	}

	if (!fs.existsSync(refsPath)) {
		throw new Error('You have specified a directory with an invalid git repository which is missing the refs folder');
	}

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
