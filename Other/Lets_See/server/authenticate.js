import passport from 'passport';
import passportLocal from 'passport-local';
var LocalStrategy = passportLocal.Strategy;

import dotenv from "dotenv";
dotenv.config();
import jwt from 'jsonwebtoken';
import User from './models/user.js';

var local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var getToken = function(userId){
    return jwt.sign(userId,process.env.SECRET_KEY,{expiresIn:36000});
};

var checkUser ;
export default local;
export {getToken,checkUser};