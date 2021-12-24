var createError = require('http-errors');
var express = require('express');
var fs  = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var homeRouter = require('./routes/home');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var patientRouter = require('./routes/patient');
var doctorRouter = require('./routes/doctor');
var pharmacyRouter = require('./routes/pharmacy');

var app = express();

//Creating MongoDb Server
var mongoose = require('mongoose');
var config = require('./config');
const connect = mongoose.connect(config.mongoUrl,{useNewUrlParser: true,useUnifiedTopology: true});
connect.then((db)=>{
  console.log('Connected To Server Properly');
},(err)=> {console.log(err)})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', homeRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/patient', patientRouter);
app.use('/doctor', doctorRouter);
app.use('/pharmacy',pharmacyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
app.listen('5000',()=>{
  console.log('Connected To Server Properly!!!');
})