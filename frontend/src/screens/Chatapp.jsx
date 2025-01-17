import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import toast from 'react-hot-toast';
import { useLocation, useParams } from "react-router-dom";
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket";

const Chatapp = () => {

    const messageBox = React.createRef();
    const location = useLocation();
    const params = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([])

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
                                    <p>{msg.message}</p>
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
        </div>
    )

}

export default Chatapp