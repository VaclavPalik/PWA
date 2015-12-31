/**
 * http://usejsdoc.org/
 */
(function() {
	'use strict';
	let	storage = require('../model/storage');
	exports.handler = function(req, res) {
		let	user = storage.User.get(req.body.username);
		if (user === undefined) {
			res.send(JSON.stringify({
				error : "Invalid username or password."
			}));
		} else {
			if(user.password===storage.passwordHash(req.body.password)){
				req.session.user=user;
				res.send(JSON.stringify(user.publicInfo()));
			}else{
				res.send(JSON.stringify({
					error : "Invalid username or password."
				}));
			}
		}
	};
}());