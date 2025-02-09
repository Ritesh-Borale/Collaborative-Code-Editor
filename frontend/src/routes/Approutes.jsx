import React from "react"
import { Routes, BrowserRouter, Route, useParams  } from "react-router-dom"
import Login from "../screens/Login"
import Register from "../screens/Register"
import Home from "../screens/Home"
import UserAuth from '../auth/UserAuth'
import EditorPage from "../screens/EditorPage"
import Chatapp from "../screens/Chatapp"
import Whiteboard from "../screens/Whiteboard"
import Welcome from "../screens/Welcome" 
import { SocketProvider } from "../context/socket.context"

const WithSocketProvider = ({Component})=>{
    const {roomId} = useParams();
    return (
        <SocketProvider roomId={roomId}>
            <Component />
        </SocketProvider>
    )
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} /> 
                <Route path="/home" element={<UserAuth><Home/></UserAuth>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/editor/:roomId" element={<WithSocketProvider Component={EditorPage} />} />
                <Route path="/chat/:roomId" element={<WithSocketProvider Component={Chatapp} />} />
                <Route path="/whiteboard/:roomId" element={<WithSocketProvider Component={Whiteboard} />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
