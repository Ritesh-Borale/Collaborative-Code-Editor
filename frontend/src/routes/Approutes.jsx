import React from "react"
import { Routes, BrowserRouter, Route } from "react-router-dom"
import Login from "../screens/Login"
import Register from "../screens/Register"
import Home from "../screens/Home"
import UserAuth from '../auth/UserAuth'
import EditorPage from "../screens/EditorPage"
import Chatapp from "../screens/Chatapp"
import Whiteboard from "../screens/Whiteboard"
import Welcome from "../screens/Welcome"  // Import Welcome component

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />  {/* Set Welcome as the landing page */}
                <Route path="/home" element={<UserAuth><Home/></UserAuth>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/editor/:roomId" element={<EditorPage />} />
                <Route path="/chat/:roomId" element={<Chatapp />} />
                <Route path="/whiteboard/:roomId" element={<Whiteboard />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
