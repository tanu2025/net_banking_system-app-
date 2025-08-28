import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';
import './App.css';

const App = () => {
  const isAuth = localStorage.getItem('userInfo');

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="App">
        <Routes>
          <Route path="/login" element={isAuth ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isAuth ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;