import React, { useState } from 'react';
import axios from 'axios'; 
import { Link } from 'react-router-dom';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);

    const handleSignup = () => {
        axios.post("https://passwordmanager-07xe.onrender.com/user/signup",{
            username, password
        }).then((response)=>{
            console.log(response);
            if(response.data===null) {
                window.alert("User already exist");
            } else {
                setSignupSuccess(true);
            }
        })
        console.log('username:', username);
        console.log('Password:', password);
    };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Sign Up</h2>
      <form>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginBottom: '5px', fontSize: '20px', display: 'block', color: '#666' }}>Username:</label>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '15px', fontSize: '20px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginBottom: '5px', fontSize: '20px', display: 'block', color: '#666' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '15px', fontSize: '20px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="button"
          onClick={handleSignup}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Sign Up
        </button>
      </form>
      {signupSuccess && (
        <p>Signup successful! Click <Link to={"/Login"}>here</Link> to login.</p>
      )}
    </div>
  );
}

export default Signup;