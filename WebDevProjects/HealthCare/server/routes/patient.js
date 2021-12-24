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
    res.render('Patient/psHome',{title:"Patient Home",username:req.cookies.jwt.username,type:req.cookies.jwt.type});
})

//All Doctor Categories
router.get('/allDcCatg',(req,res,next)=>{
    res.render('Patient/psDcCatg',{title:"HC Docotors By Category",username:req.cookies.jwt.username,type:req.cookies.jwt.type});
})

//All Doctor of Specific Category
router.get('/dc/:Category',(req,res,next)=>{
    Person.find({type:"DOCTOR",verified:"true",speciality:req.params.Category})
    .then((doctors)=>{
        res.statusCode=200;
        res.render('Patient/psDcbyCatg',{title:"HealthCare "+req.params.Category+" Doctors",doctors:doctors,username:req.cookies.jwt.username,type:req.cookies.jwt.type,category:req.params.Category})
    },(err)=>{next(err)})
    .catch((err)=>next(err));
})

//APPOINTMENT SECTION

//Book Appointment        //Pending :-On Later before an appointment we first check if there is already an appointment booked for same patient or any other cases.
router.get('/bookAppointmentforDc/:doctorUsername',(req,res,next)=>{
    Person.find({username:req.params.doctorUsername})
    .then((doctor)=>{
        res.statusCode=200;
        res.render('Patient/psBookAppointment',{title:"HC Book Appointment Of Doctor",username:req.cookies.jwt.username,type:req.cookies.jwt.type,doctor:doctor})
    },(err)=>{next(err)})
    .catch((err)=>next(err));
})
router.post('/bookAppointmentforDc/:doctorUsername',(req,res,next)=>{
    req.body.patientUsername=req.cookies.jwt.username;
    req.body.doctorUsername=req.params.doctorUsername;
    var username=req.cookies.jwt.username;
    var patientId;
    Person.findOne({username:username})
    .then((patient)=>{
        patientId=patient._id;
    },(err)=>{next(err)})
    .catch((err)=>next(err));
    function greet (){
        req.body.doctor=req.body.dcId;
        req.body.patient=patientId;
        Appointment.create(req.body)
        .then((appointment)=>{
            res.redirect('/patient/appointments');
        },(err)=>{next(err)})
        .catch((err)=>next(err));
    }
    setTimeout(greet,1200)
})

//Patient Appointments
router.get('/appointments',(req,res,next)=>{
    Appointment.find({patientUsername:req.cookies.jwt.username}) 
    .sort({date: 'desc'})
    .populate('doctor') 
    .then((appointments)=>{
        res.render('Patient/psAppointments',{title:"HC Patient Appointments",appointments:appointments,username:req.cookies.jwt.username,type:req.cookies.jwt.type})
    })
    .catch((err)=>next(err));  
})
//Delete appointments
router.get('/deleteAppointment/:appointmentId',(req,res,next)=>{
    Appointment.findByIdAndRemove(req.params.appointmentId) 
    .then((resp)=>{
        res.redirect('/patient/appointments');
    },(err)=>next(err))
    .catch((err)=>next(err));  
})


//PRESCRIPTION SECTION

//Get All PRESCRIPTION
router.get('/psPrescription/:pharmacistUsername',(req,res,next)=>{
    console.log(req.params.valueNo);
    Prescription.find({patientUsername:req.cookies.jwt.username})
    .populate('doctor') 
    .populate('patient')
    .then((prescriptions)=>{
        res.render('Patient/psPrescription',{title:"All Prescription",username:req.cookies.jwt.username,prescriptions:prescriptions,pharmacistUsername:req.params.pharmacistUsername,type:req.cookies.jwt.type});
    },(err)=>{next(err)})
    .catch((err)=>next(err));  
})

//Delete PRESCRIPTION
router.get('/psDeletePrescription/:prescriptionId',(req,res,next)=>{
    Prescription.findById(req.params.prescriptionId)
    .then((prescription)=>{
        if(prescription.visibility == 'ALL'){
            Prescription.findByIdAndUpdate(req.params.prescriptionId,{
                $set:{visibility:'DOCTOR'}
            },{new:true})
            .then((ok)=>{
                res.redirect('/patient/psPrescription');
            },(err)=>{next(err)})
            .catch((err)=>next(err));
        }
        else{
            //Before Delete Make prescribed of appointment false
            Prescription.findByIdAndRemove(req.params.prescriptionId)
            .then((ok)=>{
                res.redirect('/patient/psPrescription');
            },(err)=>{next(err)})
            .catch((err)=>next(err));
        }
    })
})

