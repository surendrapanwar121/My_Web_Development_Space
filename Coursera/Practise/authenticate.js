var passport = require('passport');
var passportLocal = require('passport-local');
var User = require('./models/user');
var config = require('./config');

var LocalStrategy = passportLocal.Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
const { NotExtended } = require('http-errors');

exports.localbhai =  passport.use(new LocalStrategy(User.authenticate()) );
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    return jwt.sign(user,config.secretKey,{ expiresIn:3600 } );
};

var opts ={};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload,done)=>{
        console.log('Jwt Payloads ',jwt_payload);
        User.findOne({_id:jwt_payload._id},(err,user)=>{
            if(err){
                return done(err,false);
            }
            else if(user){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
        })
    })
    );

exports.verifyUser = passport.authenticate('jwt',{session:false});

exports.verifyAdmin = function(admin){
    if(admin==false){
        // err = new Error("You are Not a admin");
        // err.status = 404;
        // next(err);
        res.statusCode = 404;
        res.setHeader('Content-Type','application/json');
        res.json({err:err});
    }
}
exports.verifyCustomer = function(id1,id2){
    if(id1==id2){
        err = new Error("You are Not allowed to operation with other users comments");
        err.status = 404;
        next(err);
    }
}