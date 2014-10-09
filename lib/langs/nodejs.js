module.exports = {
	features: {
		'package.json file':/^package\.json/i,
		'No node_modules folder': {
			path: /^node_modules/i,
			shouldExist: false,
			type:'tree'
		}
	}
};