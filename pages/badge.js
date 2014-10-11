function getParameterByName(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

var loadPage = function() {
	var currentUser;
	var repoOptions = {};
	var repos = [];

	repoOptions.username = getParameterByName('u');
	repoOptions.repository = getParameterByName('r');
	repoOptions.languages = (getParameterByName('l') || '').trim();
	repoOptions.languages = repoOptions.languages.length > 0 ? repoOptions.languages.split(',') : [];

	function renderByID(id, o) {
		var source = $(id).html();
		var template = Handlebars.compile(source);
		return $('.main-body').html(template(o));
	}

	function checkRepo(forkabilityOpts) {
		repoOptions = {};

		var stateURL = '?u=' + forkabilityOpts.user + '&r=' + forkabilityOpts.repository;

		if (forkabilityOpts.languages && forkabilityOpts.languages.length > 0) {
			stateURL += '&l=' + forkabilityOpts.languages.join(',');
		}

		history.pushState({}, 'Forkability of ' + forkabilityOpts.user + '/' + forkabilityOpts.repository, stateURL);

		forkability(forkabilityOpts, function(err, report) {
			if (err) {
				alert('Sorry, something went wrong getting ' + forkabilityOpts.user + '/' + forkabilityOpts.repository + ':\n' + err.message);
				return showRepoPicker({
					defaultUsername: currentUser.login
				}, repoOptions);
			}
			if (!report.features.passes.length) {
				$('<li class="message"><strong>Oops!</strong> You don\'t have any of the recommended features for your open source project!</li>').appendTo('.failed-features');
			}

			if (!report.features.failures.length) {
				$('<li class="message"><strong>Congrats!</strong> You have all the recommended features for your open source project!</li>').appendTo('.failed-features');
			}
		});
	}
};

$(document).ready(loadPage);

window.onpopstate = function() {
	loadPage();
};