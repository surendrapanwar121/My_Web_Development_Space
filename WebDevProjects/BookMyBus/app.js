const express=require('express');
const app=express();
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/PersonDetail',{useNewUrlParser:true,useUnifiedTopology:true});
const path = require('path');
const { stringify } = require('querystring');
const port = 80;

//MONGODB CONNECTIONS
const db=mongoose.connection;
db.on('error',console.error.bind(
    console,'connnection error:'));
db.once('open',function(){
    console.log("we are connected to db bro!");
});

const schema =new mongoose.Schema(
    {
        name:String,
        age:String,
        phone:String,
        address:String,
        gmail:String,
        password:String
    }
);
const kitten=mongoose.model('Detail',schema);

//Express REl STUFF
app.use('/static',express.static('static'));
app.use(express.urlencoded());

//PUG REL STUFF
app.set('view engine','pug');
app.set('views',path.join(__dirname,'mypugfiles'));

//ENDPOINTS
app.get('/',(req,res)=>{
    let obj={};
   res.status(200).render('home.pug',obj);
})
app.get('/joinus',(req,res)=>{
    res.status(200).render('joinus.pug');
})
app.post('/joinus',(req,res)=>{
    kitten.find({gmail:req.body.gmail})
    .then((user)=>{
        if(user==null){
            res.statusCode = 201;
            res.setHeader('Content-Type','Application/json');
            res.end('User is already exists',user);
        }
        else{
            kitten.save()
            .then((user)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','Application/json');
                res.end('User Registered Succesfully'); 
            })
        }
    })
    .catch((err)=>{
        res.statusCode = 201;
        res.setHeader('Content-Type','Application/json');
        res.end('Erroe Ocuurs'); 
    })
});

app.get('/login',(req,res)=>{
    let obj={};
    res.status(200).render('login.pug',obj);
})

//STARTING SERVER
app.listen(port,()=>{
    console.log(` Application Run Successfully on port ${port}`);
})