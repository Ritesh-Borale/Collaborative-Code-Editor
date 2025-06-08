import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useUserContext } from '../context/user.context';
import axiosInstance from '../config/axios';  // Import axios
import { useParams } from 'react-router-dom';
import { initializeSocket,sendMessage,receiveMessage } from '../config/socket';

const Editor = ({socketRef, roomId, onCodeChange,username}) => {
    
    const { allFiles, setAllFiles, fileContents, setFileContents } = useUserContext();
    const [currentFile, setCurrentFile] = useState(Array.from(allFiles)[0] || "");
    const [content, setContent] = useState(fileContents[currentFile] || "");
    const [output, setOutput] = useState("");
    const [input, setInput] = useState("");


    useEffect(() => {
        const storedFiles = JSON.parse(localStorage.getItem('allFiles'));
        const storedContent = JSON.parse(localStorage.getItem('fileContents'));

        if (storedFiles) {
            setAllFiles(new Set(storedFiles));
        }

        if (storedContent) {
            setFileContents(storedContent);
        }
    }, []);

    //storing in local Storage
    useEffect(() => {
        if (allFiles.size === 0) {
            const defaultFileName = 'Hello.txt';
            const defaultContent = 'Hello user, how are you?';

            setAllFiles(new Set([defaultFileName]));
            setFileContents({ [defaultFileName]: defaultContent });
        }
        localStorage.setItem('allFiles', JSON.stringify(Array.from(allFiles)));
        localStorage.setItem('fileContents', JSON.stringify(fileContents));
    }, [allFiles, fileContents]);

    const handleEditorChange = (value) => {
        setContent(value);
        setFileContents(prevContents => ({
            ...prevContents,
            [currentFile]: value
        }));
        onCodeChange(value)
        sendMessage('code-change', {
            roomId,
            value,
            currentFile,
            allFiles
        });
        
        // Emit typing event
        sendMessage('typing', {
            roomId,
            username,
            isTyping: true
        });

        // Clear typing indicator after 1 second of no typing
        if (window.typingTimeout) {
            clearTimeout(window.typingTimeout);
        }
        window.typingTimeout = setTimeout(() => {
            sendMessage('typing', {
                roomId,
                username,
                isTyping: false
            });
        }, 1000);
    };

    useEffect(() => {
        if (socketRef.current) {
            receiveMessage('code-change', ({ value, currentFile, allFiles }) => {
                if (currentFile) {
                    setFileContents((prevContents) => {
                        if (!prevContents[currentFile]) {
                            localStorage.setItem(
                                'allFiles',
                                JSON.stringify([...new Set([...Object.keys(prevContents), currentFile])])
                            );
                            localStorage.setItem(
                                'fileContents',
                                JSON.stringify({
                                    ...prevContents,
                                    [currentFile]: value || '',
                                })
                            );
    
                            setAllFiles((prevFiles) => new Set([...prevFiles, currentFile]));
                            return {
                                ...prevContents,
                                [currentFile]: value || '',
                            };
                        }
    
                        return {
                            ...prevContents,
                            [currentFile]: value,
                        };
                    });
                }
            });
        }
    
        return () => {
            socketRef.current.off('code-change');
        };
    }, [socketRef.current,fileContents]);
    
    

    useEffect(() => {
        setContent(fileContents[currentFile] || "");
    }, [currentFile, fileContents]);

    const getLanguage = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'js':
                return 'javascript';
            case 'ts':
                return 'typescript';
            case 'html':
                return 'html';
            case 'css':
                return 'css';
            case 'json':
                return 'json';
            case 'cpp':
            case 'c++':
                return 'cpp';
            case 'py':
                return 'python';
            case 'java':
                return 'java';
            default:
                return 'plaintext';
        }
    };

    const deleteFile = () => {
        if (window.confirm(`Are you sure you want to delete the file: ${currentFile}?`)) {
            const newAllFiles = new Set(allFiles);
            newAllFiles.delete(currentFile);
            setAllFiles(newAllFiles);

            const newFileContents = { ...fileContents };
            delete newFileContents[currentFile];
            setFileContents(newFileContents);

            localStorage.setItem('allFiles', JSON.stringify(Array.from(newAllFiles)));
            localStorage.setItem('fileContents', JSON.stringify(newFileContents));

            const nextFile = Array.from(newAllFiles)[0] || "";
            setCurrentFile(nextFile);
            setContent(nextFile ? fileContents[nextFile] : "");
        }
    };

    const handleRunCode = async () => {
        axiosInstance.post('/runcode/execute', {
            code: content,
            language: getLanguage(currentFile),
            input: input,
        }).then((res) => {
            setOutput(res.data.output);
            console.log(res.data.output);
        }).catch((err) => {
            console.error('Error running code:', err);
            setOutput('Error running code. Please check your code or try again.');
        });
    };

    const clearTerminal = () =>{
        setOutput("");
    }

    return (
        <div className="h-full w-full flex bg-gradient-to-b from-gray-900 to-gray-800">
            {/* Main Editor Section - Left Side - 70% */}
            <div className="w-[70%] flex flex-col">
                <div className="files flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
                    <select
                        className="bg-gray-800 text-gray-200 p-2 rounded-md border border-gray-600 hover:border-blue-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                        value={currentFile}
                        onChange={(e) => {
                            const selectedFile = e.target.value;
                            setCurrentFile(selectedFile);
                            setContent(fileContents[selectedFile]);
                            sendMessage('file-change', {
                                roomId,
                                selectedFile,
                                username
                            });
                        }}
                    >
                        {Array.from(allFiles).map((fileName) => (
                            <option key={fileName} value={fileName}>
                                {fileName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-grow">
                    <MonacoEditor
                        height="100%"
                        width="100%"
                        language={getLanguage(currentFile)}
                        value={content}
                        onChange={handleEditorChange}
                        theme="vs-dark"
                        options={{
                            fontSize: 15,
                            padding: { top: 16 },
                            roundedSelection: true,
                            minimap: { enabled: false },
                            automaticLayout: true,
                        }}
                    />
                </div>
            </div>

            {/* Right Side Panel - 30% */}
            <div className="w-[30%] border-l border-gray-700/50 flex flex-col">
                {/* Top Controls - Default style buttons */}
                <div className="p-4 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 flex gap-2">
                    <button
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-lg hover:shadow-emerald-500/20 font-medium"
                        onClick={handleRunCode}
                    >
                        Run
                    </button>
                    <button
                        className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-lg hover:shadow-rose-500/20 font-medium"
                        onClick={deleteFile}
                    >
                        Delete
                    </button>
                </div>

                {/* Input Section */}
                <div className="flex-1 p-4 bg-gray-800/30">
                    <p className="text-lg font-semibold mb-2 text-gray-200">Input:</p>
                    <textarea
                        className="w-full h-[calc(100%-2rem)] bg-gray-700/50 rounded-lg text-gray-200 resize-none border border-gray-600 focus:outline-none focus:border-blue-400 transition-all duration-300 placeholder-gray-400 p-3 font-mono"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your input here..."
                        spellCheck="false"
                    />
                </div>

                {/* Terminal Section */}
                <div className="flex-1 border-t border-gray-700/50 flex flex-col max-h-[50%]">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50">
                        <div className="flex items-center gap-2">
                            <p className="text-gray-200 font-semibold">Terminal Output</p>
                            {output && (
                                <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
                                    {getLanguage(currentFile)}
                                </span>
                            )}
                        </div>
                        <button 
                            onClick={clearTerminal}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                        >
                            Clear
                        </button>
                    </div>
                    <div className="flex-1 bg-gray-800/30 relative">
                        <pre className="absolute inset-0 p-3 overflow-auto text-gray-200 font-mono text-sm whitespace-pre-wrap break-words">
                            {output || 'No output yet. Run your code to see results here.'}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
