const User = require("../modals/usermodal");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.signIn = [

body('username').trim().isLength({min:2})
.custom( async(username) =>{
    try{
        const alreadyExists = await User.findOne({username: username});
        if(alreadyExists){
            throw new Error('Username already exists')
        }
    }catch(err){
        throw new Error(err);
    }
}),
body('password').trim().isLength({min:6}).withMessage('Password must be 6 characters long'),
body('confirmPassword').custom( async(value,{req})=>{
    if(value!=req.body.password){
        throw new Error('Password does not match');
    }
    return true;
}),
async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(403).json({
            username: req.body.username,
            error: errors.array()
        });
    }
    bcrypt.hash(req.body.password, 12, (err,hashpassword)=>{
        if(err) return next(err);
        const user = new User({
            username: req.body.username,
            password: hashpassword
        })
        user.save(err =>{
            if(err){
                return next(err);
            }
            res.status(200).json({
                message: 'User created successfully'
            });
        })
    })
}
];


exports.Login =(req,res)=>{
    res.send("not implemented");
}

exports.userLogout =(req,res)=>{
    res.send("not implemented");
}