var mongoose = require("mongoose");
var url = require("../config/db");
mongoose.Promise = global.Promise;

var DB_URL = url.DB_URL;
mongoose.set('useCreateIndex', true)
/**
 * 连接
 */
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

/**
  * 连接成功
  */
db.on('connected', function () {
    console.log('Mongoose connection success to ' + DB_URL);
});

/**
 * 连接异常
 */
db.on('error', function (err) {
    console.log("DB_URL:" + DB_URL);

    console.log('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
db.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});


module.exports = db