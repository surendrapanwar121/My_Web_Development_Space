var express = require('express');
var router = express.Router();

var fs  = require('fs');
var path = require('path');

var passport = require('passport');
var authenticate = require('../authenticate');
var Person = require('../models/person');
var upload = require('../multerConfig');

/* GET users listing. */

//LogIn For All
router.get('/login',(req,res,next)=>{
  res.render('loginSignup/login')
})

//SignUp For Patient
router.get('/loginSignup/ps',(req,res,next)=>{
  res.render('loginSignup/signps')
})
//SignUp For Doctor
router.get('/loginSignup/dc',(req,res,next)=>{
  res.render('loginSignup/signdc')
})
//SignUp For Pharmacist
router.get('/loginSignup/ph',(req,res,next)=>{
  res.render('loginSignup/signph')
})


/* POST users listing. */

//SignUp For Patient
router.post('/loginSignup/ps',upload.single('image'),(req,res,next)=>{
  var Persons=new Person({email: req.body.email, username : req.body.username, firstname:req.body.firstname,
    lastname:req.body.lastname, number:req.body.number, age:req.body.age, address:req.body.address,
    verified:"true", type:"PATIENT"
  });
  Person.register(Persons,req.body.password,(err,person)=>{
    if(err){
      err.status = 500;
      next(err);
    }
    else{
      passport.authenticate('local')(req,res,()=>{
        var token = authenticate.getToken({_id:req.user._id});
        res.cookie('jwt',{ token:token,username: req.user.username ,type:req.user.type},{expire: 360000+Date.now(),httpOnly:true});
        res.redirect('/patient');
      })
    }
  })
})

//SignUp For Doctor
router.post('/loginSignup/dc',upload.single('image'),(req,res,next)=>{
  console.log(req.file);
  console.log(req.body);
  var Persons=new Person({email: req.body.email, username : req.body.username, firstname:req.body.firstname,
    lastname:req.body.lastname, number:req.body.number, age:req.body.age, address:req.body.address,
    verified:"false", type:"DOCTOR" ,experience:req.body.experience ,speciality:req.body.speciality,
    imgName :  req.file.filename
  });
  Person.register(Persons,req.body.password,(err,person)=>{
    if(err){
      err.status = 500;
      next(err);
    }
    else{
      passport.authenticate('local')(req,res,()=>{
        var token = authenticate.getToken({_id:req.user._id});
        res.cookie('jwt',{token:token,username: req.user.username ,type:req.user.type},{expire: 360000+Date.now(),httpOnly:true});
        res.redirect('/notVerified');
      })
    }
  })
})

//SignUp For Pharmacist
router.post('/loginSignup/ph',upload.single('image'),(req,res,next)=>{
  var Persons=new Person({email: req.body.email, username : req.body.username, firstname:req.body.firstname,
    lastname:req.body.lastname, number:req.body.number, age:req.body.age, address:req.body.address,
    verified:"false", type:"PHARMACIST" ,shopname:req.body.shopname, imgName :  req.file.filename
  });
  Person.register(Persons,req.body.password,(err,person)=>{
    if(err){
      err.status = 500;
      next(err);
    }
    else{
      passport.authenticate('local')(req,res,()=>{
        var token = authenticate.getToken({_id:req.user._id});
        res.cookie('jwt',{token:token,username: req.user.username ,type:req.user.type},{expire: 360000+Date.now(),httpOnly:true});
        res.redirect('/notVerified');
      })
    }
  })
})
4 
//LogIn For All
router.post('/login',passport.authenticate('local'),(req,res,next)=>{
  var token = authenticate.getToken({_id:req.user._id});
  res.cookie('jwt',{ token:token,username: req.user.username,type:req.user.type},{expire: 2 + Date.now() });

  if(req.user.type == "PATIENT")
  res.redirect('/patient');
  else if(req.user.type == "DOCTOR"){
    if(req.user.verified)
      res.redirect('/doctor');
    else
      res.redirect('/notVerified');
  }
  else if(req.user.type == "PHARMACIST"){
    if(req.user.verified)
      res.redirect('/pharmacy');
    else
      res.redirect('/notVerified');
  }
  else if(req.user.type == "ADMIN")
    res.redirect('/admin');
  else{
    var err = new Error('You are not Right User! LogIn Again with right Crendiatials');
    err.status = 403;
    next(err);
  }
})

// LogOut For All
router.get('/logout',(req,res,next)=>{
  if(req.cookies.jwt){
    console.log('deleting cookies')
    res.clearCookie('jwt');
    res.redirect('/');
  }
  else{
    var err = new Error('You are not loged In');
    err.status = 403;
    next(err);
  }
})
module.exports = router;
