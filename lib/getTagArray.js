var NodeGit = require('nodegit');

var pathToRepo = require('path').resolve('./../.git');

NodeGit.Repository.open(pathToRepo)
	// Open the master branch.
	.then(function(repo) {
		console.log('Got repo:', repo);
		NodeGit.Tag.list(repo).then(function(array) {
			console.log(array);
		});
	}).catch(function(reasonForFailure) {
		console.log('Fail:', reasonForFailure);
	});