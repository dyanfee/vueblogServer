// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');

var userRouter = require('./routes/users');
var postRouter = require('./routes/posts');
var commentRouter = require('./routes/comments');

var app = express();

// 跨域
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");//预检请求使用
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");//预检请求使用
    next();
});

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', userRouter);
app.use('/api/', postRouter);
app.use('/api/', commentRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
