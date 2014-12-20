module.exports = {
	name: 'Perl',
	files: {
		'Build/requirements file': /(^Makefile.PL|^Build.PL)/,
		'Test suite': {
			type: 'tree',
			path: /t/i
		},
	}
};
