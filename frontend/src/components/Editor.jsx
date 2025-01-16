import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useUserContext } from '../context/user.context';  // Import the context hook

const Editor = () => {
    const { allFiles, setAllFiles, fileContents, setFileContents } = useUserContext();
    const [currentFile, setCurrentFile] = useState(Array.from(allFiles)[0] || "");
    const [content, setContent] = useState(fileContents[currentFile] || "");

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
    };

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

    return (
        <div className="h-full w-full">
            <div className="flex items-center justify-between p-2 bg-slate-800">
                <select
                    className="bg-slate-700 text-white p-2 rounded-md"
                    value={currentFile}
                    onChange={(e) => {
                        const selectedFile = e.target.value;
                        setCurrentFile(selectedFile);
                        setContent(fileContents[selectedFile]);
                    }} 
                >
                    {Array.from(allFiles).map((fileName) => (
                        <option key={fileName} value={fileName}>
                            {fileName}
                        </option>
                    ))}
                </select>
                <button 
                    className='delete-file h-10 w-28 bg-red-500 rounded-md'
                    onClick={deleteFile}    
                >
                    Delete File
                </button>
            </div>

            {/* Monaco Editor */}
            <MonacoEditor
                height="100%" 
                language={getLanguage(currentFile)} 
                value={content} 
                onChange={handleEditorChange} 
                theme="vs-dark" 
            />
        </div>
    );
};

export default Editor;
