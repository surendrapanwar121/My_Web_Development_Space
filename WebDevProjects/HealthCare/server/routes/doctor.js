var express = require('express');
var router = express.Router();

var passport = require('passport');
var authenticate = require('../authenticate');
var Person = require('../models/person');
var Appointment = require('../models/appointment');
var Prescription = require('../models/prescription');
const prescription = require('../models/prescription');

//Authenticate Every Upcoming End Points Request
router.use((req,res,next)=>{
    authenticate.checkUser(req,(err,done)=>{
        if(err)
            return next(err);
    });
    next();
})

//Doctor Home Page
router.get('/',(req,res,next)=>{
    res.render('Doctor/dcHome',{title:"Doctor Home",username:req.cookies.jwt.username,type:req.cookies.jwt.type});
})


//Appointments
router.get('/appointments',(req,res,next)=>{
    var username=req.cookies.jwt.username;
    Appointment.find({doctorUsername:username})
    .sort({date: 'desc'})
    .populate('doctor') 
    .populate('patient')
    .then((appointments)=>{
        res.render('Doctor/dcAppointments',{title:"Appointments",appointments:appointments,username:req.cookies.jwt.username,type:req.cookies.jwt.type});
    })
})
//Approve appointment
router.post('/approveAppointment/:appointmentId',(req,res,next)=>{
    req.body.state='Approved';
    Appointment.findByIdAndUpdate(req.params.appointmentId,{
        $set:req.body
    },{new:true})
    .then((resp)=>{
        res.redirect('/doctor/appointments');
    },(err)=>next(err))
    .catch((err)=>next(err));  
})
//Delete appointment
router.get('/deleteAppointment/:appointmentId',(req,res,next)=>{
    Appointment.findByIdAndRemove(req.params.appointmentId) 
    .then((resp)=>{
        res.redirect('/doctor/appointments');
    },(err)=>next(err))
    .catch((err)=>next(err));  
})
//Update appointment
router.post('/updateAppointment/:appointmentId',(req,res,next)=>{
    Appointment.findByIdAndUpdate(req.params.appointmentId,{
        $set:req.body
    },{new:true})
    .then((resp)=>{
        res.redirect('/doctor/appointments');
    },(err)=>next(err))
    .catch((err)=>next(err));  
})
//Reject appointment
router.post('/rejectAppointment/:appointmentId',(req,res,next)=>{
    req.body.state='Rejected';
    if(req.body.rejectReason == null)req.body.rejectReason='No reason is Mentioned By Doctor';
    Appointment.findByIdAndUpdate(req.params.appointmentId,{
        $set:req.body
    },{new:true})
    .then((resp)=>{
        res.redirect('/doctor/appointments');
    },(err)=>next(err))
    .catch((err)=>next(err));  
})
//Done appointment
router.get('/doneAppointment/:appointmentId',(req,res,next)=>{
    req.body.state='Done';
    Appointment.findByIdAndUpdate(req.params.appointmentId,{
        $set:req.body
    },{new:true})
    .then((resp)=>{
        res.redirect('/doctor/appointments');
    },(err)=>next(err))
    .catch((err)=>next(err));  
})

//Approve Improve Reject Further Details
router.get('/AppImpRej/:appointmentId/:no',(req,res,next)=>{
    res.render('Doctor/dcAppImpRej',{title:"Appointment Further Details",username:req.cookies.jwt.username,type:req.cookies.jwt.type,no:req.params.no,appointmentId:req.params.appointmentId});
    console.log(req.params.appointmentId);
    console.log(req.params.no);
})


//Prescription

//GET MAKE PRESCRIPTION
router.get('/makePrescription/:patientId/:appointmentId',(req,res,next)=>{
    console.log(req.params.patientId);
    if(req.params.patientId=='nothing')
        res.render('Doctor/dcMakePrescription',{title:"Make Prescription",username:req.cookies.jwt.username,patientId:req.params.patientId});
    else{
        var username=req.cookies.jwt.username;
        var Doctor;
        Person.findOne({username:username})
        .then((doctor)=>{
            Doctor=doctor;
        },(err)=>{next(err)})
        .catch((err)=>next(err));
    
        var Patient;
        Person.findById(req.params.patientId)
        .then((patient)=>{
            Patient=patient;
        },(err)=>{next(err)})
        .catch((err)=>next(err));
    
        function greet (){
            res.render('Doctor/dcMakePrescription',{title:"Make Prescription",doctor:Doctor,patient:Patient,appointmentId:req.params.appointmentId});
        }
        setTimeout(greet,2000)
    }
})

//SEARCH PATIENT
router.post('/searchPatient',(req,res,next)=>{
    var username=req.body.username;;
    var patientId;
    Person.findOne({username:username})
    .then((patient)=>{
        if(patient){
            patientId=patient._id;
            function greet (){
                res.redirect('/doctor/makePrescription/'+patientId+'/nill');
            }
            setTimeout(greet,2000)
        }
        else 
        res.render('Doctor/dcMakePrescription',{title:"Make Prescription",err:'No Patient Exists With ' +username +' username'});
            // next(new Error('No Patient Exists With ' +username +' username') )
    },(err)=>{next(err)})
    .catch((err)=>next(err));
})
//POST PRESCRIPTION
router.post('/makePrescription/:doctorId/:patientId/:patientUsername/:appointmentId',(req,res,next)=>{
    req.body.doctorUsername= req.cookies.jwt.username;
    req.body.doctor= req.params.doctorId;
    req.body.patientUsername= req.params.patientUsername;
    req.body.patient= req.params.patientId;

    if(req.params.appointmentId !='nill'){
        Appointment.findByIdAndUpdate(req.params.appointmentId,{
            $set:{prescribed:true}
        },{new:true})
        .then((ok)=>{
            console.log(ok);
        },(err)=>{next(err)})
        .catch((err)=>next(err));
    }

    Prescription.create(req.body)
    .then((prescription)=>{
        res.redirect('/doctor/dcPrescription');  
    },(err)=>{next(err)})
    .catch((err)=>next(err));
})

//Get All PRESCRIPTION
router.get('/dcPrescription',(req,res,next)=>{
    Prescription.find({doctorUsername:req.cookies.jwt.username})
    .sort({date: 'desc'})
    .populate('doctor') 
    .populate('patient')
    .then((prescriptions)=>{
        res.render('Doctor/dcPrescription',{title:"All Prescription",username:req.cookies.jwt.username,prescriptions:prescriptions,type:req.cookies.jwt.type});
    },(err)=>{next(err)})
    .catch((err)=>next(err));  
})

//Delete PRESCRIPTION
router.get('/dcDeletePrescription/:prescriptionId',(req,res,next)=>{
    Prescription.findById(req.params.prescriptionId)
    .then((prescription)=>{
        if(prescription.visibility == 'ALL'){
            Prescription.findByIdAndUpdate(req.params.prescriptionId,{
                $set:{visibility:'PATIENT'}
            },{new:true})
            .then((ok)=>{
                res.redirect('/doctor/dcPrescription'); 
            },(err)=>{next(err)})
            .catch((err)=>next(err));
        }
        else{
            //Before Delete Make prescribed of appointment false
            Prescription.findByIdAndRemove(req.params.prescriptionId)
            .then((ok)=>{
                res.redirect('/doctor/dcPrescription'); 
            },(err)=>{next(err)})
            .catch((err)=>next(err));
        }
    })
})


module.exports = router;