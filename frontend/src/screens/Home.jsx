import React, { useState, useCallback } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Users, MessageSquare } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(null); // null, 'create', 'join'
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [workTitle, setWorkTitle] = useState('');

  const handleCreateClick = () => {
    setStep('create');
    setRoomId(uuidV4());
    setUsername('');
    setWorkTitle('');
  };

  const handleJoinClick = () => {
    setStep('join');
    setRoomId('');
    setUsername('');
    setWorkTitle('');
  };

  const handleCreateRoom = useCallback((e) => {
    e.preventDefault();
    if (!roomId || !username || !workTitle) {
      toast.error('All fields are required');
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: { username, isAdmin: true, workTitle },
      replace: true
    });
  }, [roomId, username, workTitle, navigate]);

  const handleJoinRoom = useCallback((e) => {
    e.preventDefault();
    if (!roomId || !username) {
      toast.error('Room ID and username are required');
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: { username, isAdmin: false },
      replace: true
    });
  }, [roomId, username, navigate]);

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
      {/* Left Section - Room Creation/Join */}
      <div className="w-1/2 flex justify-center items-center bg-[#1A1C23] p-12">
        <div className="w-96 space-y-4">
          <img
            className="mx-auto mb-6 w-40 hover:scale-105 transition-transform"
            src="/code-sync.png"
            alt="CodeSync Logo"
          />
          <h4 className="text-white text-center text-xl font-bold mb-6 tracking-wide">
            {step === null && 'Start Collaboration'}
            {step === 'create' && 'Create a New Room'}
            {step === 'join' && 'Join an Existing Room'}
          </h4>
          <div className="space-y-4">
            {step === null && (
              <div className="flex flex-col gap-4">
                <button
                  className="w-full p-3 text-white bg-[#7C3AED] rounded-md hover:bg-[#6B21A8] active:scale-95 transition-all duration-200 ease-in-out"
                  onClick={handleCreateClick}
                >
                  Create Room
                </button>
                <button
                  className="w-full p-3 text-white bg-[#2D2F36] border border-gray-600 rounded-md hover:bg-[#232334] active:scale-95 transition-all duration-200 ease-in-out"
                  onClick={handleJoinClick}
                >
                  Join Room
                </button>
              </div>
            )}
            {step === 'create' && (
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <input
                  type="text"
                  className="w-full p-3 text-white bg-[#2D2F36] border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
                  placeholder="Room ID"
                  value={roomId}
                  onChange={e => setRoomId(e.target.value.trim())}
                  autoComplete="off"
                  readOnly
                />
                <input
                  type="text"
                  className="w-full p-3 text-white bg-[#2D2F36] border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
                  placeholder="Work Title (Subject)"
                  value={workTitle}
                  onChange={e => setWorkTitle(e.target.value)}
                  autoComplete="off"
                />
                <input
                  type="text"
                  className="w-full p-3 text-white bg-[#2D2F36] border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
                  placeholder="Admin Name"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="off"
                />
                <button
                  className="w-full p-3 text-white bg-[#7C3AED] rounded-md hover:bg-[#6B21A8] active:scale-95 transition-all duration-200 ease-in-out"
                  type="submit"
                >
                  Create Room
                </button>
                <button
                  type="button"
                  className="w-full p-2 text-gray-400 hover:text-white text-xs underline"
                  onClick={() => setStep(null)}
                >
                  Back
                </button>
              </form>
            )}
            {step === 'join' && (
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <input
                  type="text"
                  className="w-full p-3 text-white bg-[#2D2F36] border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={e => setRoomId(e.target.value.trim())}
                  autoComplete="off"
                />
                <input
                  type="text"
                  className="w-full p-3 text-white bg-[#2D2F36] border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
                  placeholder="Enter Your Name"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="off"
                />
                <button
                  className="w-full p-3 text-white bg-[#7C3AED] rounded-md hover:bg-[#6B21A8] active:scale-95 transition-all duration-200 ease-in-out"
                  type="submit"
                >
                  Join Room
                </button>
                <button
                  type="button"
                  className="w-full p-2 text-gray-400 hover:text-white text-xs underline"
                  onClick={() => setStep(null)}
                >
                  Back
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;