import './App.css';
import React, { useState } from 'react';
import { useEffect } from 'react';
import SignUp from './SignUp';
import Login from './Login';
import Homescreen from './Homescreen';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

    useEffect(() => {
        document.title = 'Chat Host';
    }, []);

    const [isDarkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode === 'true';
    });

  
    useEffect(() => {
        localStorage.setItem('isDarkMode', isDarkMode);
    }, [isDarkMode])

    return (
        <>
            <Routes>
                <Route path="/" element={<Login isDarkMode={isDarkMode} setDarkMode={setDarkMode} />} />
                <Route path="/SignUp" element={<SignUp isDarkMode={isDarkMode} setDarkMode={setDarkMode} />} />
                <Route path="/Homescreen" element={<Homescreen isDarkMode={isDarkMode} setDarkMode={setDarkMode} />} />
            </Routes>
        </>
    );
}

// Wrap your App component in BrowserRouter
export default function AppWithRouter() {
    return (
        <Router>
            <App />
        </Router>
    );
}
