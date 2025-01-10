import './App.css';
import React from 'react';
import { useEffect } from 'react';
import SignUp from './SignUp';
import Login from './Login';
import Homescreen from './Homescreen';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

function App() {
    const location = useLocation(); 
    useEffect(() => {
        document.title = 'Chat Host';
      }, []);

    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/Homescreen" element={<Homescreen />} />
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
