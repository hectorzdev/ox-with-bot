import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FBlogo from './imgs/fb-logo.png';
import GoogleLogo from './imgs/google-logo.webp';
import DashboardIcon from './imgs/dashboard.png';
import LogoutIcon from './imgs/logout.png';
import deleteIcon from './imgs/bin.png';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

export default function Account({ point, streak, updatePointsAndStreak }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullname, setFullname] = useState('');
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

  const checkToken = async (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const expiry = decodedToken.exp * 1000;
      const now = Date.now();

      if (now < expiry) {
        setIsLoggedIn(true);
        setFullname(decodedToken.fullname || '');

        await axios.post(`${apiEndpoint}/user`, {
          token: token
        })
          .then(response => {
            updatePointsAndStreak(response.data.point, response.data.consecutiveWins);
          })
          .catch(error => {
            console.error('Error saving result:', error);
          });

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
    window.location.href = `${apiEndpoint}/auth/google`;
  };

  return (
    <div className="account-wrapper">
      {isLoggedIn ? (
        <div>
          <div className='account-info'>
            <span>{fullname}</span>
            <div className="account-btns">
              <Link to="/dashboard" className='account-btn'><img src={DashboardIcon} alt="" /> Dashboard</Link>
              <button type="button" className='account-btn' onClick={() => {
                localStorage.removeItem('ox_token');
                setIsLoggedIn(false);
              }}>
                <img src={LogoutIcon} alt="" />
                Logout
              </button>
              <Link to="/delete-account" className='account-btn'><img src={deleteIcon} alt="" /> Account</Link>
            </div>
          </div>
          <div className="state-info">
            <span>POINT : {point}</span>
            <span>STREAK : {streak}</span>
          </div>
        </div>
      ) : (
        <button type="button" className='facebook-btn' onClick={handleLogin}>
          <img src={GoogleLogo} alt="Facebook Logo" />
          LOGIN
        </button>
      )}
    </div>
  );
}
