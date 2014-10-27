module.exports = {
	name: 'Node JS',
	files: {
		'package.json file':/^package\.json/i,
		'No node_modules folder': {
			path: /^node_modules/i,
			shouldExist: false,
			type:'tree'
		}
	}
};