var express = require('express');
var passport = require('passport');
var router = express.Router();

var authenticate = require('../authenticate');
var User = require('../models/user');
var Person = require('../models/person');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup',(req,res,next)=>{
  res.render('signup');
})
router.get('/login',(req,res,next)=>{
  res.render('login');
})
router.post('/signup',(req,res,next)=>{
  User.register(new User({username:req.body.username,firstname:req.body.firstname}),req.body.password,(err,user)=>{
    if(err){
      err.status = 500;
      next(err);
    }
    else{
      if(req.body.lastname)user.lastname=req.body.lastname;
      user.save((err,user)=>{
        if(err){
          err.status = 500;
          next(err);
        }
        passport.authenticate('local')(req,res,()=>{
          var token = authenticate.getToken({_id:req.user._id});
          res.cookie('jwt',{ token:token,name: req.user.firstname},{expire: 360000+Date.now(),httpOnly:true});
          res.redirect('/');
        })
      })
    }
  })
})

router.post('/login',passport.authenticate('local'),(req,res,next)=>{
  // console.log(req.user)
  var token = authenticate.getToken({_id:req.user._id});
  res.cookie('jwt',{ token:token,name: req.user.firstname},{expire: 360000 + Date.now() });
  res.redirect('/');
})

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
