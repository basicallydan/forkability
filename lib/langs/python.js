module.exports = {
	name: 'Python',
	features: {
	        'setup.py':/^setup\.py/,
	        'requirements.txt':/^requirements\.txt/,
	        'Test suite': {
		    type: 'tree',
		    path: /tests/i,
		    shouldExist: true
		},
	        'Documentation': {
		    type: 'tree',
		    path: /docs/i,
		}
	}
};
