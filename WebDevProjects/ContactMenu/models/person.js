var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonSchema = new Schema({
    name:{
        required:true,
        type:String
    },
    firstname:{
        required:true,
        type:String
    },
    lastname:{
        required:true,
        type:String
    },
    number:{
        required:true,
        type:String
    }
});

var Person = mongoose.model('contactlist',PersonSchema);

module.exports = Person;