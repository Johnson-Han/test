var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var upload = require('./routes/upload');
// var admin = require('./routes/admin');

var app = express();
app.use(session({ 
  resave: true,  // 新增
  saveUninitialized: true,
  
  secret: 'secret',
	cookie:{ 
		maxAge: 1000*3000
	}
}));

app.use(function(req, res, next){ 
res.locals.session = req.session;
next();
});  //这段代码是用来解决前端html页面也能读取到session的

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/bower_components')));
app.use(express.static(path.join(__dirname, 'public/documents')));
app.use(express.static(path.join(__dirname, 'public/samples')));

app.use('/', index);
app.use('/upload', upload);
// app.use('/admin', admin); // 即为为路径 /users 设置路由


var auth = function (req,res,next){
   console.log('auth');
   if(true){
	  res.send({ some: 'json' }); 
   }
   next();
}
app.use('/au', auth, function(req, res,next) {
    console.log("登录成功")
    res.redirect("/login");
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.all('*',function (req, res, next) {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

if (req.method == 'OPTIONS') {
res.send(200); 
}
else {
next();
}
});

module.exports = app;
