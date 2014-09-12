if (typeof XMLHttpRequest !== 'undefined') {
	module.exports = require('browser-request');
} else {
	module.exports = require('request');
}