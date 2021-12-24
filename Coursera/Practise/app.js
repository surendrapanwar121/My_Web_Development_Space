const express = require('express');
const logger = require('morgan');
const path = require('path');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

const dishRouter = require('./routes/dishRouter'); 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const connect = mongoose.connect(config.mongoUrl,{ useNewUrlParser: true , useUnifiedTopology: true} );
connect.then((db)=>{
    console.log("Connected to Server Properly");
},(err)=>{ console.log(err); });


const app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.urlencoded({extended : false}));
// app.use(cookieParser('12345-67890-09876-54321'));
app.use(bodyParser.json());

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(express.static(__dirname + '/public'));

app.use('/dishes',dishRouter ); 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

//Error Handler
app.use(function(err,req,res,next){
    //set locals ,only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    //renders the error page
    res.status = (err.status || 500);
    res.render('error');
})


app.listen(3000);