import userModel from "../models/user.model.js";
import * as userService from '../services/user.service.js'
import {validationResult} from 'express-validator'
import redisClient from "../services/redis.service.js";

export const signupController = async (req,res)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try {
        const user = await userService.createUser(req.body); //creating user
        
        const token = await user.generatedJWT();//token for particular user

        res.status(201).json({user,token});

    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const loginController = async (req,res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try {
        const {email,password} = req.body;

        const user = await userModel.findOne({email}).select('+password');

        if(!user){
            return res.status(401).json({
                errors:"invalid Credentials"
            });
        }

        const isValid = await user.isValidPassword(password);
        if(!isValid){
            return res.status(401).json({
                errors:"incorrect password"
            });
        }
        
        const token = user.generatedJWT();

        return res.status(200).json({user,token});

    
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

export const profileController = async (req,res)=>{
    res.status(200).json({msg:"Verified User",user:req.user});
}

export const logoutController = async (req,res)=>{
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).send("unauthorized User");
        }

        redisClient.set(token,'logout','EX',60*60*24);

        return res.status(200).json({
            message :"Log out Successfull"
        })
    } catch (error) {
        return res.status(200).send(error);
    }
}

export const getAllUsersController = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            users: allUsers
        })

    } catch (err) {

        console.log(err)

        res.status(400).json({ error: err.message })

    }
}

