var passport = require('passport');
var passportLocal = require('passport-local');
var LocalStrategy = passportLocal.Strategy;

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

const User = require('./models/user');
var cookieParser = require('cookie-parser');
var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(userId){
    return  jwt.sign(userId,config.secretKey,{expiresIn:3600});
};

var opts ={};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken;
opts.secretOrKey = config.secretKey;

exports.JwtStrategy = passport.use(new JwtStrategy(opts,
    (jwt_payload,done)=>{
        console.log('Jwt Payload ',jwt_payload);
        User.findById(jwt_payload._id)
        .then((user)=>{
            if(user)return done(null,user);
            else return done(null,false);
        })
        .catch((err)=>{
            return done(err,false);
        })
}))

exports.verifyUser = passport.authenticate('jwt',{session:false});

exports.checkUser = function(req,callback){
    if(!req.cookies.jwt){
        var err = new Error('You are not LogedIn ! Please LogIN To Views Your Contacts');
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

// const checkUser = function(req,res,next){
//     if(!req.cookies){
//         var err = new Error('Please LogIn To See Your Contacts');
//         next(err);
//     }
//     const token = req.cookies.jwt.token;
//     jwt.verify(token,config.secretKey,(err,ok)=>{
//         if(err){
//             res.status(401).send(err);
//         }
//         else{
//             console.log(ok);
//             next();
//         }
//     });
// }


// const checkUser = async (req,res,next)=>{
//     try{
//         const token = req.cookies.jwt.token;
//         const personData = jwt.verify(token,config.secretKey);
//         console.log(personData);

//     }catch(error){
//         next(error);
//     }
// }

// module.exports = checkUser;