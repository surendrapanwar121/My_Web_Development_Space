var express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
var authenticate = require('../authenticate');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get('/', authenticate.verifyUser,function(req, res, next) {
  if(req.user.admin==true){
    User.find({})
    .then((user)=>{
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json')
      res.json(user);
    },(err)=>next(err))
    .catch((err)=>next(err));
  }
  else{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json')
    res.json("You are Not a admin"); 
  }
});

userRouter.post('/signup',(req,res,next)=>{
  User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else{
      if(req.body.firstname)
      user.firstname=req.body.firstname;
      if(req.body.lastname)
      user.lastname=req.body.lastname;
      user.save((err,user)=>{
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type','application/json');
          res.json({err:err});
        }
        passport.authenticate('local')(req,res,()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({ success : true , status:'Registration Successful'});
      });
    });
    }
  })
})

userRouter.post('/login',passport.authenticate('local'),(req,res)=>{
  var token = authenticate.getToken({_id : req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({ success : true , token:token,status:'You are Successfully Loged In!'});
});

userRouter.get('/logout',(req,res,next)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error('You are not loged In');
    err.status = 403;
    next(err);
  }
})

module.exports = userRouter;
