var express = require('express');
var router = express.Router();

var authenticate = require('../authenticate');

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log(req.cookies.jwt);
  authenticate.checkUser(req,(err,done)=>{
    if(err)
      res.render('home');
    else{
      if(req.cookies.jwt.type == "PATIENT")
        res.render('Patient/psHome',{title:"Patient Home",username:req.cookies.jwt.username,type:req.cookies.jwt.type});
      else if(req.cookies.jwt.type == "DOCTOR")
        res.render('Doctor/dcHome',{title:"Doctor Home",username:req.cookies.jwt.username,type:req.cookies.jwt.type});
      else if(req.cookies.jwt.type == "PHARMACIST")
        res.render('Pharmacist/phHome',{title:"Pharmacist Home",username:req.cookies.jwt.username,type:req.cookies.jwt.type});
      else if(req.cookies.jwt.type == "ADMIN")
        res.redirect('/admin');
      else{
        var err = new Error('You are not Right User! LogIn Again with right Crendiatials');
        err.status = 403;
        next(err);
      }
    }
  })
});
router.get('/about', function(req, res, next) {
  res.render('about');
});
router.get('/notVerified', function(req, res, next) {
  res.render('notVerified');
});


module.exports = router;
