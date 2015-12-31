(function() {
	'use strict';
	/**
	 * http://usejsdoc.org/
	 */
	let jsSHA = require("jssha");
	let storage = require('node-persist');
	storage.initSync();
	let threads=storage.getItem("Threads");
	let users=storage.getItem("Users");
	if(threads===undefined){
		threads=[];
	}
	if(users===undefined){
		users=[];
	}
	storage.setItem("Threads", threads);
	storage.setItem("Users", users);
	
	function passwordHash(password){
		let shaObj = new jsSHA("SHA-512", "TEXT");
		shaObj.update(password);
		return shaObj.getHash("HEX");
	}
	
	class User {
		constructor(name, password){
			this.name=name;
			this.password=password;
		}
		
		static createNew(name, password){
			let user = new User(name,password);
			storage.setItem(User.getStorageKey(name),user);
			users.push(user);
			storage.setItem("Users", users);
			return user;
		}
		
		static getStorageKey(name){
			return 'User::'+name;
		}
		
		static get(name){
			let tmpUser = storage.getItem(User.getStorageKey(name));
			if(tmpUser === undefined){
				return undefined;
			}
			return new User(tmpUser.name, tmpUser.password);
		}
		
		deleteMe(){
			storage.removeItem(User.getStorageKey(this.name));
			let index = users.indexOf(this);
			users.splice(index, 1);
			users=storage.getItem("Users");
		}
		
		publicInfo(){
			return {name: this.name};
		}
	}
	
	class Post {
		constructor(user, date, text){
			this.user=user;
			this.date=date;
			this.text=text;
		}
		
		static jsonize(post){
			return {user: User.get(post.user.name).publicInfo(), date:post.date, text: post.text};
		}
	}
	
	class ForumThread {
		constructor(name){
			this.name=name;
			this.posts=[];
		}
		
		static getStorageKey(name){
			return 'ForumThread::'+name;
		}
		
		static get(name){
			let tmpThread = storage.getItem(ForumThread.getStorageKey(name));
			if(tmpThread === undefined){
				return undefined;
			}
			let thread = new ForumThread(name);
			thread.posts=tmpThread.posts;
			return thread;
		}
		
		static createNew(name, firstPost){
			let thread =  new ForumThread(name);
			thread.posts[0]=firstPost;
			storage.setItem(ForumThread.getStorageKey(name),thread);
			threads.push(thread);
			storage.setItem("Threads", threads);
			return thread;
		}
		
		deleteMe(){
			storage.removeItem(ForumThread.getStorageKey(this.name));
			let index = threads.indexOf(this);
			threads.splice(index,1);
			storage.setItem("Threads", threads);
		}
		
		addPost(post){
			this.posts.push(post);
			storage.setItem(ForumThread.getStorageKey(this.name),this);
		}
		
		deletePost(post){
			let index = this.posts.indexOf(post);
			this.posts.splice(index, 1);
			storage.setItem(ForumThread.getStorageKey(this.name),this);
		}
		
		info(){
			return {
				name: this.name, 
				author: User.get(this.posts[0].user.name).publicInfo(), 
				startedAt:this.posts[0].date, 
				lastPostBy: User.get(this.posts[this.posts.length-1].user.name).publicInfo(), 
				lastPostAt:this.posts[this.posts.length-1].date
			};
		}
		
		jsonize(){
			let posts = [];
			for(let post of this.posts){
				posts.push(Post.jsonize(post));
			}
			if(this.name===undefined){
				console.log("undefioned name");
			}
			return {"name": this.name, posts: posts};
		}
	}
	
	exports.threads = threads;
	exports.users=users;
	exports.storage=storage;
	exports.passwordHash=passwordHash;
	exports.User = User;
	exports.Post = Post;
	exports.ForumThread = ForumThread;
}());