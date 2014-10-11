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
	.option('-l, --lang [lang,lang,lang]', 'Language(s) to lint use for lint config. Comma-separated')
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

var options = {
	user: repoInfo[1],
	repository: repoInfo[2],
	languages: (program.lang || '').split(',')
};

if (program.username && program.password) {
	options.auth = {
		username: program.username,
		password: program.password
	};
}

function listReporter(err, report) {
	console.log('# Recommended features'.magenta);
	report.features.passes.forEach(function(pass) {
		console.log('✓'.green, pass.message);
	});
	report.features.failures.forEach(function(failure, i) {
		console.log('✘'.red, failure.message);
		if (failure.details && failure.details.url) {
			console.log(((i === report.features.failures.length - 1 ? '└' : '├') + '──').cyan, failure.details.title ? (failure.details.title + ':') : '', failure.details.url);
		}
	});
	// console.log('');
	// console.log(('# ' + report.warnings.length + (' Warning' + (report.warnings.length === 1 ? '' : 's')))[report.warnings.length ? 'magenta' : 'green']);
	// report.warnings.forEach(function (w, i) {
	// 	console.log('|'.cyan, w.message);
	// });
}

function jsonReporter(err, report) {
	if (err) {
		return console.error(err);
	}
	console.log(JSON.stringify(report));
}

function prettyJSONReporter(err, report) {
	if (err) {
		return console.error(err);
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