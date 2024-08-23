import React, { useState, useEffect } from 'react';
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
            </div>
        </div>
    )
}