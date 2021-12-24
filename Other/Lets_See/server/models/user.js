import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
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
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    }
})

userSchema.plugin(passportLocalMongoose);
const User =   mongoose.model('user',userSchema);

export default User;