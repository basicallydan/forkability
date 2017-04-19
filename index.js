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
	var successSymbol = '✓';
	var badgeTypeText = '(success)'.green;
	var suggestionsText = '(none)'.green;
	var featuresText = '(none)'.yellow;

	if (process.platform === 'win32') {
		successSymbol = '√';
	}

	if (err) {
		return console.error('Error: ', err.message);
	}

	// Customise the output a bit
	if (report.failures.length > 0) {
		featuresText = ('(' + report.passes.length + ')').magenta;
	}

	if (!report.failures.length) {
		featuresText = ('(' + report.passes.length + ')').green;
	}

	if (report.failures.length > 0) {
		suggestionsText = ('(' + report.failures.length + ')').yellow;
	}

	if (report.badge.type !== forkability.badgeTypes.ok) {
		badgeTypeText = '(failure)'.red;
	}

	console.log('# Forkability found'.cyan, (report.passes.length + '').magenta, 'recommended features, and has'.cyan, (report.failures.length + '').magenta, 'suggestions'.cyan);
	console.log('');
	console.log('# Features'.magenta, featuresText);
	report.passes.forEach(function(pass) {
		console.log(successSymbol.green, pass.message);
	});
	console.log('\n---\n');
	console.log('# Suggestions'.magenta, suggestionsText);
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
	console.log('\n---\n');
	console.log('# Forkability Badge'.magenta, badgeTypeText);
	console.log('## Just the SVG:'.cyan, '\n' + report.badge.svg);
	console.log('## Markdown:'.cyan, '\n' + report.badge.markdown);
	console.log('## HTML:'.cyan, '\n' + report.badge.html);
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

#! changed sth haa
