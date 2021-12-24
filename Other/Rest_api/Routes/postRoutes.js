const express = require('express');
const postModel = require('../models/postModel');
const postRouter = express.Router();

//Get All Posts that are submitted by post method
postRouter.route('/')
.get((req,res,next)=>{
    postModel.find({})
    .then(datas=>{
        res.json(datas);
    })
    .catch(err=>{
        res.json({message:err});
    })
})
.post((req,res,next)=>{
    const post = new postModel({
        title:req.body.title,
        description:req.body.description
    })
    post.save()
    .then(data=>{
        res.json(data);
    })
    .catch(err=>{
        res.json({message:err});
    })
});

postRouter.route('/:postId')
.get((req,res,next)=>{
    postModel.find({title:req.params.postId})
    .then(datas=>{
        res.json(datas);
    })
    .catch(err=>{
        res.json({message:err});
    })
})
.delete((req,res,next)=>{
    postModel.remove({_id:req.params.postId})
    .then(data=>{
        res.json(data);
    })
    .catch(err=>{
        res.json({message:err});
    })
})
.patch((req,res,next)=>{
    postModel.updateOne({_id:req.params.postId},{$set:{title:req.body.title}})
    .then(data=>{
        res.json(data);
    })
    .catch(err=>{
        res.json({message:err});
    })
})

module.exports = postRouter;