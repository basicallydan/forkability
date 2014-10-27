#! /usr/bin/env node

var program = require('commander');
var forkability = require('./lib/app');
var packageInfo = require('./package.json');
var colors = require('colors');
var repoRegex = /([^\/]*)\/([^\/]*)/;
var repoInfo;
program
	.version(packageInfo.version)
	.usage('[username]/[repository]')
	.option('-u, --username [user]', 'Username to use for auth')
	.option('-p, --password [pass]', 'Password to use for auth')
	.option('-l, --lang [lang,lang,lang]', 'Language(s) to lint use for lint config. Comma-separated', '')
	.option('-r, --reporter [list|json|prettyjson]', 'The format to output the report in. Default is list (more readable)', 'list');

program.on('--help', function () {
	console.log('  Supported languages for --lang:');
	var languageKeys = Object.keys(forkability.languages);
	for (var i = languageKeys.length - 1; i >= 0; i--) {
		console.log('    -', languageKeys[i], '(' + forkability.languages[languageKeys[i]].name + ')');
	}
	console.log('\n    If you wish to contribute support for a new language, please see our CONTRIBUTING guidelines:');
	console.log('    https://github.com/basicallydan/forkability/blob/master/CONTRIBUTING.md\n');
	console.log('    or check for upcoming support in the issues:');
	console.log('    https://github.com/basicallydan/forkability/issues\n');
});

program.parse(process.argv);

if (!program.args[0] || !repoRegex.test(program.args[0])) {
	throw new Error('You need to specify a repo in the format username/repository');
}

repoInfo = program.args[0].match(repoRegex);

if (program.lang.trim().length > 0) {
	program.lang = program.lang.split(',');
}

var options = {
	user: repoInfo[1],
	repository: repoInfo[2],
	languages: program.lang
};

if (program.username && program.password) {
	options.auth = {
		username: program.username,
		password: program.password
	};
}

function listReporter(err, report) {
	if (err) {
		return console.error('Error: ', err.message);
	}
	console.log('# Forkability found'.cyan, (report.passes.length + '').magenta, 'recommended features, and has'.cyan, (report.failures.length + '').magenta, 'suggestions'.cyan);
	console.log('');
	console.log('# Features'.magenta);
	report.passes.forEach(function(pass) {
		console.log('✓'.green, pass.message);
	});
	console.log('');
	console.log('# Suggestions'.magenta);
	report.failures.forEach(function(failure, i) {
		var message = failure.message;
		if (failure.details && failure.details.suggestion) {
			message = message + ': ' + failure.details.suggestion;
		}
		console.log('!'.yellow, message);
		if (failure.details && failure.details.url) {
			console.log(((i === report.failures.length - 1 ? '└' : '├') + '──').cyan, failure.details.title ? (failure.details.title + ':') : '', failure.details.url.cyan);
		}
	});
}

function jsonReporter(err, report) {
	if (err) {
		return console.error('Error: ' + err.message);
	}
	console.log(JSON.stringify(report));
}

function prettyJSONReporter(err, report) {
	if (err) {
		return console.error('Error: ' + err.message);
	}
	console.log(JSON.stringify(report, null, 4));
}

var reporters = {
	list : listReporter,
	json : jsonReporter,
	prettyjson : prettyJSONReporter
};

forkability(options, function(err, report) {
	reporters[program.reporter](err, report);
});