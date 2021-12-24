const express= require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contactDance', {useNewUrlParser: true,useUnifiedTopology: true});
// const fs = require('fs');
const bodyparser= require('body-parser');
const path = require('path');
const app = express();
const port = 80;

//Mongoose 
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    gmail: String,
    address: String
  });
const contact = mongoose.model('contact', contactSchema);

// EXPRESS SPECIFIC STUFF
app.use('/static',express.static('static'));
app.use(express.urlencoded());

// PUG STUFF
app.set('view engine','pug');
app.set('views',path.join(__dirname,'mypugfile'));

//ENDPOINTS
app.get('/',(req,res)=>{
   const obj= { } ;
   res.status(200).render('home.pug',obj);
})
app.get('/contact',(req,res)=>{
   const obj= { } ;
   res.status(200).render('contact.pug',obj);
})
app.post('/contact',(req,res)=>{
    var myData= new contact(req.body);
    myData.save().then(()=>{
        res.send("This data is saved To Database.");
    }).catch(()=>{
    res.status(400).send("This data is not saved To Database.")
    });
    //res.status(200).render('contact.pug');
})
app.get('/login',(req,res)=>{
    const obj= { } ;
    res.status(200).render('login.pug',obj);
 })

//STARTING SERVER
app.listen(port,()=>{
    console.log(` Application Run Successfully on port ${port}`);
})

