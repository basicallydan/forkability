module.exports = {
	name: 'C#',
	files: {
		'No unit test folder': {
			path: /^unit tests/i,
			shouldExist: true,
			type:'tree'
		}
	}
};