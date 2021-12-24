var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appointmentSchema = new Schema({
    patientUsername:{
        type:String,
        required:true
     },
    doctorUsername:{
        type:String,
        required:true
     },
    patient:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'Person'
     },
    doctor:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'Person'
     },
     state:{
        type:String,
        default:"Pending"
     },
     time:{
        type:String
     },
     date:{
        type:String
     },
     problem:{
        type:String
     },
     meetingLink:{
        type:String
     },
     meetingDetails:{
        type:String
     },
     rejectReason:{
      type:String,
      default:"No reason is Mentioned By Doctor."
     },
     prescribed:{
        type:Boolean,
        default:false
     }
   },{
      timestamps:true
});


module.exports = mongoose.model('Appointment',appointmentSchema);