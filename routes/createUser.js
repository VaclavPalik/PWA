/**
 * http://usejsdoc.org/
 */
(function() {
	'use strict';
	let	storage = require('../model/storage');
	exports.handler = function(req, res) {
		let	username = req.body.username;
		let	password = req.body.password;
		if (username === undefined || username === "") {
			res.send(JSON.stringify({
				error : "Missing username."
			}));
		} else if (password === undefined || password === "") {
			res.send(JSON.stringify({
				error : "Missing password."
			}));
		} else {
			let	user = storage.User.get(username);
			if (user === undefined) {
				storage.User.createNew(username, storage.passwordHash(password));
				res.send(JSON.stringify({
					OK : "User created."
				}));
			} else {
				res.send(JSON.stringify({
					error : "User of this name already exists."
				}));
			}
		}

	};
}());
