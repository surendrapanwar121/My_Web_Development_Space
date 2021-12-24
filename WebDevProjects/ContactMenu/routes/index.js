var express = require('express');
var router = express.Router();
var Person = require('../models/person');

var passport = require('passport');
var authenticate = require('../authenticate');
var cookieParser = require('cookie-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  authenticate.checkUser(req,(err,done)=>{
    if(err){
      next(err);
    }
    else{
      Person.find({name:req.cookies.jwt.name})
      .then((persons)=>{
        res.render('index', { title: 'Contact Menu' ,contacts :persons,name:req.cookies.jwt.name});
        },(err)=>{next(err)})
        .catch((err)=>next(err));
    }
  })
});
router.post('/',(req,res,next)=>{
  // authenticate.checkUser(req.cookies.jwt.token);
  req.body.name=req.cookies.jwt.name;
  Person.create(req.body)
  .then((persons)=>{
    res.redirect('/');
    console.log('Contact Add Successfully',persons);
  },(err)=>{next(err)})
  .catch((err)=>next(err));
});
router.post('/delete', /*authenticate.verifyUser ,*/ (req,res,next)=>{
  console.log('Deleting');
  Person.findByIdAndRemove(req.body.checkbox)
  .then((persons)=>{
    res.redirect('/');
    console.log('Contact Delete Successfully',req.body);
  },(err)=>{next(err)})
  .catch((err)=>next(err));
})
router.post('/delete2', /* authenticate.verifyUser,*/ (req,res,next)=>{
  Person.deleteOne({"number":req.body.number})
  .then((persons)=>{
    res.redirect('/');
    console.log('Contact Delete Successfully',req.body);
  })
})

module.exports = router;
