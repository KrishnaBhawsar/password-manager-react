import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './User.css'; // Import CSS file for styling
import { useNavigate } from "react-router-dom";

function User() {
    const navigate = useNavigate();
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addLoading, setAddLoading] = useState(false); // State to manage loading during add
    const [editLoading, setEditLoading] = useState(false); // State to manage loading during edit
    const [deleteLoading, setDeleteLoading] = useState(false); // State to manage loading during delete
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
                setContainers(response.data);
                setLoading(false);
            } catch (error) {
                setError("Error fetching data. Please try again later.");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddContainer = () => {
        navigate("/user/add-container");
    };

    const handleAddAccount = async (containerId) => {
        setAddLoading(true); // Set loading state to true during add
        const token = localStorage.getItem('token');
        try {
            await axios.post("https://passwordmanager-07xe.onrender.com/account/add", { email, password, containerId }, {
                headers: {
                    Authorization: `Bearer ${token}` // Set the Authorization header with the token
                }
            });
            setAddLoading(false); // Set loading state to false after response received
            // Reload the page
            window.location.reload();
        } catch (error) {
            console.log("error in adding account", error.message);
            setAddLoading(false); // Set loading state to false if error occurs
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
        setEditLoading(true); // Set loading state to true during edit
        const token = localStorage.getItem('token');
        try {
            await axios.put('https://passwordmanager-07xe.onrender.com/account/edit', { email: editEmail, password: editPassword, accountId: accountId}, {
                headers: {
                    Authorization: `Bearer ${token}` // Set the Authorization header with the token
                }
            });
            setEditLoading(false); // Set loading state to false after response received
            // Reload the page
            window.location.reload();
        } catch (error) {
            console.log("error in editing account", error.message);
            setEditLoading(false); // Set loading state to false if error occurs
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
        setDeleteLoading(true); // Set loading state to true during delete
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`https://passwordmanager-07xe.onrender.com/account/delete`, {
                params:{accountId:accountId},
                headers: {
                    Authorization: `Bearer ${token}` // Set the Authorization header with the token
                }
            });
            setDeleteLoading(false); // Set loading state to false after response received
            // Reload the page
            window.location.reload();
        } catch (error) {
            console.log("error in deleting account", error.message);
            setDeleteLoading(false); // Set loading state to false if error occurs
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
                                        {addLoading ? ( // Show loading during add
                                            <div>Loading...</div>
                                        ) : (
                                            <button className="submit-button" onClick={() => handleAddAccount(container.id)}>Submit</button>
                                        )}
                                    </div>
                                )}
                                <ul className="account-list">
                                    {container.accounts.map(account => (
                                        <li key={account.id} className="account-item">
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
                                                {deleteLoading ? ( // Show loading during delete
                                                    <div>Loading...</div>
                                                ) : (
                                                    <button className="delete-account-button" onClick={() => handleDeleteAccount(account.id)}>Delete</button>
                                                )}
                                            </div>
                                            {editAccountId === account.id && (
                                                <div className="edit-form">
                                                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="New Email" />
                                                    <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="New Password" />
                                                    {editLoading ? ( // Show loading during edit
                                                        <div>Loading...</div>
                                                    ) : (
                                                        <button className="submit-button" onClick={() => handleEditAccount(account.id)}>Save</button>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default User;
