forkability
===========
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/basicallydan/forkability?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![This is a forkable respository](https://img.shields.io/badge/forkable-yes-brightgreen.svg)](https://basicallydan.github.io/forkability/?u=basicallydan&r=forkability&l=nodejs)

Forkability helps you to make your project more open-source-friendly by pointing out missing features and useful tips.

## How to use

### Web App

https://basicallydan.github.io/forkability runs the code in its client-side form (works just fine). It allows you to log in using GitHub OAuth in order to get a higher API request quota.

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

This will give you a pretty, colourful (if your terminal supports it), UTF-8-tastic (if your terminal supports it) list of features and suggested features, as well as a pretty badge you can include in your README or repo's web page. It looks a bit like this:


```bash
forkability basicallydan/interfake

# Forkability found 6 recommended features, and has 2 suggestions

# Features (6)
✓ Contributing document
✓ Readme document
✓ License document
✓ .gitignore file
✓ Test suite
✓ Tags are being used

---

# Suggestions (2)
! Changelog document
! Uncommented issue: Comment on the issue to indicate acknowledgement
└── Media Responses: https://github.com/basicallydan/interfake/issues/19

---

# Forkability Badge (failure)
## Just the SVG: 
https://img.shields.io/badge/forkable-no-red.svg
## Markdown: 
[![This repository's forkability could be improved](https://img.shields.io/badge/forkable-no-red.svg)](https://basicallydan.github.io/forkability/?u=basicallydan&r=interfake)
## HTML: 
<a href="https://basicallydan.github.io/forkability/?u=basicallydan&r=interfake"><img alt="This repository's forkability could be improved" src="https://img.shields.io/badge/forkable-no-red.svg"></a>
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

## Badges

Thanks to the generosity of [shields.io](https://shields.io) there is in fact a Forkability badge for your repo. It will be generated in all three APIs, but I'd recommend using the [web app](https://basicallydan.github.io/forkability) for quickest access to the badge code.

*A note of caution*: Although you can easily fake it, it'd be very much against the spirit of Forkability if you either used the pass badge when your repo currently isn't passing, or if you didn't link to the Forkability report. So: please don't do that :smile:

## Contributing

Clone the repo using `git clone git@github.com:basicallydan/forkability.git` or HTTPS if you'd prefer. Once it's downloaded, you can use `make deps` to install dependencies. Use `make help` to see other `makefile` commands available such as `test`, `serve` and `compile` which are all useful for developing and testing new features.

The default `make` task will do the job of resolving dependencies, then testing the code, then compiling the code for the browser.

For more info on contributing to Forkability including guidelines, see [contributing.md](https://github.com/basicallydan/forkability/blob/master/contributing.md).

A key consideration when making contributions is to consider what makes a project forkable; there are many ways to look at a project and thus probably many opinions.

With this in mind we'd like to invite anybody reading this to [open an issue](https://github.com/basicallydan/forkability/issues), and/or make a pull request - pull requests are all the hotness right now - which details in some way what could be done to make this a *more useful tool*.

### Contributors

Thanks to everybody who has helped. So far this includes:

* [@basicallydan](https://github.com/basicallydan)
* [@M-Zuber](https://github.com/M-Zuber)
* [@JJ](https://github.com/JJ)
* [@kirang89](https://github.com/kirang89)
* [@jonfinerty](https://github.com/jonfinerty)
* [@hpoom](https://github.com/hpoom)
* [@matiassingers](https://github.com/matiassingers)
* [@algernon](https://github.com/algernon)
* [@rowanmanning](https://github.com/rowanmanning)
* [@ExcaliburZero](https://github.com/ExcaliburZero)
* [@charlotteis](https://github.com/charlotteis)

## Long-term goals of this project

* Give people a recognisable score for the open-source-friendliness ("forkability") of their project
* Inform people about the open-source movement
* Educate people on the benefits of open-sourcing their code
* Tell people about how they can improve the "forkability" of their project

## Tests

Clone this repo, run `npm install`, then `npm test`.

### Possible domains for this project:

* forkability.org
* forkability.io

## Disclaimer

You should not use forkability as the sole way to judge how forkable your project is. After all, it is not in any way intelligent, it is merely looking for the presence of certain features in your project in order to nudge you in the right direction.

Your best bet to make your project as forkable as possible is to ask your friends, or your friendly neighbourhood open-source community!

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/basicallydan/forkability/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

