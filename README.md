forkability
===========
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/basicallydan/forkability?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A linter for your repository.

## How to use

### Web App

https://basicallydan.github.io/forkability runs the code in its client-side form (works just fine), but it requires you to log in using GitHub OAuth. It will ask for access to write to your profile, which I promise will not be exploited. This is merely a limitation of Firebase. You can't ask for no scope.

### Node Module/Command Line

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

This will give you a pretty, colourful (if your terminal supports it), UTF-8-tastic (if your terminal supports it) list of features and suggested features. It looks a bit like this:


```bash
forkability basicallydan/interfake

# Forkability found 6 recommended features, and has 4 suggestions

# Features
✓ Contributing document
✓ Readme document
✓ Licence document
✓ Test suite

# Suggestions
! Changelog document
! Uncommented issue: Comment on the issue to indicate acknowledgement
├── Support other Content-Types: https://github.com/basicallydan/interfake/issues/31
! Untouched issue: Comment or label the issue to indicate acknowledgement
├── Support other Content-Types: https://github.com/basicallydan/interfake/issues/31
! Uncommented issue: Comment on the issue to indicate acknowledgement
└── Media Responses: https://github.com/basicallydan/interfake/issues/19
```

#### Other Options

* `--reporter` (`-r`): Specify how the lint report should be output (`list` (default), `json` or `prettyjson`)
* `--lang` (`-l`): Specify languages to use for extra features to test. Comma-separated list. ([available languages](https://github.com/basicallydan/forkability/tree/master/lib/langs))
* `--help` (`-h`): How to use the module, and will list available languages

### JavaScript API

If you're really, really into this jazz you can use the JS API. This is how it looks:

```
forkability(options, function(err, report) {
	console.log('# Recommended files'.magenta);
	report.passes.forEach(function(thing) {
		console.log('✓'.green, thing);
	});
	report.failures.forEach(function(thing) {
		console.log('✘'.red, thing);
	});
});
```

`options` accepts:

* `user`: The username of the repo owner (can be an organisation)
* `repository`: The name of the repository
* `fileDepth`: How deep to go into the file tree of the repo to check for files. (thanks [@M-Zuber](https://github.com/M-Zuber)!)
* `auth`: An object which can contain these thingies:
	* `username`: The username to authenticate with, using basic auth.
	* `password`: The password to authenticate with, using basic auth. Needs to be supplied with `username`.
	* `token`: If you're using OAuth or something, put the authentication token here. Check out `pages/pages.js` to see this badassery in action!

Thankfully, that's it.

## Contributing

For more info on this see [contributing.md](https://github.com/basicallydan/forkability/blob/master/contributing.md)

The thing about what makes a project forkable is that there are probably various ways to look at a project and thus many opinions.

So I'd like to invite anybody reading this to [open an issue](https://github.com/basicallydan/forkability/issues), and/or make a pull request - pull requests are all the hotness right now - which details in some way what could be done to make this a *more useful tool*.

### Contributors

Thanks to everybody who has helped. So far this includes:

* [@JJ](https://github.com/JJ)
* [@kirang89](https://github.com/kirang89)
* [@basicallydan](https://github.com/basicallydan)
* [@hpoom](https://github.com/hpoom)
* [@M-Zuber](https://github.com/M-Zuber)

## Long-term goals of this project

* Give people a recognisable score for the open-source-friendliness ("forkability") of their project
* Inform people about the open-source movement
* Educate people on the benefits of open-sourcing their code
* Tell people about how they can improve the "forkability" of their project

## Tests

Make sure you `npm install -g mocha`, then `npm test` this repo.

### Possible domains for this project:

* forkability.org
* forkability.io

## Disclaimer

You should not use forkability as the sole way to judge how forkable your project is. After all, it is not in any way intelligent, it is merely looking for the presence of certain features in your project in order to nudge you in the right direction.

Your best bet to make your project as forkable as possible is to ask your friends, or your friendly neighbourhood open-source community!