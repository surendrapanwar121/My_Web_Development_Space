var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var mongoose= require('mongoose');
var config = require('./config');

const connect= mongoose.connect(config.mongoUrl,{useNewUrlParser: true,useUnifiedTopology: true});
connect.then((db)=>{
   console.log('Connected To Server Properly');
},(err)=> {console.log(err)} );

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use((req,res,next)=>{
  // if(req.cookies.jwt){
  //   req.setHeader('Authorization', 'Bearer req.cookies.jwt.token'); 
  //   console.log(req.cookies.jwt);
  //   next()
  // }
  // else{
  //   var err = new Error('You are not LogedIn ! Please LogIN To Views Your Contacts');
  //   err.status = 401;
  //   next(err);
  // }
  // console.log(req.cookies.jwt);
  next();
})


app.use('/', indexRouter);
app.use('/users', usersRouter);

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
app.listen(3000);