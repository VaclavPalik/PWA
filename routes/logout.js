/**
 * http://usejsdoc.org/
 */
(function() {
	'use strict';
	let	storage = require('../model/storage');
	exports.handler = function(req, res) {
		if(req.session.user===undefined){
			res.send(JSON.stringify({
				error : "Must be logged in order to reply to logout."
			}));
		}else{
			req.session.user=undefined;
			res.send(JSON.stringify({
				OK : "Sucessfully logged out."
			}));
		}
	}
}());