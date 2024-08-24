import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './main.css';
import axios from 'axios';
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

export default function Home() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const storedToken = localStorage.getItem('ox_token');

    useEffect(() => {
        loadUsers();
        if (storedToken) {
            const decodedToken = jwtDecode(storedToken); 
            const expiry = decodedToken.exp * 1000; 
            const now = Date.now();
            if (now > expiry) {
                navigate('/')
            }
        }
    }, [currentPage]);

    const loadUsers = async () => {
        await axios.post(`${apiEndpoint}/users?page=${currentPage}&limit=10`, {
            token: storedToken
        })
        .then(response => {
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
        })
        .catch(error => {
            console.error('Error saving result:', error);
        });
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    }

    const usersEl = users.map((user, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{user.email}</td>
            <td>{user.point}</td>
        </tr>
    ));
    
    return (
        <div>
            <div className="container">
                <h1 className='text-white text-center'>Players</h1>
                <Link to="/" className="back-btn">Back</Link>
                <div className="players-wrapper">
                    <table className=''>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Email</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersEl}
                        </tbody>
                    </table>
                    <div className='pagination'>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={i + 1 === currentPage ? 'active' : ''}
                            disabled={i + 1 === currentPage}
                        >
                            {i + 1}
                        </button>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
