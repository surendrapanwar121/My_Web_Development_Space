var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    patientUsername:{
        type:String,
        required:true
     },
    pharmacistUsername:{
        type:String,
        required:true
     },
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Person'
     },
    pharmacist:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Person'
     },
     deliveryAddress:{
        type:String
     },
     prescription:{
        type:String
     },
     price:{
        type:Number
     },
     state:{
        type:String,
        default:'Pending' 
     },
     deliveryDate:{
      type:String
     },
     visibility:{
      type:String,
      default:'ALL'  
   }

   },{
      timestamps:true
});


module.exports = mongoose.model('Order',orderSchema);