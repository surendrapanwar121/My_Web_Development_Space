import express from 'express';
import axios from 'axios';
import User from '../models/user.js';

import passport from 'passport';
import local ,{getToken,checkUser} from '../authenticate.js';
const router = express.Router();

router.get('/all',(req,res,next)=>{
    User.find({})
    .then((users)=>{
        console.log('Request for All Users');
        res.json(users);
    })
    .catch((err)=>{console.log(err)})
})

router.post('/signup',(req,res,next)=>{
    console.log(req.body);
    var Users = new User({username:req.body.username,firstname:req.body.firstname,lastname:req.body.lastname,
        email:req.body.email,number:req.body.number,address:req.body.address,city:req.body.city,zip:req.body.zip,
        state:req.body.state
    });
    User.register(Users,req.body.password,(err,user)=>{
        if(err){
            err.status = 500;
            res.json(err);
        }
        else{
            passport.authenticate('local')(req,res,()=>{
                var token = getToken({_id:req.user._id});
                res.cookie('jwt',{token:token,username:req.user.username});
                res.json({token:token,username:req.user.username});
            })
        }
    })
})

router.post('/login',passport.authenticate('local'),(req,res,next)=>{
    console.log(req.body);
    var token = getToken({_id:req.user._id});
    res.cookie('jwt',{token:token,username:req.user.username});
    res.json({token:token,username:req.user.username});
})

export default router;