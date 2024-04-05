// Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function Login() {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate=useNavigate();

    const handleLogin = () => {
        axios.post("https://passwordmanager-07xe.onrender.com/login",{
            username,password
        }).then((response)=>{
            console.log(response);
            if(response.data.token===null) {
                window.alert("Invalid Username or password");
            } else {
                console.log("login success");
                localStorage.setItem('token', response.data.token); // 'token' is the key used to store the token
                localStorage.setItem('username', response.data.email);
                navigate("/user")
            }
        })
        console.log('Username:', username);
        console.log('Password:', password);
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Login</h2>
            <form>
                <div style={{ marginBottom: '20px' }}>
                <label style={{ marginBottom: '5px', fontSize: '20px', display: 'block', color: '#666' }}>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: '100%', padding: '15px', fontSize: '20px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                />
                </div>
                <div style={{ marginBottom: '20px' }}>
                <label style={{ marginBottom: '5px', fontSize: '20px', display: 'block', color: '#666' }}>Password:</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: 'calc(100% - 30px)', padding: '15px', fontSize: '20px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                    <label style={{ marginLeft: '10px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        onChange={togglePasswordVisibility}
                        style={{ display: 'none' }}
                    />
                    <span style={{ position: 'relative', display: 'inline-block', width: '20px', height: '20px', backgroundColor: '#ddd', borderRadius: '50%', cursor: 'pointer' }}>
                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', backgroundColor: '#666', borderRadius: '50%', display: showPassword ? 'block' : 'none' }}></span>
                    </span>
                    </label>
                    <label style={{ marginLeft: '5px', fontSize: '16px', color: '#666', cursor: 'pointer' }}>Show Password</label>
                </div>
                </div>
                <button
                type="button"
                onClick={handleLogin}
                style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                Login
                </button>
            </form>
            <p style={{fontSize:'16px'}}>Don't have an account?  
                <Link to={"/Signup"}> Create account</Link>
            </p>
        </div>
    );
};

export default Login;
