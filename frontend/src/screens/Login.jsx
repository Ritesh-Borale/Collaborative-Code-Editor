import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../context/user.context';
import axiosInstance from '../config/axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    function submitHandler(e) {
        e.preventDefault();
        setError('');
        
        axiosInstance.post('/users/login', {
            email,
            password
        }).then((res) => {
            console.log(res.data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user._id', res.data.user._id);
            localStorage.setItem('email', res.data.user.email);
            navigate('/Home');
        }).catch((err) => {
            setError('Invalid email or password. Please try again.');
            console.log(err.response.data);
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
                    Login to CodeSync
                </h2>
                
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
                        className="w-full p-3 text-white bg-[#2D2F36] border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
                        placeholder="Enter your email"
                        value={email}
                        autoComplete="off"
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        id="password"
                        className="w-full p-3 text-white bg-[#2D2F36] border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
                        placeholder="Enter your password"
                        value={password}
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="w-full p-3 text-white bg-[#7C3AED] rounded-md hover:bg-[#6B21A8] active:scale-95 transition-all duration-200 ease-in-out"
                    >
                        Login
                    </button>
                </form>
                <p className="text-gray-400 text-sm text-center mt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#7C3AED] hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;