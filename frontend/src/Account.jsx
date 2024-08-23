import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FBlogo from './imgs/fb-logo.png';
import { jwtDecode } from 'jwt-decode';


export default function Account() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [fullname, setFullname] = useState('');
    const [point, setPoint] = useState(0);
    const [win, setWin] = useState(0);
    const [streak, setStreak] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get('token');
    
        if (token) {
          localStorage.setItem('ox_token', token);
          navigate('/')
          checkToken(token);
        } else {
          const storedToken = localStorage.getItem('ox_token');
          if (storedToken) {
            checkToken(storedToken);
          }
        }
    }, [navigate]);

    const checkToken = (token) => {
        try {
          const decodedToken = jwtDecode(token); // ถอดรหัส JWT
          const expiry = decodedToken.exp * 1000; // เวลาหมดอายุของ token (ใน milliseconds)
          const now = Date.now();
            
          if (now < expiry) {
            setIsLoggedIn(true);
            setFullname(decodedToken.fullname || ''); // สมมุติว่ามี username ใน token
          } else {
            localStorage.removeItem('ox_token');
            setIsLoggedIn(false);
          }
        } catch (error) {
          localStorage.removeItem('ox_token');
          setIsLoggedIn(false);
        }
    };

  const handleLogin = () => {
    window.location.href = 'http://localhost:3333/api/auth/facebook';
  };

  return (
    <div className="account-wrapper">
          {isLoggedIn ? (
            <div>
                <div className='account-info'>
                    <span>{fullname}</span>
                    <button type="button" className='logout-btn' onClick={() => {
                        localStorage.removeItem('ox_token');
                        setIsLoggedIn(false);
                    }}>
                        Logout
                    </button>
                </div>
                <div className="state-info">
                    <span>POINT : {point}</span>
                    <span>WIN : {win}</span>
                    <span>STREAK : {streak}</span>
                </div>
            </div> 
      ) : (
        <button type="button" className='facebook-btn' onClick={handleLogin}>
          <img src={FBlogo} alt="Facebook Logo" />
          LOGIN
        </button>
      )}
    </div>
  );
}
