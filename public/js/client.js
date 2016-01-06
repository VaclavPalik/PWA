/**
 * http://usejsdoc.org/
 */
let listTopic;
(function() {
	'use strict';
	
	let status={};
	
	function zeroPad(num, places) {
		  let zero = places - num.toString().length + 1;
		  return Array(+(zero > 0 && zero)).join("0") + num;
		}
	
	function myDateFormat(date){
		let dateobj = new Date(date);
		return ""+dateobj.getFullYear()+"-"+(zeroPad(dateobj.getMonth()+1,2))+"-"+zeroPad(dateobj.getDate(),2)+" "+zeroPad(dateobj.getHours(),2)+":"+zeroPad(dateobj.getMinutes(),2);
	}
	
	function getFormData(form){
		return form.serializeArray().reduce((obj, item)=> {
		    obj[item.name] = item.value;
		    return obj;
		}, {});
	}
	
	function cleanError(){
		$("#error-box").hide();
	}
	
	function error(msg){
		$("#error-box").empty();
		$("#error-box").append(msg);
		$("#error-box").show();
	}
	
	function hideModules(){
		$("#module-listTopic").hide();
		$('#module-viewtopic').hide();
	}
	
	function showTopic(data){
		if(data.error===undefined){
			$('#module-viewtopic-inner').empty();
			$('#module-viewtopic-title').empty();
			$('#module-viewtopic-title').append(data.name);
			for(let post of data.posts.reverse()){
				$('#module-viewtopic-inner').append('<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">'+post.user.name+' at '+myDateFormat(post.date)+'</h3></div><div class="panel-body">'+post.text+'</div></div>');
			}
			hideModules();
			status.topic=data.name;
			$('#module-viewtopic').show();
		}else{
			error(data.error);
		}
	}
	
	function viewTopic(topic){
		cleanError();
		$.getJSON('/viewtopic?topic='+topic,(data, textStatus, req)=>{
			showTopic(data);
		});
	}	
	
	listTopic = function listTopic(){
		cleanError();
		$.getJSON("/listTopics", (data, textStatus, req) => {
			$("#module-listTopic-inner").empty();
			for(let topic of data){
				$("#module-listTopic-inner").append('<a href="#" class="list-group-item" id="module-topic-'+$('<div/>').text(topic.name).html()+'-link"><h4 class="list-group-item-heading">'+topic.name+'</h4><p class="list-group-item-text">Started by: '+topic.author.name+' at '+myDateFormat(topic.startedAt)+'</p><p class="list-group-item-text">Last post by: '+topic.lastPostBy.name+' at '+myDateFormat(topic.lastPostAt)+'</p></a>');
				$('#module-topic-'+$('<div/>').text(topic.name).html()+'-link').on('click', (evt)=>{
					evt.preventDefault();
					viewTopic(topic.name);
				});
			}
			hideModules();
			$("#module-listTopic").show();
		});
	};
	
	function login(username, password){
		cleanError();
		$.post("/login", {"username": username, "password": password}, (data, textStatus, req)=> {
			let datajson = JSON.parse(data);
			if(datajson.error===undefined){
				status.user=datajson;
				$("#module-login").hide();
				$("#module-logout-name").empty();
				$("#module-logout-name").append(status.user.name);
				$("#module-logout").show();
				$('#module-listTopic-reply-form').show();
				$('#module-newTopic-form').show();
			}else{
				error(datajson.error);
				
			}
		});
	}
	
	function logout(){
		$.getJSON("/logout", (data, textStatus, req)=> {
			$("#module-login").show();
			$("#module-logout").hide();
			$('#module-listTopic-reply-form').hide();
			$('#module-newTopic-form').hide();
			status.user=undefined;
		});
	}
	
	function reply(){
		cleanError();
		let formData = getFormData($('#module-listTopic-reply-form'));
		$.post('/reply', {name:status.topic,message:formData.text}, (data, textStatus, req)=> {
			let jsonData=JSON.parse(data);
			showTopic(jsonData);
			if(jsonData.error===undefined){
				$('#module-listTopic-reply-text').val('');
			}
		});
	}
	
	function newTopic() {
		cleanError();
		let formData = getFormData($('#module-newTopic-form'));
		$.post('/newTopic', {name:formData.title, message: formData.text}, (data, textStatus, req)=> {
			let jsonData=JSON.parse(data);
			showTopic(jsonData);
			if(jsonData.error===undefined){
				$('#module-newTopic-form-title').val('');
				$('#module-newTopic-form-comment').val('');
			}
		});
	}
	
	$("#module-login-form").on("submit", (evt) => {
		evt.preventDefault();
		let data = getFormData($("#module-login-form"));
		login(data.username, data.password);
	});
	
	$("#module-logout-form").on("submit", (evt) => {
		evt.preventDefault();
		logout();
	});
	
	$('#module-listTopic-reply-form').on("submit", (evt)=>{
		evt.preventDefault();
		reply();
	});
	
	$('#module-newTopic-form').on("submit", (evt)=>{
		evt.preventDefault();
		newTopic();
	});
}());