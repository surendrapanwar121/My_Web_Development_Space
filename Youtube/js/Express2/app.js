const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 80;

// EXPRESS SPECIFIC STUFF
app.use('/static',express.static('static'));
app.use(express.urlencoded());

// PUG SPECIFIC STUFF
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

//ENDPOINTS
app.get('/',(req,res)=>{
    const tit='This IS My Title';
    const obj={'title':tit,'content':'This IS My Content'};
    res.status(200).render('index.pug',obj);
})
app.post('/',(req,res)=>{
    //console.log(req.body);
    let name = req.body.name;
    let age = req.body.age;
    let gender = req.body.gender;
    let address = req.body.textarea;
    const str =`The Name of Client is ${name} and age is ${age} and gender is ${gender} and Address is ${address} . `;
    fs.writeFileSync('output.txt',str);
    const obj={'message':'Your Form submitet Successfully'};
    res.status(200).render('index.pug',obj);
})

//START THE SERVER
app.listen(port,()=>{
    console.log(`The application is listen on port 80`);
})