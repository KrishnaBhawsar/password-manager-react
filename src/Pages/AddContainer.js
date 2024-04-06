// AddContainer.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddContainer.css'; // Import CSS file for styling
import { useNavigate } from "react-router-dom";

function AddContainer() {
    const navigate = useNavigate();
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [accounts, setAccounts] = useState([{ email: '', password: '' }]);
    const [showPassword, setShowPassword] = useState(false);

    const handleAddAccount = () => {
        setAccounts([...accounts, { email: '', password: '' }]);
    };

    const handleAccountChange = (index, key, value) => {
        const updatedAccounts = [...accounts];
        updatedAccounts[index][key] = value;
        setAccounts(updatedAccounts);
    };

    const handleWebsiteUrlChange = (e) => {
        setWebsiteUrl(e.target.value);
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async () => {
        if(websiteUrl!=='') {
            try {
                const token = localStorage.getItem('token');
                await axios.post("https://passwordmanager-07xe.onrender.com/container/add", { websiteUrl, accounts }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                navigate("/user");
            } catch (error) {
                console.log("error in creating container", error.message);
            }
        } else {
            window.alert("website url is mandatory");
        }
    };

    return (
        <div className="add-container">
            <h2>Add New Container</h2>
            <label>Website URL:</label>
            <input type="text" value={websiteUrl} onChange={handleWebsiteUrlChange} />
            <div className="accounts-container">
                <h3>Accounts</h3>
                {accounts.map((account, index) => (
                    <div key={index} className="account">
                        <label>Email:</label>
                        <input type="text" value={account.email} onChange={(e) => handleAccountChange(index, 'email', e.target.value)} />
                        <label>Password:</label>
                        <div className="password-input">
                            <input type={showPassword ? "text" : "password"} value={account.password} onChange={(e) => handleAccountChange(index, 'password', e.target.value)} />
                            <button className="show-password" onClick={handleShowPassword}>{showPassword ? "Hide" : "Show"}</button>
                        </div>
                    </div>
                ))}
                <button className="add-account" onClick={handleAddAccount}>Add Account</button>
            </div>
            <button className="submit" onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default AddContainer;
