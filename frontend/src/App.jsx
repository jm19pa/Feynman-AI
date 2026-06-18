import { useState } from 'react'
// import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home_Page from './components/Home_Page';
import About_Us from './components/About_Us';
import './App.css'

function App() {
    return (
        <>
            {/* <h1>hi</h1> */}
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Home_Page />} />
                    <Route path="/About_Us" element={<About_Us />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
