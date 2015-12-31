/**
 * http://usejsdoc.org/
 */
(function() {
	'use strict';
	let	storage = require('../../model/storage');
	exports.handler = function(req, res) {
		storage.storage.clear(function(err) {
			res.send(JSON.stringify({
				error : err
			}));
		});
		storage.users.length=0;
		storage.threads.length=0;
		res.send(JSON.stringify({
			OK : "Data cleared."
		}));
	};
}());