import React, { useState, useCallback } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Users, MessageSquare } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const createNewRoom = useCallback((e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('New collaboration room created');
  }, []);

  const joinRoom = useCallback(() => {
    if (!roomId || !username) {
      toast.error('Room ID and username are required');
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: { username },
      replace: true
    });
  }, [roomId, username, navigate]);

  const handleInputEnter = useCallback((e) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  }, [joinRoom]);

  const handleRoomIdChange = useCallback((e) => {
    setRoomId(e.target.value.trim());
  }, []);

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value.trim());
  }, []);

  const storedEmail = localStorage.getItem('email') || 'User';
  const firstName = storedEmail.split('@')[0];

  return (
    <div className="flex min-h-screen bg-[#0A0B0F] text-white">
      

      {/* Right Section - Welcome */}
      <div className="w-1/2 flex justify-center items-center p-12 bg-gradient-to-br from-[#2D2F36] to-[#1A1C23]">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Welcome, <span className="text-[#7C3AED]">{firstName}</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Ready to collaborate and code together? Create a new room or join an existing one.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { 
                icon: <Users className="w-6 h-6 mx-auto text-[#7C3AED]" />, 
                title: "Collaborate" 
              },
              { 
                icon: <MessageSquare className="w-6 h-6 mx-auto text-[#7C3AED]" />, 
                title: "Chat" 
              },
              { 
                icon: <Code2 className="w-6 h-6 mx-auto text-[#7C3AED]" />, 
                title: "Code" 
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-[#1A1C23] p-4 rounded-lg text-center"
              >
                {item.icon}
                <p className="text-sm mt-2">{item.title}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#1A1C23] p-6 rounded-lg"
          >
            <p className="text-gray-300 italic">
              "Collaboration is the essence of innovation. Together, we can create something extraordinary."
            </p>
          </motion.div>
        </motion.div>
      </div>
      {/* Left Section - Room Creation */}
      <div className="w-1/2 flex justify-center items-center bg-[#1A1C23] p-12">
        <div className="w-96 space-y-4">
          <img
            className="mx-auto mb-6 w-40 hover:scale-105 transition-transform"
            src="/code-sync.png"
            alt="CodeSync Logo"
          />
          <h4 className="text-white text-center text-xl font-bold mb-6 tracking-wide">
            Join or Create Collaboration Room
          </h4>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-3 text-white bg-[#2D2F36] border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
              placeholder="Enter Room ID"
              onChange={handleRoomIdChange}
              value={roomId}
              onKeyUp={handleInputEnter}
              autoComplete="off"
            />
            <input
              type="text"
              className="w-full p-3 text-white bg-[#2D2F36] border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
              placeholder="Choose Username"
              onChange={handleUsernameChange}
              value={username}
              onKeyUp={handleInputEnter}
              autoComplete="off"
            />
            <button
              className="w-full p-3 text-white bg-[#7C3AED] rounded-md hover:bg-[#6B21A8] active:scale-95 transition-all duration-200 ease-in-out"
              onClick={joinRoom}
            >
              Join Collaboration Room
            </button>
            <p className="text-gray-400 text-sm text-center">
              No invite?
              <button
                onClick={createNewRoom}
                className="text-[#7C3AED] hover:underline ml-1 focus:outline-none"
              >
                Create New Room
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;