import React, { useState, useRef, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import 'remixicon/fonts/remixicon.css';
import { UserContext } from '../context/user.context';
import Editor from '../components/Editor';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket';
import { SocketContext } from '../context/socket.context';

const EditorPage = () => {
    const socketRef = useContext(SocketContext);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const codeRef = useRef(null);
    const { allFiles, setAllFiles, fileContents, setFileContents } = useContext(UserContext);
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (socketRef.current) {
            const data = {
                roomId: params.roomId,
                username: location.state?.username,
                isAdmin: location.state?.isAdmin || false,
                currentPage: 'editor'
            };
            
            sendMessage('join', data);
            receiveMessage('joined', ({roomId, username, clients, isAdmin}) => {
                toast.success(`${username} joined the room.`);
                setConnectedUsers(clients);
            });

            receiveMessage('user-disconnected', ({username, clients}) => {
                toast.success(`${username} left the room.`);
                setConnectedUsers(clients);
            });

            // Add typing event listener
            receiveMessage('user-typing', ({ username, isTyping }) => {
                setTypingUsers(prev => {
                    const newSet = new Set(prev);
                    if (isTyping) {
                        newSet.add(username);
                    } else {
                        newSet.delete(username);
                    }
                    return newSet;
                });
            });

            // Add chat notification listener for editor page
            receiveMessage('chat-notification', ({ username, message }) => {
                toast.success(`${username} sent: ${message}`);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off('joined');
                socketRef.current.off('user-disconnected');
                socketRef.current.off('user-typing');
                socketRef.current.off('chat-notification');
            }
        };
    }, [params.roomId, location.state?.username, socketRef.current]);

    const handleCreateFile = () => {
        let fileName = prompt("Enter File Name: ");
        const extension = fileName.split('.');

        if (extension.length === 1) {
            fileName += '.txt';
        }

        if (allFiles.has(fileName)) {
            alert("File with this name already exists.");
            return;
        }

        setAllFiles(new Set(allFiles.add(fileName)));

        setFileContents({
            ...fileContents,
            [fileName]: ""
        });
    };

    return (
        <div className='h-screen flex bg-[#1E1E1E] text-white'>
            {/* Sidebar */}
            <Sidebar/>
            
            {/* Users Sidebar */}
            <div className="file-and-chat h-full flex flex-col w-1/4 bg-[#1A1B26] border-r border-[#2D2D2D] shadow-lg">
                <div className="h-14 flex justify-between items-center w-full bg-[#1A1B26] p-3 border-b border-[#2D2D2D]">
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-medium text-gray-300">Room Users</p>
                        <span className="px-2 py-1 bg-[#2D2D2D] rounded-full text-xs text-gray-400">
                            {connectedUsers.length} online
                        </span>
                    </div>
                    <button
                        className="px-3 py-1.5 bg-[#00875A] hover:bg-[#006D48] rounded-md text-sm 
                        transition-colors duration-300 flex items-center gap-1"
                        onClick={handleCreateFile}
                    >
                        <i className="ri-add-line"></i>
                        <span>Create File</span>
                    </button>
                </div>
                <div className="h-full w-full bg-[#1A1B26] px-2 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-[#424242]">
                    {/* Admin Section */}
                    {connectedUsers.filter(user => user.isAdmin).map((user) => (
                        <div
                            key={user.username}
                            className="h-12 flex items-center w-full bg-[#1A1B26] rounded-sm pl-3 
                            cursor-pointer hover:bg-[#2D2D2D] transition-colors duration-200 
                            group flex justify-between items-center border-b border-[#2D2D2D]"
                        >
                            <div className="flex items-center">
                                <i className="ri-user-star-line text-lg mr-2 text-[#539bf5]"></i>
                                <p className="text-sm text-gray-300 flex items-center gap-2">
                                    {user.username}
                                    <span className="text-xs text-[#539bf5] ml-2">[Admin]</span>
                                    {typingUsers.has(user.username) && (
                                        <span className="text-xs text-emerald-400 ml-2">[typing...]</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {/* Other Users Section */}
                    {connectedUsers.filter(user => !user.isAdmin).map((user) => (
                        <div
                            key={user.username}
                            className="h-12 flex items-center w-full bg-[#1A1B26] rounded-sm pl-3 
                            cursor-pointer hover:bg-[#2D2D2D] transition-colors duration-200 
                            group flex justify-between items-center"
                        >
                            <div className="flex items-center">
                                <i className="ri-user-line text-lg mr-2 text-gray-400"></i>
                                <p className="text-sm text-gray-300 flex items-center gap-2">
                                    {user.username}
                                    {typingUsers.has(user.username) && (
                                        <span className="text-xs text-emerald-400 ml-2">[typing...]</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="editor-setup flex h-full bg-[#1E1E1E] flex-grow">
                <div className='Editor h-full w-full'>
                    <Editor
                        socketRef={socketRef}
                        roomId={params.roomId}
                        onCodeChange={(code)=>{
                            codeRef.current=code;
                        }}
                        username={location.state?.username}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditorPage;