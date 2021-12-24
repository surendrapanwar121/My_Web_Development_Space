var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var schema = mongoose.Schema;
const commentSchema = new schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Person'
    }
},{
    timestamps:true
})

var personSchema = new schema({
    firstname:{
       type:String,
       required:true
    },
    lastname:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    type:{
        type:String
    },
    speciality:{
        type:String
    },
    experience:{
        type:Number
    },
    shopname:{
        type:String
    },
    verified:{
        type:Boolean,
        default:false
    },
    online:{
        type:Boolean,
        default:false
    },
    imgName:{
        type:String
    },
    comments:[commentSchema]
},{
    timestamps:true
});

personSchema.plugin(passportLocalMongoose);
module.exports =  mongoose.model('Person',personSchema);
