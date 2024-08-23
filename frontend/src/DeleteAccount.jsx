import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './main.css';
import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

export default function Home() {
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('ox_token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    const handleDeleteAccount = async () => {
        if (!token) {
            alert('You need to be logged in to delete your account.');
            return;
        }

        setLoading(true); 

        try {
            await axios.post(`${apiEndpoint}/auth/delete`, { token });
            localStorage.removeItem('ox_token');
            alert('Your account has been successfully deleted.');
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('An error occurred while deleting your account. Please try again.');
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div>
            <div className="container">
                <h1 className='web-title'>OX (TIC TAC TOE)</h1>
                <div className="delete-account-wrapper">
                    <Link to="/" className="back-btn">Back</Link>
                    <h3 className="text-white text-center">Account Deletion</h3>
                    <p>Purpose: This page allows users to permanently delete their account from our platform. Deleting your account will remove all your personal information and game history.</p>
                    <p>Instructions:</p>
                    <ul>
                        <li><p>Confirm your decision by providing your account details.</p></li>
                        <li><p>Click the "Delete Account" button.</p></li>
                        <li><p>Your account will be permanently deleted, and you will be logged out.</p></li>
                    </ul>
                    <p>Note: This action cannot be undone. Ensure that you really want to delete your account before proceeding.</p>
                    <button 
                        type='button' 
                        onClick={handleDeleteAccount} 
                        className='confirm-delete-account-btn' 
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete Account'} 
                    </button>
                </div>
            </div>
        </div>
    );
}
