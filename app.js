"use strict";
/**
 * Module dependencies.
 */

var express = require('express')
  , user = require('./routes/user')
  , createUser = require('./routes/createUser')
  , newTopic = require('./routes/newTopic')
  , devClearData = require('./routes/dev/clearData')
  , login = require('./routes/login')
  , viewtopic = require('./routes/viewtopic')
  , listTopics = require('./routes/listTopics')
  , logout = require('./routes/logout')
  , reply = require('./routes/reply')
  , http = require('http')
  , path = require('path')
  , session = require('express-session')
  , bodyParser = require('body-parser');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(session({ secret: 'keyboard cat',
	resave: false,
	saveUninitialized:false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(app.router);

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
  app.get('/dev/clearData',devClearData.handler);
}

app.get('/users', user.list);
app.get('/viewtopic', viewtopic.handler);
app.get('/listTopics', listTopics.handler);
app.get('/logout', logout.handler);
app.post('/createUser', createUser.handler);
app.post('/login',login.handler);
app.post('/newTopic',newTopic.handler);
app.post('/reply',reply.handler);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
