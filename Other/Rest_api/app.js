const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');
const postRouter = require('./Routes/postRoutes');
const authRouter = require('./Routes/auth');

const app = express();

//MiddleWare
// app.use('/',()=>{console.log('hit on /home')});
app.use(bodyParser.json());
app.use('/api/user',authRouter);
app.use('/posts',postRouter);

app.get('/',(req,res,next)=>{
    res.send('We are on Home.');
});

mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true,useUnifiedTopology:true}
)
.then((db)=>{
    console.log("Connected to Server Properly");
},(err)=>{ console.log(err); });

app.listen(3000);

