/**
 * http://usejsdoc.org/
 */
(function() {
	'use strict';
	let	storage = require('../model/storage');
	exports.handler = function(req, res) {
		if(req.session === undefined ||req.session.user===undefined){
			res.send(JSON.stringify({
				error : "Must be logged in order to post a new topic."
			}));
		}else{
			let user = storage.User.get(req.session.user.name);
			let name = req.body.name;
			let now = new Date();
			let message= req.body.message;
			if(storage.ForumThread.get(name)===undefined){
				let post = new storage.Post(user, now, message);
				let topic = storage.ForumThread.createNew(name, post);
				res.send(JSON.stringify(topic.jsonize()));
			}else{
				res.send(JSON.stringify({
					error : "Topic of this name already exists."
				}));
			}
		}
	};
}());