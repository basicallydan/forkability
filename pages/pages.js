function getParameterByName(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

$(document).ready(function() {
	var myRef = new Firebase('https://blistering-inferno-9575.firebaseio.com');
	var currentUser;
	var repoOptions = {};

	repoOptions.username = getParameterByName('u');
	repoOptions.repository = getParameterByName('r');

	var authClient = new FirebaseSimpleLogin(myRef, function(error, user) {
		if (error) {
			// an error occurred while attempting login
			console.log(error);
			$('.sign-out').hide();
		} else if (user) {
			$('.sign-out').show();
			currentUser = user;
			// user authenticated with Firebase
			console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
			if (repoOptions.username && repoOptions.repository) {
				checkRepo(repoOptions.username, repoOptions.repository, currentUser.accessToken);
			} else {
				showRepoPicker({
					defaultUsername: currentUser.username
				}, repoOptions);
			}
		} else {
			showSignIn();
		}
	});

	$('.sign-out').click(function () {
		authClient.logout();
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
			authClient.login('github', {
				rememberMe: true,
				scope: 'user'
			});
		});
		$('.sign-out').hide();
	}

	function showRepoPicker(model, o) {
		var hero = renderByID('#choose-repo-template', model);

		var submit = function(e) {
			e.preventDefault();
			var user = hero.find('#username').val() || currentUser.username;
			var repo = hero.find('#repository').val();
			if (!repo) {
				return alert('You really do need to enter a repository name');
			}
			checkRepo(user, repo, currentUser.accessToken);
		};

		if (o) {
			hero.find('#username').val(o.username);
			hero.find('#repository').val(o.repository);
		}

		hero.find('.repo-form').submit(submit);
		hero.find('#check-forkability').click(submit);
	}

	function checkRepo(user, repository, accessToken) {
		repoOptions = {};

		var forkabilityOpts = {
			user: user,
			repository: repository
		};

		if (accessToken) {
			forkabilityOpts.auth = {
				token: accessToken
			};
		} else {
			return showSignIn();
		}

		history.pushState({}, 'Forkability of ' + user + '/' + repository, '?u=' + user + '&r=' + repository);

		forkability(forkabilityOpts, function(err, report) {
			var reportElement = renderByID('#repo-info-template');
			if (!report.files.present.length) {
				$('<li class="message"><strong>Oops!</strong> You don\'t have any of the recommended features for your open source project!</li>').appendTo('.missing-files');
			}

			if (!report.files.missing.length) {
				$('<li class="message"><strong>Congrats!</strong> You have all the recommended features for your open source project!</li>').appendTo('.missing-files');
			}
			
			report.files.present.forEach(function(thing) {
				$('<li><i class="fa fa-check tick"></i> ' + thing + '</li>').appendTo(reportElement.find('.present-files'));
			});
			report.files.missing.forEach(function(thing) {
				$('<li><i class="fa fa-times cross"></i> ' + thing + '</li>').appendTo(reportElement.find('.missing-files'));
			});
			report.warnings.forEach(function(w, i) {
				var warningMessage = w.message;
				if (w.details && w.details.url && w.details.title) {
					warningMessage += '<br><i class="fa fa-long-arrow-right"></i><a href="' + w.details.url + '" target="_blank">' + w.details.title + '</a>';
				}
				var warning = $('<li class="warning"><i class="fa fa-exclamation exclaimation"></i> ' + warningMessage + '</li>').appendTo(reportElement.find('.warnings'));
			});

			// Now initialise all the pretty bootstrap stuff
			// $('.explanation-link').popover();
			// $('#warnings-modal').modal();
		});
	}
});