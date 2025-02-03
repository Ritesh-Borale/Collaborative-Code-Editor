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
    const codeRef = useRef(null);
    const { allFiles, setAllFiles, fileContents, setFileContents } = useContext(UserContext);
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    console.log(socketRef);

    useEffect(() => {
        if (socketRef.current) {
            const data = {
                roomId: params.roomId,
                username: location.state?.username,
            };
            
            sendMessage('join', data);
            receiveMessage('joined', ({roomId, username}) => {
                toast.success(`${username} joined the room.`);
            });
        }
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
        <div className='h-screen flex text-white'>
            {/* Sidebar */}
            <Sidebar/>

            {/* File Sidebar */}
            <div className="file-and-chat h-full flex flex-col w-1/4 bg-slate-700">
                <div className="h-14 flex justify-between w-full bg-slate-800 p-2">
                    <p className="text-2xl">All Files</p>
                    <button
                        className="p-2 bg-green-500 rounded-md mr-2 text-lg"
                        onClick={handleCreateFile} // Corrected function name
                    >
                        Create File +
                    </button>
                </div>
                <div className="h-full w-full bg-slate-900 px-2">
                    {Array.from(allFiles).map((fileName) => (  // Convert Set to Array for iteration
                        <div
                            key={fileName}
                            className="h-10 flex items-center w-full bg-slate-700 mt-2 rounded-md pl-2 cursor-pointer hover:bg-slate-600"
                        >
                            <i className="ri-file-line text-xl mr-2"></i>
                            <p className="text-xl">{fileName}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="editor-setup flex h-full bg-slate-700 flex-grow">
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

