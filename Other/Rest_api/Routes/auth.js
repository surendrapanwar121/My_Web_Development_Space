const authRouter = require('express').Router();
const User = require('../models/user');
const {registervalidation} = require('../validation');

authRouter.route('/register')
    .post((req, res, next) => {

        //Lets Validate the data before we make a user
        const {error}=registervalidation(req.body);
        if(error)return res.status(400).send(error.details[0].message);
        
        //Checking if email already exists than we do not allow user to register 
        User.findOne({email:req.body.email})
        .then((data)=>{
            return res.status(400).send('This email ' + data.email + ' already exists');
        })

        User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        })
        .then((user)=>{
            res.json(user);
        })
        .catch((err)=>{console.log(err)});
    })



    .get((req, res, next) => {
        User.find({})
            .then((user) => {
                res.json(user);
            })
            .catch((err) => { console.log(err) });
    })

authRouter.route('/register/:userId')
    .get((req, res, next) => {
        User.findById(req.params.userId)
            .then((user) => {
                res.json(user);
            })
            .catch((err) => { console.log(err) });
    })
    .patch((req, res, next) => {
        User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true })
            .then((user) => {
                res.json(user);
            })
            .catch((err) => { console.log(err) });
    })
    .delete((req, res, next) => {
        User.remove({ name: req.params.userId })
            .then((user) => {
                res.json(user);
            })
            .catch((err) => { console.log(err) });
    })

// authRouter.route('/login')

module.exports = authRouter;