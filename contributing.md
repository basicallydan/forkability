# Contributing to Forkability

Some of the things a would-be contributor might want to do are:

1. [Raise a bug report](#raising-a-bug-report)
2. [*Request* support for a language](#requesting-language-support)
3. [*Add* support for a language](#adding-language-support) (you get any awesome points for doing this)
4. [Contribute actual code](#contributing-code)
5. [Raise an issue with what makes a project forkable at all](#suggesting-general-changes)

But first, the golden rule:

## The golden rule of pull requests

If you're going to make a pull request, make sure you've done two things before making it:

1. You've run `npm test` to ensure that you haven't broken anything. Any pull requests which have caused tests to fail will probably be rejected.
2. You've written tests to cover your additions, and that includes, where possible, testing bug fixes.

## Raising a bug report

If in your use of the program you find something that looks unexpected or broken, take the following steps:

1. Go to the [issues page](https://github.com/basicallydan/forkability/issues)
2. Search for a similar issue
	* If you've found it, put a :+1: to say you've found it
	* [Consider Contributing actual code](#contributing-code) to fix the problem
	* Stop here :smile:
3. If the issue hasn't been raised before, [raise it](https://github.com/basicallydan/forkability/issues/new), and be as detailed as you possibly can. Were you using the JavaScript module? Or were you using forkability on the command line? Or was it perhaps on the web app? What is your computer's operating system? As much detail as possible makes it easier to fix bugs.

Forkability should undergo frequent reviews to keep up with opinion about what makes an open-source project forkable.

## Requesting language support

It would be absolutely brilliant if all the programming languages and their various platforms could be covered by Forkability for linting. So, if there's a language you'd like to see covered which isn't covered yet, you could [open an issue](https://github.com/basicallydan/forkability/issues) to request it. Hopefully somebody will pick it up! If you could provide some information about the kinds of features that an open-source project in your chosen language should have, that would be extra helpful.

The most helpful thing you could do, however, is...

## Adding language support

Currently, language support covers checking the contents of the file tree at the root of the repository in it's state at the most recent commit. To see more about how it works, see the [lintFiles.test.js](https://github.com/basicallydan/forkability/blob/master/lib/lintFiles.js).

However, just to add support, you just need to follow these steps:

### Create a file for your language
Let's say for the example that it's Ruby (it's just an example so don't read too much into it). In here we're going to put feature tests, essentially checking for the existence - or lack of existence - of files in the repo.

Put that file in `lib/langs` with the lower-case, space-free version of the name.

```js
module.exports = {
	// The human-readable name should go here
	name: 'Ruby',
	files: {
		// The simplest thing is to check for the existence of a file using a regular expression
		'gemfile':/^gemfile/i,
		// You can also test against the type (blob for file or tree for folder)
		'bin folder': {
			path: /^bin/i,
			type:'tree'
		},
		// And you can check for the *lack* of existence of a file or folder with shouldExist = false
		'No .sass_cache folder': {
			path: /^\.sass_cache/i,
			shouldExist: false,
			type:'tree'
		}
	}
};
```

### Add language to languages file
Include the file in `lib/languages.js` so it can be used by Forkability.

### Write tests to make sure your feature tests continue to work
You can follow the examples in `spec/langs` for this. Remember, you need to write a test for this AND check that existing tests do not fail before making a pull request. Very important!

## Contributing code

In general, I am open to anybody wishing to improve Forkability, either in terms of code or features, so if you'd like to make a pull request please do - just remember to follow [the golden rule](#the-golden-rule-of-pull-requests) and write tests for your changes first.

## Suggesting general changes

The nature of this project means that it is opinionated. However, the nature of open-source means that a general community consensus about what makes a good open source project is preferable to a single person's ideas. So if you disagree with anything, feel free to open a new issue about it for discussion.
