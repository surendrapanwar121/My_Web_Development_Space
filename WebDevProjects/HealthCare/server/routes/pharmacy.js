var express = require('express');
var router = express.Router();

var passport = require('passport');
var authenticate = require('../authenticate');
var Person = require('../models/person');
var Appointment = require('../models/appointment');
var Prescription = require('../models/prescription');
var Order = require('../models/order');
const prescription = require('../models/prescription');
const order = require('../models/order');

//Authenticate Every Upcoming End Points Request
router.use((req,res,next)=>{
    authenticate.checkUser(req,(err,done)=>{
        if(err)
            return next(err);
    });
    next();
})

//Patient Home Page
router.get('/',(req,res,next)=>{
    res.render('Pharmacy/phHome',{title:"Pharmacist Home",username:req.cookies.jwt.username,type:req.cookies.jwt.type});
})


// ORDERS
router.get('/phAllOrders',(req,res,next)=>{
    Order.find({pharmacistUsername:req.cookies.jwt.username})
    .populate('patient')
    .populate('pharmacist') 
    .then((orders)=>{
        res.render('Pharmacy/phAllOrders',{title:"All Orders",username:req.cookies.jwt.username,orders:orders,type:req.cookies.jwt.type});
    },(err)=>{next(err)})
    .catch((err)=>next(err));
})

//Conform Order
//1. For Price and date of order ,Further Details
router.get('/phConfromOrder/:orderId',(req,res,next)=>{
    res.render('Pharmacy/phConformOrder',{title:"Order Further Details",username:req.cookies.jwt.username,type:req.cookies.jwt.type,orderId:req.params.orderId});
})
//2. Psosting  Price and date of order
router.post('/phConfromOrder/:orderId',(req,res,next)=>{
    req.body.state='Waiting for Patient Conformation';
    Order.findByIdAndUpdate(req.params.orderId,{
        $set:req.body
    },{new:true})
    .then((resp)=>{
        res.redirect('/pharmacy/phAllOrders');
    },(err)=>next(err))
    .catch((err)=>next(err));  
})


//Reject Order
router.get('/phRejectOrder/:orderId',(req,res,next)=>{
    req.body.state='Rejected';
    // if(req.body.rejectReason == null)req.body.rejectReason='No reason is Mentioned By Doctor';
    Order.findByIdAndUpdate(req.params.orderId,{
        $set:req.body
    },{new:true})
    .then((resp)=>{
        res.redirect('/pharmacy/phAllOrders');
    },(err)=>next(err))
    .catch((err)=>next(err));  
})

//Changing Order State from on way to delivered
router.get('/phOrderDelivered/:orderId',(req,res,next)=>{
    req.body.state='Delivered';
    // if(req.body.rejectReason == null)req.body.rejectReason='No reason is Mentioned By Doctor';
    Order.findByIdAndUpdate(req.params.orderId,{
        $set:req.body
    },{new:true})
    .then((resp)=>{
        res.redirect('/pharmacy/phAllOrders');
    },(err)=>next(err))
    .catch((err)=>next(err));  
})

//Delete ORDER
router.get('/phDeleteOrder/:orderId',(req,res,next)=>{
    Order.findById(req.params.orderId)
    .then((order)=>{
        if(order.visibility == 'ALL'){
            Order.findByIdAndUpdate(req.params.orderId,{
                $set:{visibility:'PATIENT'}
            },{new:true})
            .then((ok)=>{
                res.redirect('/pharmacy/phAllOrders');
            },(err)=>{next(err)})
            .catch((err)=>next(err));
        }
        else{
            Order.findByIdAndRemove(req.params.orderId)
            .then((ok)=>{
                res.redirect('/pharmacy/phAllOrders');
            },(err)=>{next(err)})
            .catch((err)=>next(err));
        }
    })
})


module.exports = router;