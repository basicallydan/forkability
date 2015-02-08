var nock = require('nock');

beforeEach(function () {
	nock.cleanAll();
});

function mockResponses(responses, recursiveParam) {
	responses = responses || {};
	recursiveParam = recursiveParam || 2;

	nock('https://api.github.com', {
		reqHeaders: responses.firstCommitTreeRequestHeaders || {
			'User-Agent': 'Forkability (http://github.com/basicallydan/forkability) (Daniel Hough <daniel.hough@gmail.com>)'
		}
	})
		.get('/repos/thatoneguy/thatonerepo/commits')
		.reply(responses.commitsStatus || 200, responses.commitsBody || [{
			sha: 'fakeshalol'
		}]);

	nock('https://api.github.com')
		.get('/repos/thatoneguy/thatonerepo/git/trees/fakeshalol?recursive=' + recursiveParam)
		.reply(responses.firstCommitTreeStatus || 200, responses.firstCommitTreeBody || {
			tree: [{
				path: 'contributing.md'
			}, {
				path: 'readme.md'
			}, {
				path: 'licence.md'
			}, {
				path: 'changelog.md'
			},{
				path: '.gitignore'
			}, {
				path: 'spec',
				type: 'tree'
			}]
		});

	nock('https://api.github.com')
		.get('/repos/thatoneguy/thatonerepo/issues?state=open')
		.reply(responses.openIssuesStatus || 200, responses.openIssuesBody || []);

	nock('https://api.github.com')
		.get('/repos/thatoneguy/thatonerepo/languages')
		.reply(responses.languagesStatus || 200, responses.languagesBody || { JavaScript : 1000 });

	nock('https://api.github.com')
		.get('/repos/thatoneguy/thatonerepo/tags')
		.reply(responses.tagsStatus || 200, responses.tagsBody || [{
			name: 'v1.0.0'
		}]);
}

module.exports = mockResponses;