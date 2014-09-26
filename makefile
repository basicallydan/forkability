VERSION = edge

CFLAGS = -c -g -D $(VERSION)

compile:
	browserify lib/app.js | uglifyjs -c > dist/forkability.$(VERSION).min.js
	browserify lib/app.js > dist/forkability.$(VERSION).js
serve:
	ruby -rwebrick -e'WEBrick::HTTPServer.new(:Port => 3000, :DocumentRoot => Dir.pwd).start'