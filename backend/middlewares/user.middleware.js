import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import redisClient from '../services/redis.service.js';

export const authUser = async (req, res, next) => {

    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).send("unauthorized User");
        }
        
        const isBlacklisted = await redisClient.get(token);
        if(isBlacklisted){
            res.cookie('token','');
            return res.status(401).send({err:"unauthorized User"});
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode);
        req.user = decode;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({error:"unauthorized User"});
    }

}
