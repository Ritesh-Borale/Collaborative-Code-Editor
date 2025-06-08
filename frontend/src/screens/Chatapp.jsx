import React, { useContext, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import toast from 'react-hot-toast';
import { useLocation, useParams } from "react-router-dom";
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket";
import "highlight.js/styles/nord.css";
import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js';
import { SocketContext } from "../context/socket.context";
import { Send, Bot, X } from "lucide-react";


function SyntaxHighlightedCode(props) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current && props.className?.includes('lang-')) {
            hljs.highlightElement(ref.current);
            ref.current.removeAttribute('data-highlighted');
        }
    }, [props.className, props.children]);

    return <code {...props} ref={ref} />;
}

const Chatapp = () => {
    const messageBox = React.createRef();
    const location = useLocation();
    const params = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [currentFile, setCurrentFile] = useState(null);
    const [openFiles, setOpenFiles] = useState([]);
    const [fileTree, setFileTree] = useState({});
    const socketRef = useContext(SocketContext);
    const [connectedUsers, setConnectedUsers] = useState(0);
    const [showAiPrompt, setShowAiPrompt] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');

    useEffect(() => {
        if (socketRef.current) {
            const data = {
                roomId: params.roomId,
                username: location.state?.username,
                currentPage: 'chat'
            };

            sendMessage('join', data);
            
            // toast.success(`${username} joined the Chat room.`);
            receiveMessage('joined', ({roomId, username, clients}) => {
                setConnectedUsers(clients.length);
            });

            receiveMessage('user-disconnected', ({username, clients}) => {
                // toast.success(`${username} left the room.`);
                setConnectedUsers(clients.length);
            });
        }
    }, [params.roomId, socketRef.current]);

    useEffect(() => {
        receiveMessage('chat-message', (data) => {
            if (data.username === 'ai') {
                try {
                    const message = JSON.parse(data.message);
                    const reqSender = data.by;
                    if (message.fileTree) {
                        setFileTree((prevTree) => {
                            const updatedTree = { ...prevTree };
                            Object.keys(message.fileTree).forEach((fileName) => {
                                updatedTree[fileName] = {
                                    ...message.fileTree[fileName],
                                    reqSender,
                                };
                            });
                            return updatedTree;
                        });
                    }
                    setMessages((prev) => [...prev, { username: data.username, message: message }]);
                } catch (e) {
                    console.error("Failed to parse AI message as JSON:", data.message, e);
                    // Fallback: display raw message if JSON parsing fails
                    setMessages((prev) => [...prev, { username: data.username, message: data.message }]);
                }
            } else {
                setMessages((prev) => [...prev, data]);
            }
        });
    }, []);

    useEffect(() => {
        messageBox.current?.scrollTo(0, messageBox.current.scrollHeight);
    }, [messages]);

    const send = () => {
        if (message.trim()) {
            sendMessage('chat-message', {
                roomId: params.roomId,
                username: location.state?.username,
                message,
            });
            setMessage('');
        }
    };

    const handleAiPrompt = () => {
        if (aiPrompt.trim()) {
            const fullPrompt = `@ai ${aiPrompt}`;
            sendMessage('chat-message', {
                roomId: params.roomId,
                username: location.state?.username,
                message: fullPrompt,
            });
            setAiPrompt('');
            setShowAiPrompt(false);
        }
    };

    function WriteAiMessage(message) {
        // Check if message is already an object (parsed JSON) or needs to be parsed
        const messageObject = typeof message === 'string' ? JSON.parse(message) : message;
        return (
            <div className="overflow-auto bg-slate-900 text-white rounded-lg p-4 shadow-lg">
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-slate-900">
            <Sidebar />
            <div className="w-1/4 flex flex-col bg-slate-800 border-r border-slate-700">
                <div className="h-16 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-700">
                    <h1 className="text-xl font-semibold text-white">Chat Application</h1>
                    <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-gray-300">
                        {connectedUsers} online
                    </span>
                </div>
                
                <div className="flex-grow flex flex-col relative">
                    <div
                        ref={messageBox}
                        className="flex-grow overflow-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`max-w-[80%] ${
                                    msg.username === location.state.username ? 'ml-auto' : 'mr-auto'
                                }`}
                            >
                                <div className={`rounded-lg p-3 shadow-md ${
                                    msg.username === location.state.username
                                        ? 'bg-blue-600'
                                        : 'bg-slate-700'
                                }`}>
                                    <div className="text-xs text-slate-300 mb-1">
                                        {msg.username}
                                    </div>
                                    <div className="text-sm text-white">
                                        {msg.username === 'ai' 
                                            ? WriteAiMessage(msg.message) 
                                            : <p>{msg.message}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="p-4 border-t border-slate-700">
                        <div className="flex items-center gap-2">
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                                type="text"
                                placeholder="Type your message..."
                                onKeyPress={(e) => e.key === 'Enter' && send()}
                            />
                            <button
                                onClick={send}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Bot Button and Prompt */}
                <div className="absolute bottom-4 right-4 z-10">
                    {showAiPrompt ? (
                        <div className="bg-slate-800 rounded-lg shadow-lg p-4 w-80 border border-slate-700">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-white font-medium">Ask AI Assistant</h3>
                                <button 
                                    onClick={() => setShowAiPrompt(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <textarea
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                placeholder="Describe your problem..."
                                rows={3}
                            />
                            <button
                                onClick={handleAiPrompt}
                                className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Bot size={18} />
                                <span>Ask AI</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAiPrompt(true)}
                            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            <Bot size={24} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-grow flex">
                <div className="w-64 bg-slate-800 border-r border-slate-700">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Files</h2>
                        <div className="space-y-2">
                            {Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file);
                                        setOpenFiles([...new Set([...openFiles, file])]);
                                    }}
                                    className="w-full p-3 text-left bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                >
                                    <p className="text-sm font-medium text-white">{file}</p>
                                    {fileTree[file]?.reqSender && (
                                        <p className="text-xs text-slate-400 mt-1">
                                            By: {fileTree[file].reqSender}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {currentFile && (
                    <div className="flex-grow flex flex-col">
                        <div className="flex items-center border-b border-slate-700 bg-slate-800">
                            <div className="flex">
                                {openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFile(file)}
                                        className={`px-4 py-2 text-sm font-medium border-r border-slate-700 transition-colors ${
                                            currentFile === file
                                                ? 'bg-slate-700 text-white'
                                                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                    >
                                        {file}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-grow overflow-auto">
                            {fileTree[currentFile] && (
                                <div className="h-full">
                                    <pre className="h-full m-0">
                                        <code
                                            className="hljs h-full outline-none p-4"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const updatedContent = e.target.innerText;
                                                setFileTree({
                                                    ...fileTree,
                                                    [currentFile]: {
                                                        content: updatedContent
                                                    }
                                                });
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: hljs.highlight('javascript', fileTree[currentFile].content).value
                                            }}
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                paddingBottom: '25rem',
                                                counterSet: 'line-numbering',
                                            }}
                                        />
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chatapp;