// Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './Login.css'; // Import CSS file

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        // Basic form validation
        if (!username.trim() || !password.trim()) {
            setError('Please fill out all fields');
            return;
        }

        axios.post("https://passwordmanager-07xe.onrender.com/login",{
            username, password
        }).then((response)=>{
            console.log(response);
            if(response.data.message==='INVALID_CREDENTIALS') {
                setError('Invalid Username or password');
            } else if(response.data.message==='USER_NOT_EXIST') {
                setError('Username not found');
            } else {
                console.log("login success");
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.email);
                navigate("/user");
            }
        }).catch(error => {
            setError('An error occurred. Please try again later.');
            console.error('Login error:', error);
        });
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form>
                <div className="form-group">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                        placeholder="Username"
                        required
                    />
                </div>
                <div className="form-group password-group">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        placeholder="Password"
                        required
                    />
                    <span className="show-password" onClick={togglePasswordVisibility}>
                        {showPassword ? 'Hide' : 'Show'}
                    </span>
                </div>
                {error && <p className="error-message">{error}</p>}
                <button
                    type="button"
                    onClick={handleLogin}
                    className="login-button"
                >
                    Login
                </button>
            </form>
            <p className="signup-link">Don't have an account? <Link to={"/Signup"}>Sign Up</Link></p>
        </div>
    );
};

export default Login;
