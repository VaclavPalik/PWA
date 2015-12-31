
/*
 * GET users listing.
 */

(function() {
	'use strict';
	let	storage = require('../model/storage');
	exports.handler = function(req, res) {
		let topic = storage.ForumThread.get(req.query.topic);
		if(topic===undefined){
			res.send(JSON.stringify({error: "This topic doesn't exist"}));
		}else{
			res.send(JSON.stringify(topic.jsonize()));
		}
	};
}());