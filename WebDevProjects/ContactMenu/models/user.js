var mongoose = require('mongoose');
var schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        default:''
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user',userSchema);