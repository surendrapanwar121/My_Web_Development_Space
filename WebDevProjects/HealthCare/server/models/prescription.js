var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var prescriptionSchema = new Schema({
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
     disease:{
        type:String
     },
     prescription:{
        type:String
     },
     visibility:{
        type:String,
        default:'ALL'
     }
   },{
      timestamps:true
});


module.exports = mongoose.model('Prescription',prescriptionSchema);