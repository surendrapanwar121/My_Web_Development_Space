const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/shopkart';
const connect = mongoose.connect(url);

connect.then((db)=>{
    console.log('Connected correctly to server ');

    // var newDish = Dishes({
    //     name:"Pizza",
    //     description:"Its Taste is delicious."
    // });
    // newDish.save()

     Dishes.create({
        name:"Pizza",
        description:"Its Taste is delicious."  
     })
    .then((dish)=>{
       console.log('Is Saved \n',dish);
       return Dishes.findByIdAndUpdate(dish._id,{
           $set:{"description":"Its Taste is update"}
       },{
            new:true
       })
        .exec();
    })
    .then((dish)=>{
        console.log(dish);

        dish.comments.push({
            rating:5,
            comment:"nice one",
            author:"Me"
        })
        return dish.save();
    })
    .then((dish)=>{
        console.log(dish);
        return mongoose.connection.close();
    })
    .catch((err)=>{console.log(err)});
})
