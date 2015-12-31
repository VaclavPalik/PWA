
/*
 * GET users listing.
 */
(function() {
'use strict';
let storage = require('../model/storage');
exports.list = function(req, res){
	let userlist=[];
	for(let user of storage.users){
		if(user === undefined){
			continue;
		}
		user = storage.User.get(user.name);
		userlist.push(user.publicInfo());
	}
	res.send(JSON.stringify(userlist));
};
}());