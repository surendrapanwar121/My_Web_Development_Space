//Validation
const Joi = require('@hapi/joi');


//Register Validation
const registervalidation  = (data) =>{
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().required().min(7).email(),
        password: Joi.string().required().min(6)
    });
    return  schema.validate(data);
}

//Login Validation
const loginvalidation  = (data) =>{
    const schema = Joi.object({
        email: Joi.string().required().min(7).email(),
        password: Joi.string().required().min(6)
    });
    return  schema.validate(data);
}

module.exports.registervalidation = registervalidation;
module.exports.loginvalidation = loginvalidation;