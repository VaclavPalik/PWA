'use strict';
/**
 * http://usejsdoc.org/
 */
let storage = require('node-persist');
storage.initSync();

class User {
	constructor(name, password){
		this.name=name;
		this.password=password;
		storage.setItem(User.getStorageKey(name));
	}
	
	static getStorageKey(name){
		return 'User::'+name;
	}
	
	deleteMe(){
		storage.removeItem(User.getStorageKey(this.name));
	}
}

class Post {
	constructor(user, date, text){
		this.user=user;
		this.date=date;
		this.text=text;
	}
}

class ForumThread {
	constructor(name, firstPost){
		this.name=name;
		this.posts[0]=firstPost;
		storage.setItem(ForumThread.getStorageKey(name));
	}
	
	static getStorageKey(name){
		return 'ForumThread::'+name;
	}
	
	deleteMe(){
		storage.removeItem(ForumThread.getStorageKey(this.name));
	}
	
	addPost(post){
		this.posts.push(post);
	}
	
	deletePost(post){
		this.posts.
	}
}