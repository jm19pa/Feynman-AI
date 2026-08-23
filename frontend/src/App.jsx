import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import NavBar from './components/header/NavBar';
import Home_Page from './components/home/Home';
import About from './components/about/AboutUs';
import Login from './components/login/Login';
import Sign_Up from './components/signup/SignUp';
import Email_Verification from './components/email/EmailVer';
import Chat from './components/chat/Chat';
import './App.css';

function App() {
    return (
        <div className='transition bg-neutral-900 text-neutral-50 min-h-screen'>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route exact path="/" element={<Home_Page />} />
                    <Route path="/About" element={<About />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Sign_Up" element={<Sign_Up />} />
                    <Route path="/Email_Verification" element={<Email_Verification />} />
                    <Route path="/Chat" element={<Chat />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
