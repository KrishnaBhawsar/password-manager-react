// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './Pages/Login';
import SignupPage from './Pages/Signup'
import UserPage from './Pages/User';
import AddContainer from './Pages/AddContainer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/user" element={<UserPage/>} />
        <Route path="/user/add-container" element={<AddContainer/>} />
      </Routes>
    </Router>
  );
}

export default App;
