$(document).ready(function() {
	var myRef = new Firebase("https://blistering-inferno-9575.firebaseio.com");
	var authClient = new FirebaseSimpleLogin(myRef, function(error, user) {
		if (error) {
			// an error occurred while attempting login
			console.log(error);
		} else if (user) {
			// user authenticated with Firebase
			console.log("User ID: " + user.uid + ", Provider: " + user.provider);
			doRepos(user.accessToken);
		} else {
			// user is logged out
		}
	});


	$('.sign-in').click(function() {
		authClient.login('github', {
			rememberMe: true,
			scope: 'user'
		});
	});

	function doRepos(accessToken) {
		var forkabilityOpts = {
			user: 'basicallydan',
			repository: 'interfake'
		};

		if (accessToken) {
			forkabilityOpts.auth = {
				token: accessToken
			};
		}

		$('.sign-in').attr('href', $('.sign-in').attr('href') + generateUUID());
		forkability(forkabilityOpts, function(err, report) {
			if (!report.files.present.length) {
				$('<li class="message"><strong>Oops!</strong> You don\'t have any of the recommended features for your open source project!</li>').appendTo('.missing-files');
			}

			report.files.present.forEach(function(thing) {
				$('<li><span class="green">✓</span>' + thing + '</li>').appendTo('.present-files');
			});

			if (!report.files.missing.length) {
				$('<li class="message"><strong>Congrats!</strong> You have all the recommended features for your open source project!</li>').appendTo('.missing-files');
			}

			report.files.missing.forEach(function(thing) {
				$('<li><span class="red">✘</span>' + thing + '</li>').appendTo('.missing-files');
			});
			report.warnings.forEach(function(w, i) {
				var warning = $('<li class="warning"><span class="cyan">|</span>' + w.message + '</li>').appendTo('.warnings');
				if (w.details && w.details.url) {
					$('<span class="warning-detail"></span>').appendTo(warning).html('Hello');
				}
			});
		});
	}
});