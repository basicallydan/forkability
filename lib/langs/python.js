module.exports = {
	name: 'Python',
	features: {
		'setup.py file': /^setup\.py/,
		'requirements.txt file': /^requirements\.txt/,
		'Test suite': {
			type: 'tree',
			path: /tests/i
		},
		'Documentation': {
			type: 'tree',
			path: /docs/i,
		}
	}
};