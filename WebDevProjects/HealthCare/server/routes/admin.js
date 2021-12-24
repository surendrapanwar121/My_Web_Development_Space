var express = require('express');
var router = express.Router();

var passport = require('passport');
var authenticate = require('../authenticate');
var Person = require('../models/person');

//Authenticate Every Upcoming End Points Request
router.use((req,res,next)=>{
    authenticate.checkUser(req,(err,done)=>{
        if(err)
            return next(err);
    });
    next();
})
//Admin Home Page
router.get('/',(req,res,next)=>{
    res.render('Admin/adHome',{title:"Admin Home",username:req.cookies.jwt.username,type:req.cookies.jwt.type})
})

//List of Dc & Ph for verification
router.get('/ad_Dc&Ph_list',(req,res,next)=>{
    Person.find( { $or :[ {type:"DOCTOR"},{type:"PHARMACIST"} ] , verified:false})
    .then((persons)=>{
        res.render('Admin/ad_Dc&Ph_list',{title:"List of Dc&Ph",persons:persons,username:req.cookies.jwt.username});
    },(err)=>{next(err)})
    .catch((err)=>next(err));
})
//DC | Ph for verification
router.get('/check/:usrname',(req,res,next)=>{
    Person.find({username:req.params.usrname})
    .then((person)=>{
        res.render('Admin/adDcPhCheck',{title:"Client For Verification ",person:person,username:req.cookies.jwt.username});
    },(err)=>{next(err)})
    .catch((err)=>next(err));
})

//To Approve A Dc|Ph
router.get('/approveDcPh/:usrname',(req,res,next)=>{
    Person.findOneAndUpdate({username:req.params.usrname}, 
        {verified:true}, null, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Original Doc : ",docs);
        }
    });
    res.redirect('/admin/ad_Dc&Ph_list');
})

//To Reject A Dc|Ph 
router.get('/rejectDcPh/:usrname',(req,res,next)=>{
    Person.findOneAndRemove({username:req.params.usrname},(err, docs)=>{
        if(err){
            err.status = 500;
            next(err);
        }
        else{
            console.log("Removed User : ", docs);
        }
    })
    res.redirect('/admin/ad_Dc&Ph_list');
})

module.exports = router;