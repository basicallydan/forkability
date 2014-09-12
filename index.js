#! /usr/bin/env node

var program = require('commander');
var forkability = require('./lib/app');
var packageInfo = require('./package.json');
var colors = require('colors');
var repoRegex = /([^\/]*)\/([^\/]*)/;
var repoInfo;
program
	.version(packageInfo.version)
	.parse(process.argv);

if (!program.args[0] || !repoRegex.test(program.args[0])) {
	throw new Error('You need to specify a repo in the format username/repository');
}

repoInfo = program.args[0].match(repoRegex);

forkability(repoInfo[1], repoInfo[2], function(present, missing, warnings) {
	present.forEach(function(thing) {
		console.log('✓'.green, thing);
	});
	missing.forEach(function(thing) {
		console.log('✘'.red, thing);
	});
	warnings.forEach(function (w) {
		console.log('!'.grey, w.message);
		if (w.details && w.details.url) {
			console.log('└──'.grey, w.details.title ? (w.details.title + ':') : '', w.details.url);
		}
	});
});