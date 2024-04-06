import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './Login.css'; // Import CSS file

function Login() {
    const API_URL= process.env.REACT_APP_API_URL;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // State to track loading status
    const navigate = useNavigate();

    const handleLogin = () => {
        // Set loading to true when making the request
        setError('');
        setLoading(true);
        console.log(API_URL);

        axios.post(`${API_URL}/login`,{
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
        }).finally(() => {
            // Set loading back to false when response is received
            setLoading(false);
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
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                        placeholder="Email"
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
                    disabled={loading} // Disable button while loading
                >
                    {loading ? 'Logging in...' : 'Login'} {/* Change button text based on loading state */}
                </button>
            </form>
            <p className="signup-link">Don't have an account? <Link to={"/Signup"}>Sign Up</Link></p>
        </div>
    );
};

export default Login;
