import React from "react"
import { Routes, BrowserRouter, Route } from "react-router-dom"
import Login from "../screens/Login"
import Register from "../screens/Register"
import Home from "../screens/Home"
import UserAuth from '../auth/UserAuth'
import EditorPage from "../screens/EditorPage"

function AppRoutes() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UserAuth><Home/></UserAuth>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/editor/:roomId" element={<EditorPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
