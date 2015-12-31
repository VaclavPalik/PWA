/**
 * http://usejsdoc.org/
 */
(function() {
	'use strict';
	let	storage = require('../model/storage');
	exports.handler = function(req, res) {
		if(req.session === undefined ||req.session.user===undefined){
			res.send(JSON.stringify({
				error : "Must be logged in order to reply to a topic."
			}));
		}else{
			let user = storage.User.get(req.session.user.name);
			let name = req.body.name;
			let now = new Date();
			let message= req.body.message;
			if(storage.ForumThread.get(name)===undefined){
				res.send(JSON.stringify({
					error : "This topic doesn't exist."
				}));
			}else{
				let post = new storage.Post(user, now, message);
				let topic = storage.ForumThread.get(name);
				topic.addPost(post);
				res.send(JSON.stringify(topic.jsonize()));

			}
		}
	};
}());