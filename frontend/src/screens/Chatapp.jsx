import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import toast from 'react-hot-toast';
import { useLocation, useParams } from "react-router-dom";
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket";
import "highlight.js/styles/nord.css";
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';

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
    const [fileTree, setFileTree] = useState({

    });

    useEffect(() => {
        const socket = initializeSocket(params.roomId);

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [params.roomId]);

    useEffect(() => {

        const data = {
            roomId: params.roomId,
            username: location.state?.username,
        };

        sendMessage('join', data);

    }, [])

    useEffect(() => {
        receiveMessage('chat-message', (data) => {
            if (data.username === 'ai') {
                const message = JSON.parse(data.message);
                const reqSender = data.by; 
                console.log(data);

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
            }

            setMessages((prev) => [...prev, data]);
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
            setMessages((prev) => [...prev, { username: location.state?.username, message }]);
            setMessage('');
        }
    };

    function WriteAiMessage(message) {

        const messageObject = JSON.parse(message)
        return (
            <div
                className='overflow-auto bg-slate-950 text-white rounded-sm p-2'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }



    return (
        <div className="h-screen flex text-white">
            <Sidebar />
            <div className="chat-screen h-full flex flex-col w-1/4 bg-slate-700">
                <div className="h-10 w-full bg-slate-500 p-2 ">
                    <p className="text-xl font-bold text-black"> Chat Application </p>
                </div>
                <div className="conversation-area pb-10 flex-grow flex flex-col h-full relative">
                    <div
                        ref={messageBox}
                        className="message-box p-1 flex-grow flex flex-col overflow-auto max-h-full scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`max-w-52 message flex flex-col p-2 mb-2 ${msg.username === location.state.username ? 'bg-green-600 ml-auto' : 'bg-black'} w-fit rounded-md border-2 ${msg.username === location.state.username ? 'border-green-500' : 'border-white'}`}>
                                <small className="opacity-65 text-xs">
                                    {msg.username}
                                </small>
                                <div className="text-sm">
                                    {
                                        msg.username === 'ai' ? WriteAiMessage(msg.message) : <p>{msg.message}</p>
                                    }

                                </div>
                            </div>
                        ))}
                    </div>

                </div>
                <div className="inputField w-1/4 flex absolute bottom-0 bg">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className='p-2 px-4 border-none outline-none flex-grow bg-black'
                        type="text"
                        placeholder='Enter message'
                    />

                    <button
                        onClick={send}
                        className='px-5 bg-slate-950 text-white'><i className="ri-send-plane-fill"></i>
                    </button>
                </div>
            </div>
            <div className="right bg-slate-850 flex flex-grow h-full">
                <div className="explorer h-full max-w-64 min-w-52 bg-slate-600">
                    <div className="file-tree w-full">
                        {
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles([...new Set([...openFiles, file])])
                                    }}
                                    className="tree-element cursor-pointer p-2 flex item-center gap-2 bg-slate-500 w-full"
                                >
                                    <p className="font-semibold text-lg">{file}</p>
                                    
                                    {fileTree[file]?.reqSender && (
                                        <p className="text-sm opacity-50 mt-1">{`By: ${fileTree[file].reqSender}`}</p>
                                    )}
                                </button>
                            ))

                        }
                    </div>
                </div>
                {currentFile &&
                    <div className="code-editor flex flex-col flex-col h-full w-full">
                        <div className="top flex ">

                            <div className="files flex">
                                {
                                    openFiles.map((file, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentFile(file)}
                                            className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}
                                        >
                                            <p className="font-semibold text-lg">{file}</p>
                                        </button>

                                    ))
                                }
                            </div>

                        </div>
                        <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
                            {
                                fileTree[currentFile] && (
                                    <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                                        <pre
                                            className="hljs h-full">
                                            <code
                                                className="hljs h-full outline-none"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => {
                                                    const updatedContent = e.target.innerText;
                                                    const ft = {
                                                        ...fileTree,
                                                        [currentFile]: {

                                                            content: updatedContent

                                                        }
                                                    };
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
                                )
                            }

                        </div>
                    </div>
                }
            </div>
        </div>
    )

}

export default Chatapp