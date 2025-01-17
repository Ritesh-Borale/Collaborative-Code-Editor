import React from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Sidebar = () => {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location)
    return (
        <div className='side-bar h-full flex flex-col w-14 bg-slate-950'>
            <div
                onClick={() => {
                    navigate(`/editor/${params.roomId}`);
                }}
                className="cursor-pointer h-10 w-10 flex items-center justify-center bg-slate-900 rounded-md mt-5 ml-1">
                <i className="ri-keyboard-line text-2xl"></i>
            </div>
            <div
                onClick={() => {
                    navigate(`/chat/${params.roomId}`, {
                        state: {
                            username: location.state?.username,
                        }
                    });
                }}
                className="cursor-pointer h-10 w-10 flex items-center justify-center bg-slate-900 rounded-md mt-5 ml-1">
                <i className="ri-chat-1-line text-2xl"></i>
            </div>
            <div
                onClick={() => {
                    navigate(`/whiteboard/${params.roomId}`);
                }}
                className="cursor-pointer h-10 w-10 flex items-center justify-center bg-slate-900 rounded-md mt-6 ml-1">
                <i className="ri-artboard-line text-2xl"></i>
            </div>
        </div>
    )
}

export default Sidebar;