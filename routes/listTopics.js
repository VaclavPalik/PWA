/**
 * http://usejsdoc.org/
 */
(function() {
	'use strict';
	let	storage = require('../model/storage');
	exports.handler = function(req, res) {
		let threads = [];
		for(let thread of storage.threads){
			threads.push(storage.ForumThread.get(thread.name).info());
		}
		res.send(JSON.stringify(threads));
	};
}());