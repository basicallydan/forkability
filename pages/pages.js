$(document).ready(function() {
	var myRef = new Firebase("https://blistering-inferno-9575.firebaseio.com");
	var currentUser;
	var authClient = new FirebaseSimpleLogin(myRef, function(error, user) {
		if (error) {
			// an error occurred while attempting login
			console.log(error);
		} else if (user) {
			currentUser = user;
			// user authenticated with Firebase
			console.log("User ID: " + user.uid + ", Provider: " + user.provider);
			// doRepos(user.accessToken);
			showRepoPicker({ username : currentUser.username });
		} else {
			showSignIn();
		}
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
	}

	function showRepoPicker(model) {
		var hero = renderByID('#choose-repo-template', model);

		var submit = function (e) {
			e.preventDefault();
			var user = hero.find('#username').val() || currentUser.username;
			var repo = hero.find('#repository').val();
			if (!repo) {
				return alert('You really do need to enter a repository name');
			}
			checkRepo(user, repo, currentUser.accessToken);
		};

		hero.find('.repo-form').submit(submit);
		hero.find('#check-forkability').click(submit);
	}

	function checkRepo(user, repository, accessToken) {
		var forkabilityOpts = {
			user: user,
			repository: repository
		};

		if (accessToken) {
			forkabilityOpts.auth = {
				token: accessToken
			};
		}

		forkability(forkabilityOpts, function(err, report) {
			var reportElement = renderByID('#repo-info-template');
			report.files.present.forEach(function(thing) {
				$('<li><i class="fa fa-check"></i> ' + thing + '</li>').appendTo(reportElement.find('.present-files'));
			});
			report.files.missing.forEach(function(thing) {
				$('<li><i class="fa fa-times"></i> ' + thing + '</li>').appendTo(reportElement.find('.missing-files'));
			});
			report.warnings.forEach(function(w, i) {
				var warningMessage = w.message;
				if (w.details && w.details.url && w.details.title) {
					warningMessage += '<br><i class="fa fa-long-arrow-right"></i><a href="' + w.details.url + '" target="_blank">' + w.details.title + '</a>';
				}
				var warning = $('<li class="warning"><i class="fa fa-exclamation"></i> ' + warningMessage + '</li>').appendTo(reportElement.find('.warnings'));
			});
		});
	}
});