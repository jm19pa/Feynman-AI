import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Nav_Bar from './components/Nav_Bar';
import Home_Page from './components/Home_Page';
import About_Us from './components/About_Us';
import Login from './components/Login';
import Sign_Up from './components/Sign_Up';
import Email_Verification from './components/Email_Verification';
import Chat from './components/Chat';
import './App.css';

function App() {
    return (
        <>
            <BrowserRouter>
                <Nav_Bar />
                <Routes>
                    <Route exact path="/" element={<Home_Page />} />
                    <Route path="/About_Us" element={<About_Us />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Sign_Up" element={<Sign_Up />} />
                    <Route path="/Email_Verification" element={<Email_Verification />} />
                    <Route path="/Chat" element={<Chat />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
