import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../config/axios';
import { UserContext } from "../context/user.context";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    function submitHandler(e) {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        
        axiosInstance.post('/users/register', {
            email,
            password
        }).then((res) => {
            console.log(res.data);
            setSuccessMessage("Registration successful! Redirecting to login...");
            
            setEmail("");
            setPassword("");
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        }).catch((err) => {
            console.log(err.response.data);
            setError("Registration failed. Please try again.");
        });
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#2D2F36] to-[#1A1C23]">
            <div className="bg-[#1A1C23] p-8 rounded-2xl shadow-2xl w-96 border border-[#7C3AED]/20">
                <img
                    className="mx-auto mb-6 w-40 hover:scale-105 transition-transform"
                    src="/code-sync.png"
                    alt="CodeSync Logo"
                />
                <h2 className="text-white text-center text-xl font-bold mb-6 tracking-wide">
                    Create Your Account
                </h2>
                
                {successMessage && (
                    <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
                        {successMessage}
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-4">
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        id="email"
                        value={email}
                        className="w-full p-3 text-white bg-[#2D2F36] border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
                        placeholder="Enter your email"
                        autoComplete="off"
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        id="password"
                        value={password}
                        className="w-full p-3 text-white bg-[#2D2F36] border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
                        placeholder="Enter your password"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="w-full p-3 text-white bg-[#7C3AED] rounded-md hover:bg-[#6B21A8] active:scale-95 transition-all duration-200 ease-in-out"
                    >
                        Register
                    </button>
                </form>
                <p className="text-gray-400 text-sm text-center mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#7C3AED] hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;