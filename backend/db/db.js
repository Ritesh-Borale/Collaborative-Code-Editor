import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()


function connectDB(){
    mongoose.connect(process.env.MONGOURL)
    .then(()=>console.log("Connected to MongoDB"))
    .catch(err => {
        console.log("Error in Db Connection",err);
    })
}

export default connectDB;