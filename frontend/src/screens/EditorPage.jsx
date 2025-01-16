import React, { useState, useRef, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import 'remixicon/fonts/remixicon.css';
import { UserContext } from '../context/user.context';  
import Editor from '../components/Editor';

const EditorPage = () => {
    const { allFiles, setAllFiles, fileContents, setFileContents } = useContext(UserContext);

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
            <div className='side-bar h-full flex flex-col w-14 bg-black'>
                <div className="h-10 w-10 flex items-center justify-center bg-slate-900 rounded-md mt-5 ml-1">
                    <i className="ri-keyboard-line text-2xl"></i>
                </div>
                <div className="h-10 w-10 flex items-center justify-center bg-slate-900 rounded-md mt-5 ml-1">
                    <i className="ri-chat-1-line text-2xl"></i>
                </div>
                <div className="h-10 w-10 flex items-center justify-center bg-slate-900 rounded-md mt-6 ml-1">
                    <i className="ri-artboard-line text-2xl"></i>
                </div>
            </div>

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

            {/* Editor Section */}
            <div className="editor-setup flex h-full bg-slate-700 flex-grow">
                <div className='Editor h-full w-full'>
                    <Editor />
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
