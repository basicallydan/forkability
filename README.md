forkability
===========

A linter for your repository.

## How to use

### Web App

https://basicallydan.github.io/forkability runs the code in its client-side form (works just fine), but it requires you to log in using GitHub OAuth. It will ask for access to write to your profile, which I promise will not be exploited. This is merely a limitation of Firebase. You can't ask for no scope.

### Node Module

```bash
npm install forkability -g
```

This will give you access to the `forkability` CLI. This is how you use it:

```bash
forkability basicallydan/forkability
```

Or whatever your username/repo combo is. It'll work with *any* public repo. If you start getting angry messages that you've used up your GitHub request quota, use the `--username` and `--password` flags, like so:

```bash
forkability jashkenas/backbone --username myusername --password totallynotmypasswordloldonttryitplz
# Basic auth!
```

This will give you a pretty, colourful (if your terminal supports it), UTF-8-tastic (if your terminal supports it) list of present or missing features, plus some "warnings" which at the moment are all issue-related. It looks a bit like this:


```bash
forkability basicallydan/interfake

# Recommended files
✓ Contributing document
✓ Readme document
✓ Licence document
✓ Test suite
✘ Changelog document

# 1 Warning
| Uncommented issue
└── Media Responses: https://github.com/basicallydan/interfake/issues/19
```

### JavaScript API

If you're really, really into this jazz you can use the JS API. This is how it looks:

```
forkability(options, function(err, report) {
	console.log('# Recommended files'.magenta);
	report.files.present.forEach(function(thing) {
		console.log('✓'.green, thing);
	});
	report.files.missing.forEach(function(thing) {
		console.log('✘'.red, thing);
	});
	report.warnings.forEach(function (w, i) {
		console.log('|'.cyan, w.message);
		// Also w.details, w.details.url, w.details.title
	});
});
```

`options` accepts:

* `user`: The username of the repo owner (can be an organisation)
* `repository`: The name of the repository
* `auth`: An object which can contain these thingies:
	* `username`: The username to authenticate with, using basic auth.
	* `password`: The password to authenticate with, using basic auth. Needs to be supplied with `username`.
	* `token`: If you're using OAuth or something, put the authentication token here. Check out `pages/pages.js` to see this badassery in action!

Thankfully, that's it.

## Contributing

The thing about what makes a project forkable is that there are probably various ways to look at a project and thus many opinions.

So I'd like to invite anybody reading this to [open an issue](https://github.com/basicallydan/forkability/issues), and/or make a pull request - pull requests are all the hotness right now - which details in some way what could be done to make this a *more useful tool*.

## Long-term goals of this project

* Give people a recognisable score for the open-source-friendliness ("forkability") of their project
* Inform people about the open-source movement
* Educate people on the benefits of open-sourcing their code
* Tell people about how they can improve the "forkability" of their project

## Currently supported measures

* Presence of files
  * licence.md
  * readme.md
  * contributing.md
* Warnings issued for:
  * Uncommented issues which were not opened by the owner of the repo

## Tests

Make sure you `npm install -g mocha`, then `npm tests` this repo.

### Suggested domains:

* forkability.org
* forkability.io

## Disclaimer

You should not use forkability as the sole way to judge how forkable your project is. After all, it is not in any way intelligent, it is merely looking for the presence of certain features in your project in order to nudge you in the right direction.

Your best bet to make your project as forkable as possible is to ask your friends, or your friendly neighbourhood open-source community!