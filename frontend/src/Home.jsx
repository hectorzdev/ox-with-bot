import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './main.css';
import Account from './Account';
import Game from './Game';

export default function Home (){
    const [point, setPoint] = useState(0);
    const [streak, setStreak] = useState(0);

    const updatePointsAndStreak = (newPoint, newStreak) => {
        setPoint(newPoint);
        setStreak(newStreak);
    };

    return (
        <div>
            <div className="container">
                <h1 className='web-title'>OX (TIC TAC TOE)</h1>
                <Account point={point} streak={streak} updatePointsAndStreak={updatePointsAndStreak} />
                <Game onGameEnd={updatePointsAndStreak} />
                <Link to="privacy-policy" className='privacy-policy-link'>Privacy Policy</Link>
            </div>
        </div>
    )
}