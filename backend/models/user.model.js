import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const userSchema = new mongoose.Schema({
    email :{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength : [6,"Email must be atleast 6 characters long"],
        maxLength : [50,"Email Should not exceed 50 characters"],
    },
    password:{
        type:String,
        required:true,
        select:false,
    }
},{timestamps:true});


//Tied to the model itself
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password,10);
}

//Tied to a particular instance of that model ( user document ) 
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password,this.password);
}

//Generate JWT token
userSchema.methods.generatedJWT = function (){
    return jwt.sign(
        {email:this.email},
        process.env.JWT_SECRET,
        {expiresIn:'24h'}
    );
}

const User = mongoose.model('user',userSchema);

export default User;