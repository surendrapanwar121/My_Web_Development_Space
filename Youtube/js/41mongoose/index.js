const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shopkart', {useNewUrlParser: true,useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("We are Connected To DB Bro!!");
  // we're connected!
});

const kittySchema = new mongoose.Schema({
  name: String
});
kittySchema.methods.speak = function () {
  const greeting = "My name is "+this.name
  console.log(greeting);
}
const Kitten = mongoose.model('Kitten', kittySchema);

const  surenkitty= new Kitten({ name: 'SurenKitty' });
//console.log(surenkitty.name); 

surenkitty.save(function (err,surenkitty) {
  if (err) return console.error(err);
  surenkitty.speak();
});

Kitten.find({name:"SurenKitty"},function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
})