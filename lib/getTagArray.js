var path = require('path');
var NodeGit = require('nodegit');

module.exports = function (absoluteDirectoryPath, callback) {
	var gitPath = path.resolve(absoluteDirectoryPath, '.git');
	var refsPath = path.resolve(gitPath, 'refs');
	var tagsPath = path.resolve(refsPath, 'tags');

	NodeGit.Repository.open(absoluteDirectoryPath)
	// Open the master branch.
	.then(function(repo) {
		NodeGit.Tag.list(repo).then(function(array) {
			callback(array);
		});
	}).catch(function(reasonForFailure) {
		console.log('Fail:', reasonForFailure);
	});
};


