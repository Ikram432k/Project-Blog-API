require("dotenv").config();
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../modals/usermodal');
const passportJWT = require('passport-jwt');
const { token } = require('morgan');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;


passport.use(new LocalStrategy((username,password,done)=>{
    User.findOne({username: username},(err,user)=>{
        if(err){
            return done(err);
        }
        if(!user){
            return done(null,false,{
                message:"Invalid Username"
            });
        }
        bcrypt.compare(password,user.password,(err,res)=>{
            if(res){
                return done(null,user);
            }
            else{
                return done(null,false,{
                    message:"Incorrect Password"
                });
            }
        });
    });
}));

passport.use(
    new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET_KEY
    },
    async (token, done)=>{
        try{
            // console.log(token)
            return done(null, token.user);
        }
        catch(error){
            return done(error);
        }
    })
);