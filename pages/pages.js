function getParameterByName(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

var rootPath = '/forkability';
var gitHubHost = 'basicallydan.github.io';
var onHTTPS = true;

if (/localhost/i.test(window.location.href)) {
	rootPath = '/';
}

if ((window.location.host.test(gitHubHost)) && !(/https/i.test(window.location.protocol))) {
    onHTTPS = false;
}

var loadPage = function() {
	var currentUser;
	var repoOptions = {};
	var repos = [];

	if (!onHTTPS) {
		$('.sign-in').tooltip({
			title: 'You can\'t sign in using unless you\'re on HTTPS. Click here to be redirected.',
			placement: 'bottom'
		});
	}

	$(document).on('click', '.sign-in', function(e) {
		e.preventDefault();
		if (!onHTTPS) {
			$(this).html('<i class="fa fa-github"></i> Redirecting to https...');
			setTimeout(function () {
				window.location.protocol = 'https';	
			}, 700);
		} else {
			authClient.login({
				rememberMe: true,
				scope: undefined
			});
		}
	});

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
			$('nav .sign-in').show();
		} else if (user && user.accessToken) {
			$('.sign-out').show();
			$('nav .sign-in').hide();
			currentUser = user;
			renderByID('#logging-in-template');
			$.ajax(
				'https://api.github.com/user', {
					dataType: 'json',
					method: 'GET',
					headers: {
						Authorization: 'Token ' + currentUser.accessToken
					},
					success: function(data, textStatus, jqXHR) {
						var o = {
							user: repoOptions.username,
							repository: repoOptions.repository,
							languages: repoOptions.languages
						};
						if (currentUser && currentUser.accessToken) {
							o.auth = {
								token: currentUser.accessToken
							};
						}
						currentUser = $.extend(currentUser, data);
						// user authenticated with GetAPI
						console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
						if (repoOptions.username && repoOptions.repository) {
							checkRepo(o);
						} else {
							showRepoPicker({
								defaultUsername: (currentUser && currentUser.login) ? currentUser.login : undefined
							}, repoOptions);
						}
					}
				});
		} else {
			if (repoOptions.username && repoOptions.repository) {
				checkRepo({
					user: repoOptions.username,
					repository: repoOptions.repository,
					languages: repoOptions.languages
				});
			} else {
				showRepoPicker();
			}
		}
	});

	$('.sign-out').click(function() {
		authClient.logout();
		history.pushState({}, 'Forkability', rootPath);
		showSignIn();
		currentUser = undefined;
		$(this).hide();
		$('nav .sign-in').show();
	});

	function renderByID(id, o) {
		var source = $(id).html();
		var template = Handlebars.compile(source);
		return $('.main-body').html(template(o));
	}

	function showSignIn(showAlert) {
		var hero = renderByID('#sign-in-template', {
			repoOptions: repoOptions,
			showAlert: showAlert || repoOptions.username || repoOptions.repository
		});

		hero.find('.skip-for-now').click(function(e) {
			e.preventDefault();
			showRepoPicker();
		});
		$('.sign-out').hide();
		$('nav .sign-in').show();
	}

	function showRepoPicker(model, o) {
		var hero = renderByID('#choose-repo-template', model);
		if (currentUser && currentUser.login) {
			getRepositories(repoOptions.username || currentUser.login);
		}

		hero.find('#languages').html('');
		$.each(forkability.languages, function(langKey, lang) {
			hero.find('#languages').append('<option value="' + langKey + '">' + lang.name + '</option>');
		});

		hero.find('#language').on('input', function() {
			var val = this.value;
			if (hero.find('#languages').find('option').filter(function() {
					return this.value.toUpperCase() === val.toUpperCase();
				}).length) {
				$('<li></li>')
					.text(val)
					.on('click', function () {
						$(this).remove();
					})
					.attr('class', 'btn btn-primary btn-xs')
					.attr('title', 'Click/tap to remove')
					.appendTo(hero.find('#selected-languages'));
				$(this).val('');
			}
		});

		function getRepositories(username, cb) {
			var repositoryElement = hero.find('#repository');
			repositoryElement.attr('placeholder', 'Loading ' + username + '\'s repositories...');
			var headers = {};
			if (currentUser && currentUser.accessToken) {
				headers = {
					Authorization: 'Token ' + currentUser.accessToken
				};
			}
			$.ajax(
				'https://api.github.com/users/' + username + '/repos', {
					dataType: 'json',
					method: 'GET',
					headers: headers,
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

		function getListOfLanguages() {
			var languagesList = hero.find('#selected-languages li');
			var languagesArray = languagesList.map(function () {
				return $(this).text();
			}).toArray();
			return languagesArray.join(',');
		}

		var submit = function(e) {
			e.preventDefault();
			var user = hero.find('#username').val() || currentUser.login;
			var repo = hero.find('#repository').val();
			var lang = getListOfLanguages();
			if (!repo) {
				return alert('You really do need to enter a repository name');
			}
			var o = {
				user: user,
				repository: repo
			};
			if (lang.trim()) {
				o.languages = lang.trim();
			}
			if (o.languages && o.languages.length > 0) {
				o.languages = o.languages.split(',');
			}
			if (currentUser && currentUser.accessToken) {
				o.auth = {
					token: currentUser.accessToken
				};
			}
			checkRepo(o);
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
		// var forkabilityOpts = {
		// 	user: user,
		// 	repository: repository
		// };

		// if (!forkabilityOpts.auth || !forkabilityOpts.auth.token) {
		// 	return showSignIn();
		// }

		if (typeof ga !== 'undefined') {
			ga('send', 'screenview', $.extend({'screenName': 'Check Repo'}, forkabilityOpts));
		}

		var stateURL = '?u=' + forkabilityOpts.user + '&r=' + forkabilityOpts.repository;

		if (forkabilityOpts.languages && forkabilityOpts.languages.length > 0) {
			stateURL += '&l=' + forkabilityOpts.languages.join(',');
		} else {
			delete forkabilityOpts.languages;
		}

		history.pushState({}, 'Forkability of ' + forkabilityOpts.user + '/' + forkabilityOpts.repository, stateURL);

		renderByID('#loading-repo-template', {
			repoUser: forkabilityOpts.user,
			repoName: forkabilityOpts.repository
		});

		forkability(forkabilityOpts, function(err, report) {
			if (err) {
				if (err.errorName === 'request-limit-hit') {
					return showSignIn(true);
				}
				alert('Sorry, something went wrong getting ' + forkabilityOpts.user + '/' + forkabilityOpts.repository + ':\n' + err.message);
				return showRepoPicker({
					defaultUsername: (currentUser ? currentUser.login : undefined)
				}, repoOptions);
			}
			repoOptions = {};

			var reportElement = renderByID('#repo-info-template', {
				repoUser: forkabilityOpts.user,
				repoName: forkabilityOpts.repository,
				rootPath: rootPath
			});
			if (!report.passes.length) {
				$('<li class="message"><strong>Oops!</strong> You don\'t have any of the recommended features for your open source project!</li>').appendTo('.failed-features');
			}

			if (!report.failures.length) {
				$('<li class="message"><strong>Congrats!</strong> You have all the recommended features for your open source project!</li>').appendTo('.failed-features');
			}

			if (report.badge.type === 'ok') {
				$('<li class="badge">' + report.badge.html + '</li>').appendTo('.failed-features');
				$('<li class="message"><strong>Wear your badge with pride!</strong> Add a Forkable badge to your repo\'s README to show off how easy it is to work with!</li>').appendTo('.failed-features');
				$('<li class="message"><strong>Markdown:</strong> <a href="#" class="autoselect-next">(select all)</a><textarea spellcheck="false">' + report.badge.markdown + '</li>').appendTo('.failed-features');
				$('<li class="message"><strong>HTML:</strong> <a href="#" class="autoselect-next">(select all)</a><textarea spellcheck="false">' + report.badge.html + '</li>').appendTo('.failed-features');
			}

			report.passes.forEach(function(pass) {
				$('<li><i class="fa fa-check tick"></i> ' + pass.message + '</li>').appendTo(reportElement.find('.passed-features'));
			});
			report.failures.forEach(function(failure) {
				var failureMessage = failure.message;
				if (failure.details && failure.details.url && failure.details.title) {
					failureMessage += ': <span class="failure-details"><a href="' + failure.details.url + '" target="_blank">' + failure.details.title + '</a></span>';
				}
				if (failure.details && failure.details.suggestion) {
					failureMessage += '<span class="failure-suggestion">' + failure.details.suggestion + '</span>';
				}
				$('<li><i class="fa fa-exclamation-triangle cross"></i> ' + failureMessage + '</li>').appendTo(reportElement.find('.failed-features'));
			});

			$('.autoselect-next').click(function (e) {
				var textarea = $(this).next('textarea').get(0);
				e.preventDefault();
				textarea.select().focus();

				// Kudos to Tim Down for this excellent solution http://stackoverflow.com/a/5797700
				textarea.onmouseup = function() {
					textarea.onmouseup = null;
					return false;
				}; 
			});
		});
	}
};

$(document).ready(loadPage);

window.onpopstate = function() {
	loadPage();
};