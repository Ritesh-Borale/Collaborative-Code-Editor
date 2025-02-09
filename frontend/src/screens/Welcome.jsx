import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code2, Github, MessageSquare, Sparkles, PenTool, Users } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const features = [
    {
      icon: <Users className="w-6 h-6 text-[#7C3AED]" />,
      title: "Real-time Collaboration",
      description: "Code together seamlessly with your team members in real-time."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-[#7C3AED]" />,
      title: "Integrated Chat",
      description: "Communicate effectively with built-in chat functionality."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#7C3AED]" />,
      title: "AI Assistant",
      description: "Get intelligent code suggestions and assistance powered by AI."
    },
    {
      icon: <PenTool className="w-6 h-6 text-[#7C3AED]" />,
      title: "Whiteboard",
      description: "Visualize ideas with our integrated whiteboard feature."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed w-full z-50 bg-[#0A0B0F]/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 flex items-center space-x-2"
            >
              <Code2 className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold">CodeSync</span>
            </motion.div>
            <div className="flex space-x-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="text-white px-6 py-2"
              >
                Login
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="bg-[#7C3AED] text-white px-6 py-2 rounded-md hover:bg-[#6D28D9] transition-colors"
              >
                Register
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen flex flex-col justify-center items-center text-center"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-6xl md:text-7xl font-bold mb-4 leading-tight"
        >
          Code Together,
          <br />
          <span className="text-[#7C3AED]">Build Together</span>
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="text-xl text-gray-400 max-w-3xl mb-12"
        >
          Experience the future of collaborative coding with real-time editing, integrated chat,
          whiteboard features, and AI-powered assistance.
        </motion.p>
        <motion.div variants={itemVariants} className="flex space-x-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="bg-[#7C3AED] text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-[#6D28D9] transition-colors"
          >
            Get Started
          </motion.button>
          <motion.a
            href="https://github.com/Ritesh-Borale/Collaborative-Code-Editor"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#1A1C23] text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-[#2D2F36] transition-colors flex items-center space-x-2"
          >
            <Github className="w-6 h-6" />
            <span>View on GitHub</span>
          </motion.a>
        </motion.div>

        {/* Code Preview */}
        <motion.div
          variants={itemVariants}
          className="mt-16 w-full max-w-3xl mx-auto bg-[#1A1C23] rounded-lg overflow-hidden shadow-2xl"
        >
          <div className="flex items-center space-x-2 px-4 py-2 bg-[#2D2F36]">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="p-6">
            <pre className="text-left">
              <code>
                <span className="text-pink-500">function</span>{" "}
                <span className="text-blue-400">collaborate</span>() {"{"}
                <br />
                {"  "}<span className="text-pink-500">const</span> team = <span className="text-green-400">'success'</span>;
                <br />
                {"  "}<span className="text-pink-500">return</span> team;
                <br />
                {"}"}
              </code>
            </pre>
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  className="py-24 bg-[#0F1115]"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.h2
      variants={itemVariants}
      className="text-3xl font-bold text-center mb-12"
    >
      Powerful Features for
      <span className="text-[#7C3AED]"> Modern Development</span>
    </motion.h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="p-4 bg-[#1A1C23] rounded-lg hover:shadow-lg transition-shadow text-center"
        >
          <div className="mb-3 p-2 bg-[#2D2F36] rounded-md w-fit mx-auto">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-400 text-sm">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</motion.div>


    </div>
  );
};

export default Welcome;


