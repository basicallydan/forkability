module.exports = {
	name: 'Python',
	files: {
		'setup.py file': /^setup\.py/,
		'requirements.txt file': /^requirements\.txt/,
		'Test suite': {
			type: 'tree',
			path: /tests/i
		},
		'Documentation': {
			type: 'tree',
			path: /docs/i,
		},
		'No *.pyc file': {
			path: /^.*\.pyc/i,
			shouldExist: false,
			type: 'file'
		}
	}
};