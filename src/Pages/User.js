import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './User.css'; // Import CSS file for styling
import { useNavigate } from "react-router-dom";

function User() {
    const navigate = useNavigate();
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedContainer, setSelectedContainer] = useState(null); // State to store the selected container
    const [addingAccount, setAddingAccount] = useState(false); // State to indicate if user is adding a new account
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editAccountId, setEditAccountId] = useState(null); // State to store the ID of the account being edited
    const [accountOwner, setAccountOwner] = useState('');

    useEffect(() => {
        setAccountOwner(localStorage.getItem('username'));
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get("https://passwordmanager-07xe.onrender.com/user/get-all-container", {
                    headers: {
                        Authorization: `Bearer ${token}` // Set the Authorization header with the token
                    }
                });
                console.log(response);
                setContainers(response.data);
                setLoading(false);
            } catch (error) {
                console.log("error in fetching data", error.message);
                setError("Error fetching data. Please try again later.");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddContainer = () => {
        navigate("/user/add-container");
    };

    const handleAddAccount = (containerId) => {
        const token = localStorage.getItem('token');
        try {
            const response = axios.post("https://passwordmanager-07xe.onrender.com/account/add", { email, password, containerId }, {
                headers: {
                    Authorization: `Bearer ${token}` // Set the Authorization header with the token
                }
            });
            console.log(response.data);
            // Optionally, you can update the state or perform other actions upon successful submission
        } catch (error) {
            console.log("error in adding account", error.message);
            // Optionally, handle the error or display a message to the user
        }
    };

    const togglePasswordVisibility = (containerId, accountId) => {
        const updatedContainers = containers.map(container => {
            if (container.id === containerId) {
                const updatedAccounts = container.accounts.map(account => {
                    if (account.id === accountId) {
                        return { ...account, showPassword: !account.showPassword };
                    }
                    return account;
                });
                return { ...container, accounts: updatedAccounts };
            }
            return container;
        });
        setContainers(updatedContainers);
    };

    const handleEditAccount = async (accountId) => {
        const token = localStorage.getItem('token');
        try {
            console.log(editEmail,editPassword,accountId);
            axios.put('https://passwordmanager-07xe.onrender.com/account/edit', { email: editEmail, password: editPassword, accountId: accountId}, {
                headers: {
                    Authorization: `Bearer ${token}` // Set the Authorization header with the token
                }
            }).then((response)=>{
                console.log(response);
            })
        } catch (error) {
            console.log("error in editing account", error.message);
            // Optionally, handle the error or display a message to the user
        }
    };

    const openEditForm = (accountId) => {
        setEditAccountId(accountId);
        const accountToEdit = containers.flatMap(container => container.accounts).find(account => account.id === accountId);
        if (accountToEdit) {
            setEditEmail(accountToEdit.email);
            setEditPassword(accountToEdit.password);
        }
    };

    const handleDeleteAccount = async (accountId) => {
        const token = localStorage.getItem('token');
        try {
            console.log(accountId);
            axios.delete(`https://passwordmanager-07xe.onrender.com/account/delete`, {
                params:{accountId:accountId},
                headers: {
                    Authorization: `Bearer ${token}` // Set the Authorization header with the token
                }
            }).then((response)=>{
                console.log(response);
            })
            // Optionally, you can update the state or perform other actions upon successful deletion
        } catch (error) {
            console.log("error in deleting account", error.message);
            // Optionally, handle the error or display a message to the user
        }
    };

    if (loading)
        return <div>Loading....</div>;
    if (error)
        return <div>Error: {error}</div>;
    return (
        <div className="container">
            <div>Account Owner: {accountOwner}</div>
            <button className="add-button" onClick={handleAddContainer}>
                <i className="fas fa-plus"></i> New Container
            </button>
            <h2 className="heading">Saved Passwords</h2>
            {containers.length === 0 ? (
                <p className="no-passwords">No saved passwords</p>
            ) : (
                <ul className="list">
                    {containers.map(container => (
                        <li key={container.id} className="container-item">
                            <div className="website" onClick={() => setSelectedContainer(selectedContainer === container.id ? null : container.id)}>
                                <span>{container.websiteUrl}</span>
                                {selectedContainer === container.id ? (
                                    <i className="fas fa-chevron-up"></i>
                                ) : (
                                    <i className="fas fa-chevron-down"></i>
                                )}
                            </div>
                            {selectedContainer === container.id && (
                                <div className="accounts-container">
                                    <button className="add-account-button" onClick={() => {
                                        setAddingAccount(!addingAccount);
                                    }}>{addingAccount ? 'Cancel' : 'Add Account'}</button>
                                    {addingAccount && (
                                        <div className="add-account-form">
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                                            <button className="submit" onClick={() => handleAddAccount(container.id)}>Submit</button>
                                        </div>
                                    )}
                                    <ul className="accounts">
                                        {container.accounts.map(account => (
                                            <li key={account.id} className="account-item">
                                                <div className="email">Email: {account.email}</div>
                                                <div className="password">
                                                    Password: {account.showPassword ? account.password : '********'}
                                                    <button className="show-password" onClick={() => togglePasswordVisibility(container.id, account.id)}>
                                                        {account.showPassword ? 'Hide' : 'Show'}
                                                    </button>
                                                </div>
                                                <button className="edit-button" onClick={() => openEditForm(account.id)}>Edit</button>
                                                <button className="delete-button" onClick={() => handleDeleteAccount(account.id)}>Delete</button>
                                                {editAccountId === account.id && (
                                                    <div className="edit-form">
                                                        <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="New Email" />
                                                        <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="New Password" />
                                                        <button className="submit" onClick={() => handleEditAccount(account.id)}>Save</button>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default User;
