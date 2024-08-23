import React from 'react';
import './main.css';
import Account from './Account';
import Game from './Game';

export default function Home (){
    return (
        <div>
            <div className="container">
                <h1 className='web-title'>OX (TIC TAC TOE)</h1>
                <Account></Account>
                <Game></Game>
            </div>
        </div>
    )
}