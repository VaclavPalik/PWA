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
		threads.sort((a, b)=> {
			if(a.lastPostAt>b.lastPostAt){
				return -1;
			}else if(a.lastPostAt<b.lastPostAt){
				return 1;
			}else{
				return 0;
			}
		});
		res.send(JSON.stringify(threads));
	};
}());