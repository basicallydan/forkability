forkability
===========

A JS module for determining the forkability of an open-source GitHub repository.

### Long-term goals:

* Give people a recognisable score for the open-source-friendliness ("forkability") of their project
* Allow this to be used as a command-line tool, web API or HTML website
* Inform people about the open-source movement
* Education people on the benefits of open-source
* Tell people about how they can improve the forkability of their project

### Suggested domains:

* forkability.org
* forkability.io

### Currently supported measures

* Presence of files
  * licence.md
  * readme.md
  * contributing.md
* Warnings issued for:
  * Uncommented issues which were not opened by the owner of the repo

## Tests

Make sure you `npm install -g mocha`, then `npm tests` this repo.

## CLI

```bash
# forkability username/repo, e.g.

forkability basicallydan/interfake

# returns
# ✓ Contributing document
# ✓ Readme document
# ✓ Licence document
# ! Uncommented issue
# └── Media Responses: https://github.com/basicallydan/interfake/issues/19
```

## JS API

```
var forkability = require('./lib/app');
forkability(repoInfo[1], repoInfo[2], function(present, missing, warnings) {
	// present is a list of recommended files that are present in the repo
	// missing is a list of recommended files which are missing from the repo
	// warnings is a list of warnings with a `message` as well as `details` which may include `title` and may include `url`
});
```