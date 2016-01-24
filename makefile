VERSION ?= edge

CFLAGS = -c -g -D $(VERSION)

default: deps test compile

help:
	@echo "  [default]   installs dependencies, tests and compiles for the browser"
	@echo "  deps        install dependencies"
	@echo "  test        runs tests"
	@echo "  compile     builds the JS files for use in the browser"
	@echo "  serve       run the webserver"
	@echo "  shrinkwrap  resets the shrinkwrap.json file"

deps:
	npm install

test:
	npm test

compile:
	./node_modules/.bin/browserify lib/app.js | ./node_modules/.bin/uglifyjs -c > dist/forkability.$(VERSION).min.js
	./node_modules/.bin/browserify lib/app.js > dist/forkability.$(VERSION).js

serve:
	ruby -rwebrick -e'WEBrick::HTTPServer.new(:Port => 3000, :DocumentRoot => Dir.pwd).start'

shrinkwrap:
	rm -rf node_modules/ npm-shrinkwrap.json && npm install && npm shrinkwrap

