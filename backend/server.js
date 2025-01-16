import http, { createServer } from 'http'
import dotenv from 'dotenv'
import app from './app.js';
import {Server} from 'socket.io'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';


const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'*'
    }
});

server.listen(process.env.PORT,()=>{
    console.log(`Server Running on port ${process.env.PORT}`)
})