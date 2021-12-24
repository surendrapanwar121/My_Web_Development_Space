// var express = require('express');
// const bodyParser = require('body-parser');
// var User = require('../models/user');

// var router = express.Router();
// router.use(bodyParser.json());

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// router.post('/signup',(res,req,next)=>{
//   console.log(req.body.username +' hello ');
//   User.findOne({username : req.body.username})
//   .then((user)=>{
//     if(!user){
//       return User.create({ 
//         username : req.body.username ,
//         password : req.body.password});
//     }
//     else{
//       var err = new Error('User '+ req.body.username + ' Username already exists')
//       err.status = 
//       res.statusCode = 200;
//       next(err);
//     }
//   })
//   .then((user)=>{
//     res.statusCode = 200;
//     res.setHeader('Content-Type','application/json');
//     res.json({status : 'Registration Successful', user : user});
//   })
//   .catch((err)=>next(err));
// })

// router.post('/login',(res,req,next)=>{
//   console.log(req.body.username +' hello ');
//   if(!req.session.user){
//     User.find({username:req.body.username})
//     .then((user)=>{
//       if(!user){
//         res.statusCode = 200;
//         res.setHeader('Content-Type','application/json');
//         res.json(req.body.username + ' Username does not exists');
//       }
//       else if(user.password!=req.body.password){
//         res.statusCode = 200;
//         res.setHeader('Content-Type','application/json');
//         res.json(' Password are wrong');
//       }
//       else{
//         req.session.user = 'okbro';
//         next();
//       }
//     })
//   }
//   else if(req.session.user!='okbro'){
//     res.statusCode = 200;
//     res.setHeader('Content-Type','application/json');
//     res.json(' Wrong Session');
//   }
//   else{
//     next();
//   }
// })

// router.post('/logout',(res,req,next)=>{

// })

// module.exports = router;



var express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
var authenticate = require('../authenticate');
var passport = require('passport');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get('/',authenticate.verifyUser, function(req, res, next) {
  authenticate.verifyAdmin(req.user.admin);
  User.find({})
  .then((user)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(user);
  },(err)=>next(err))
  .catch((err)=>next(err));
});

userRouter.post('/signup',(req,res,next)=>{
  User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
    if(err){
      res.statusCode = 404;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else{
      if(req.body.firstname)
        user.firstname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err,user)=>{
        if(err){
          res.statusCode = 404;
          res.setHeader('Content-Type','application/json');
          res.json({err:err});
          return ;
        }
        passport.authenticate('local')(req,res,()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({success:true,status:'Registration Successful'});
        });
      })
    }
  });
});

userRouter.route('/login')
.post(passport.authenticate('local'),(req,res)=>{

  var token = authenticate.getToken({_id:req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success:true,token:token,status:'You are Loged In Successful !'});
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
