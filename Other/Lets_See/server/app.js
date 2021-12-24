import express from 'express';
import axios from 'axios';
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import userRoute from './routes/userRoute.js';
import cors from 'cors';
import passport from 'passport';

dotenv.config();
const app = express();

//Connection to Database
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>{
    console.log('Connected To Server Properly!')
})
.catch((err)=>{console.log(err)})

app.use(express.json()); 
app.use(cors());
app.use(passport.initialize());

app.use('/user',userRoute);



function middleware(req,res,next){
    setInterval(()=>{next();},3000);
}
app.get('/about',middleware,(req,res)=>{
    res.send("About Page");
})


app.listen(4000,()=>{
    console.log('server running successfully on 4000 port');
});