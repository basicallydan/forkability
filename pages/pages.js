function getParameterByName(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

var rootPath = '/forkability';

if (/localhost/i.test(window.location.href)) {
	rootPath = '/';
}

var loadPage = function() {
	var currentUser;
	var repoOptions = {};
	var repos = [];

	repoOptions.username = getParameterByName('u');
	repoOptions.repository = getParameterByName('r');
	repoOptions.languages = (getParameterByName('l') || '').trim();
	repoOptions.languages = repoOptions.languages.length > 0 ? repoOptions.languages.split(',') : [];

	var authClient = new GetAPI.GitHubClient({
		clientId: '9dddfb154feb2d02d35c'
	}, function(error, user) {
		if (error) {
			// an error occurred while attempting login
			console.log(error);
			$('.sign-out').hide();
		} else if (user && user.accessToken) {
			$('.sign-out').show();
			currentUser = user;
			$.ajax(
				'https://api.github.com/user', {
					dataType: 'json',
					method: 'GET',
					headers: {
						Authorization: 'Token ' + currentUser.accessToken
					},
					success: function(data, textStatus, jqXHR) {
						currentUser = $.extend(currentUser, data);
						// user authenticated with GetAPI
						console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
						if (repoOptions.username && repoOptions.repository) {
							checkRepo({
								user: repoOptions.username,
								repository: repoOptions.repository,
								auth: {
									token: currentUser.accessToken
								},
								languages: repoOptions.languages
							});
						} else {
							showRepoPicker({
								defaultUsername: currentUser.login
							}, repoOptions);
						}
					}
				});
		} else {
			showSignIn();
		}
	});

	$('.sign-out').click(function() {
		authClient.logout();
		history.pushState({}, 'Forkability', rootPath);
		$(this).hide();
	});

	function renderByID(id, o) {
		var source = $(id).html();
		var template = Handlebars.compile(source);
		return $('.main-body').html(template(o));
	}

	function showSignIn() {
		var hero = renderByID('#sign-in-template');

		hero.find('.sign-in').click(function(e) {
			e.preventDefault();
			authClient.login({
				rememberMe: true,
				scope: undefined
			});
		});
		$('.sign-out').hide();
	}

	function showRepoPicker(model, o) {
		var hero = renderByID('#choose-repo-template', model);
		getRepositories(repoOptions.username || currentUser.login);

		hero.find('#languages').html('');
		$.each(forkability.languages, function(langKey, lang) {
			hero.find('#languages').append('<option value="' + langKey + '">' + lang.name + '</option>');
		});

		function getRepositories(username, cb) {
			var repositoryElement = hero.find('#repository');
			repositoryElement.attr('placeholder', 'Loading ' + username + '\'s repositories...');
			$.ajax(
				'https://api.github.com/users/' + username + '/repos', {
					dataType: 'json',
					method: 'GET',
					headers: {
						Authorization: 'Token ' + currentUser.accessToken
					},
					success: function(data, textStatus, jqXHR) {
						hero.find('#repositories').html('');
						repositoryElement.attr('placeholder', 'Pick one of ' + username + '\'s repositories');
						$.each(data, function(i, repo) {
							hero.find('#repositories').append('<option value="' + repo.name + '">' + repo.name + '</option>');
						});
						console.log(data);
					}
				});
		}

		var submit = function(e) {
			e.preventDefault();
			var user = hero.find('#username').val() || currentUser.login;
			var repo = hero.find('#repository').val();
			var lang = hero.find('#language').val();
			if (!repo) {
				return alert('You really do need to enter a repository name');
			}
			checkRepo({
				user: user,
				repository: repo,
				languages: [lang.trim() || undefined],
				auth: {
					token: currentUser.accessToken
				}
			});
		};

		hero.find('#username').change(function() {
			getRepositories(hero.find('#username').val() || currentUser.login);
		});

		if (o) {
			hero.find('#username').val(o.username);
			hero.find('#repository').val(o.repository);
		}

		hero.find('.repo-form').submit(submit);
		hero.find('#check-forkability').click(submit);
	}

	function checkRepo(forkabilityOpts) {
		repoOptions = {};

		// var forkabilityOpts = {
		// 	user: user,
		// 	repository: repository
		// };

		if (!forkabilityOpts.auth && !forkabilityOpts.auth.token) {
			return showSignIn();
		}

		var stateURL = '?u=' + forkabilityOpts.user + '&r=' + forkabilityOpts.repository;

		if (forkabilityOpts.languages && forkabilityOpts.languages.length > 0) {
			stateURL += '&l=' + forkabilityOpts.languages.join(',');
		}

		history.pushState({}, 'Forkability of ' + forkabilityOpts.user + '/' + forkabilityOpts.repository, stateURL);

		forkability(forkabilityOpts, function(err, report) {
			var reportElement = renderByID('#repo-info-template', {
				repoUser: forkabilityOpts.user,
				repoName: forkabilityOpts.repository,
				rootPath: rootPath
			});
			if (!report.features.passes.length) {
				$('<li class="message"><strong>Oops!</strong> You don\'t have any of the recommended features for your open source project!</li>').appendTo('.failed-features');
			}

			if (!report.features.failures.length) {
				$('<li class="message"><strong>Congrats!</strong> You have all the recommended features for your open source project!</li>').appendTo('.failed-features');
			}

			report.features.passes.forEach(function(pass) {
				$('<li><i class="fa fa-check tick"></i> ' + pass.message + '</li>').appendTo(reportElement.find('.passed-features'));
			});
			report.features.failures.forEach(function(failure) {
				var failureMessage = failure.message;
				if (failure.details && failure.details.url && failure.details.title) {
					failureMessage += ': <span class="failure-details"><a href="' + failure.details.url + '" target="_blank">' + failure.details.title + '</a></span>';
				}
				if (failure.details && failure.details.suggestion) {
					failureMessage += '<span class="failure-suggestion">' + failure.details.suggestion + '</span>';
				}
				$('<li><i class="fa fa-exclamation-triangle cross"></i> ' + failureMessage + '</li>').appendTo(reportElement.find('.failed-features'));
			});
		});
	}
};

$(document).ready(loadPage);

window.onpopstate = function() {
	loadPage();
};