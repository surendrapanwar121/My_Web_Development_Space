var passport = require('passport');
var passportLocal = require('passport-local');
var LocalStrategy = passportLocal.Strategy;

// var JwtStrategy = require('passport-jwt').Strategy;
// var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');
const User = require('./models/person');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(userId){
    return jwt.sign(userId,config.secretKey,{expiresIn:360000});
};

exports.checkUser = function(req,callback){
    if(!req.cookies.jwt){
        var err = new Error('You are not LogedIn ! Please LogIN To View This PAGE!');
        err.status = 401;
        callback(err,null);
        return ;
    }
    jwt.verify(req.cookies.jwt.token,config.secretKey,(err,ok)=>{
        if(err){
            err.status = 401;  
            callback(err,null);  
        }                       
        else callback(null,ok);
    })
}

