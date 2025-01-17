import React, { useRef } from "react";
import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";

const Chatapp = () => {

    const messageBox = React.createRef();
    const location = useLocation();

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
                        <div className="max-w-52 ml-auto message flex flex-col p-2 mb-2 bg-green-600 w-fit rounded-md border-2 border-green-500">
                            <small className="opacity-65 text-xs">
                                {location.state.username}
                            </small>
                            <div className="text-sm">
                                <p>Hello How are you My name is Ritesh</p>
                            </div>
                        </div>
                        <div className="max-w-52 message flex flex-col p-2 bg-black w-fit rounded-md border-2 border-white">
                            <small className="opacity-65 text-xs">
                                {location.state.username}
                            </small>
                            <div className="text-sm">
                                <p>hey whats up I am good</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inputField w-1/4 flex absolute bottom-0 bg">
                    <input
                        className='p-2 px-4 border-none outline-none flex-grow bg-black' type="text" placeholder='Enter message' />
                    <button
                        className='px-5 bg-slate-950 text-white'><i className="ri-send-plane-fill"></i></button>
                </div>
            </div>
        </div>
    )

}

export default Chatapp