// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './User.css'; // Import CSS file for styling
import { useNavigate } from "react-router-dom";

function User() {
    const navigate = useNavigate();
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedContainer, setSelectedContainer] = useState(null);
    const [addingAccount, setAddingAccount] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [addLoading, setAddLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [editEmail, setEditEmail] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editAccountId, setEditAccountId] = useState(null);
    const [accountOwner, setAccountOwner] = useState('');

    useEffect(() => {
        setAccountOwner(localStorage.getItem('username'));
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("https://passwordmanager-07xe.onrender.com/user/get-all-container", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setContainers(response.data);
            setLoading(false);
        } catch (error) {
            setError("Error fetching data. Please try again later.");
            setLoading(false);
        }
    };

    const handleAddContainer = () => {
        navigate("/user/add-container");
    };

    const handleAddAccount = async (containerId) => {
        if (!validateForm()) return;
        setAddLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post("https://passwordmanager-07xe.onrender.com/account/add", { email, password, containerId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAddLoading(false);
            window.location.reload();
        } catch (error) {
            console.log("error in adding account", error.message);
            setAddLoading(false);
        }
    };

    const validateForm = () => {
        if (!email.trim() || !password.trim()) {
            setError("Email and password are required.");
            return false;
        }
        return true;
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
        if (!validateForm()) return;
        setEditLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('https://passwordmanager-07xe.onrender.com/account/edit', { email: editEmail, password: editPassword, accountId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEditLoading(false);
            window.location.reload();
        } catch (error) {
            console.log("error in editing account", error.message);
            setEditLoading(false);
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
        if (!window.confirm("Are you sure you want to delete this account?")) return;
        setDeleteLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://passwordmanager-07xe.onrender.com/account/delete`, {
                params: { accountId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDeleteLoading(false);
            window.location.reload();
        } catch (error) {
            console.log("error in deleting account", error.message);
            setDeleteLoading(false);
        }
    };

    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post("https://passwordmanager-07xe.onrender.com/user/logout", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLogoutLoading(false);
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            navigate('/login');
        } catch (error) {
            console.log("error in logout", error.message);
            setLogoutLoading(false);
        }
    };

    if (loading)
        return <div>Loading....</div>;
    if (error)
        return <div>Error: {error}</div>;

    return (
        <div className="user-container">
            <div className="user-header">
                <h2>Welcome, {accountOwner}!</h2>
                <button className="add-container-button" onClick={handleAddContainer}>Add Container</button>
            </div>
            <div className="container-list">
                {containers.map(container => (
                    <div key={container.id} className="container-item">
                        <div className="container-header" onClick={() => setSelectedContainer(selectedContainer === container.id ? null : container.id)}>
                            <span>{container.websiteUrl}</span>
                            <i className={selectedContainer === container.id ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i>
                        </div>
                        {selectedContainer === container.id && (
                            <div className="account-list">
                                <button className="add-account-button" onClick={() => setAddingAccount(!addingAccount)}>
                                    {addingAccount ? 'Cancel' : 'Add Account'}
                                </button>
                                {addingAccount && (
                                    <div className="add-account-form">
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                                        {addLoading ? (<div>Loading...</div>) : (<button className="submit-button" onClick={() => handleAddAccount(container.id)}>Submit</button>)}
                                    </div>
                                )}
                                <ul className="account-list">
                                    {container.accounts.map(account => (
                                        <ul key={account.id} className="account-item">
                                            <div className="account-info">
                                                <div className="email">Email: {account.email}</div>
                                                <div className="password">
                                                    Password: {account.showPassword ? account.password : '********'}
                                                    <button className="show-password-button" onClick={() => togglePasswordVisibility(container.id, account.id)}>
                                                        {account.showPassword ? 'Hide' : 'Show'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="account-actions">
                                                <button className="edit-account-button" onClick={() => openEditForm(account.id)}>Edit</button>
                                                <button className="delete-account-button" onClick={() => handleDeleteAccount(account.id)}>{deleteLoading ? 'Loading...' : 'Delete'}</button>
                                            </div>
                                            {editAccountId === account.id && (
                                                <div className="edit-form">
                                                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="New Email" />
                                                    <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="New Password" />
                                                    <button className="submit-button" onClick={() => handleEditAccount(account.id)}>{editLoading ? 'Loading...' : 'Save'}</button>
                                                </div>
                                            )}
                                        </ul>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div>
                <button className="logout-button" onClick={handleLogout}>{logoutLoading ? 'Logging out...' : 'Logout'}</button>
            </div>
        </div>
    );
}

export default User;
