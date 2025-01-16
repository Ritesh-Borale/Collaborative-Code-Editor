
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js'
import connectDB from './db/db.js';
connectDB();

const app = express();

//Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.end("Hello from server")
})

app.use('/users',userRouter);


export default app;