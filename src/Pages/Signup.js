import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Signup.css'; // Import CSS file

function Signup() {
    const API_URL= process.env.REACT_APP_API_URL;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // State to track loading status

    const handleSignup = () => {
        setError('');
        // Basic form validation
        if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Please fill out all fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Set loading to true when making the request
        setLoading(true);

        axios.post(`${API_URL}/user/signup`, {
            username, password
        }).then((response) => {
            console.log(response);
            if (response.data.username === 'USER_ALREADY_EXIST') {
                setError("User already exists");
            } else if(response.data.username==='INVALID_EMAIL') {
                setError("Invalid email address");
            } else {
                setSignupSuccess(true);
            }
        }).catch(error => {
            setError('An error occurred. Please try again later.');
            console.error('Signup error:', error);
        }).finally(() => {
            // Set loading back to false when response is received
            setLoading(false);
        });
    };

    const handleConfirmPasswordChange = (e) => {
        setError('');
        setConfirmPassword(e.target.value);
        if (password !== e.target.value) {
            setError('Passwords do not match');
        } else {
            setError('');
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
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
                <div className="form-group">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        placeholder="Password"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="input-field"
                        placeholder="Confirm Password"
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button
                    type="button"
                    onClick={handleSignup}
                    className="signup-button"
                    disabled={loading} // Disable button while loading
                >
                    {loading ? 'Signing up...' : 'Sign Up'} {/* Change button text based on loading state */}
                </button>
            </form>
            {signupSuccess && (
                <p>Signup successful! Click <Link to={"/Login"}>here</Link> to login.</p>
            )}
        </div>
    );
}

export default Signup;
