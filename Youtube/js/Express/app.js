const path = require('path');
const fs  = require('fs');
const express = require('express');
const app = express();
const port=80;
app.use('/static',express.static('static'));

// set the template engine as pug
app.set('views engine','pug');
// set the views directory
app.set('views',path.join(__dirname,'views'));

const home = fs.readFileSync('./index.html');
const about = fs.readFileSync('./about.html');
const contact = fs.readFileSync('./contact.html');
const services = fs.readFileSync('./services.html');

// Our pug end point
app.get("/demo",(req,res)=>{
  res.status(200).render('demo.pug',{ title:'hey Bro', message:'whats up Bro our first template using pug'});
});
app.get("/",(req,res)=>{
  res.end(home);
});
app.get("/about.html",(req,res)=>{
  res.status(300).end(about);
});
app.get("/contact.html",(req,res)=>{
  res.end(contact);
});
app.get("/services.html",(req,res)=>{
  res.end(services);
});

app.listen(port,()=>{
    console.log(`The application start sucessfully on port ${port}`);
});