//All Pharmacies
router.get('/allPh/:prescriptionId',(req,res,next)=>{
    Person.find({type:"PHARMACIST",verified:"true"})
    .then((pharmacies)=>{
        res.render('Patient/psAllPh',{title:"HealthCare Pharmacies",pharmacies:pharmacies,prescriptionId:req.params.prescriptionId,username:req.cookies.jwt.username,type:req.cookies.jwt.type})
    },(err)=>{next(err)})
    .catch((err)=>next(err));
})

//MEDICINE ORDERS

//Buy Medicine Through Prescription
router.get('/buyMedicine/:prescriptionId/:pharmacistUsername',(req,res,next)=>{
    var prescription;
    var Pharmacy;

    Prescription.findById(req.params.prescriptionId)
    .populate('doctor') 
    .populate('patient')
    .then((prscn)=>{
        prescription=prscn;
    },(err)=>{next(err)})
    .catch((err)=>next(err));

    Person.findOne({username:req.params.pharmacistUsername})
    .then((pharmacy)=>{
        Pharmacy=pharmacy;
    },(err)=>{next(err)})
    .catch((err)=>next(err));

    function work(){
        res.render('Patient/psBuyMedicine',{title:"Order Medicine",username:req.cookies.jwt.username,prescription:prescription,pharmacy:Pharmacy,type:req.cookies.jwt.type});
    }
    setTimeout(work,1200);
})

//Posting Order
router.post('/orderMedicines/:prescriptionId/:pharmacistId/:pharmacistUsername/:patientId',(req,res,next)=>{
    req.body.patientUsername=req.cookies.jwt.username;
    req.body.patient = req.params.patientId;
    req.body.pharmacistUsername = req.params.pharmacistUsername;
    req.body.pharmacist = req.params.pharmacistId;
    if(req.body.address2)req.body.deliveryAddress = req.body.address2;
    else req.body.deliveryAddress = req.body.address1;
    Order.create(req.body)
    .then((order)=>{
        res.redirect('/patient/psAllOrders');
    },(err)=>{next(err)})
    .catch((err)=>next(err));
})



//All ORDER
router.get('/psAllOrders',(req,res,next)=>{
    Order.find({patientUsername:req.cookies.jwt.username})
    .sort({date: 'asc'})
    .populate('patient')
    .populate('pharmacist') 
    .then((orders)=>{
        res.render('Patient/psOrders',{title:"Patient Orders",username:req.cookies.jwt.username,orders:orders,type:req.cookies.jwt.type});
    },(err)=>{next(err)})
    .catch((err)=>next(err));
})


//Conform Order
router.get('/psConfromOrder/:orderId',(req,res,next)=>{
    req.body.state='On Way';
    req.body.visibility ='ALL';
    Order.findByIdAndUpdate(req.params.orderId,{
        $set:req.body
    },{new:true})
    .then((resp)=>{
        res.redirect('/patient/psAllOrders');
    },(err)=>next(err))
    .catch((err)=>next(err));  
})

//ReOrder Order
router.get('/psRe-Order/:orderId',(req,res,next)=>{
    req.body.state='Pending';
    req.body.visibility == 'ALL';
    Order.findByIdAndUpdate(req.params.orderId,{
        $set:req.body
    },{new:true})
    .then((resp)=>{
        res.redirect('/patient/psAllOrders');
    },(err)=>next(err))
    .catch((err)=>next(err));  
})

//Delete ORDER
router.get('/psDeleteOrder/:orderId',(req,res,next)=>{
    Order.findById(req.params.orderId)
    .then((order)=>{
        if(order.visibility == 'ALL'){
            Order.findByIdAndUpdate(req.params.orderId,{
                $set:{visibility:'PHARMACY'}
            },{new:true})
            .then((ok)=>{
                res.redirect('/patient/psAllOrders');
            },(err)=>{next(err)})
            .catch((err)=>next(err));
        }
        else{
            Order.findByIdAndRemove(req.params.orderId)
            .then((ok)=>{
                res.redirect('/patient/psAllOrders');
            },(err)=>{next(err)})
            .catch((err)=>next(err));
        }
    })
})

module.exports = router;