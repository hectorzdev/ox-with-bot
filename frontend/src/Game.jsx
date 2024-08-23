import React, { useState, useEffect } from "react";
import oIcon from "./imgs/o-icon.png";
import xIcon from "./imgs/x-icon.png";

export default function Game() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isO, setIsO] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [boardWinner, setBoardWinner] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [winningCombination, setWinningCombination] = useState([]);
    
    const handleClick = (index) => {
        const storedToken = localStorage.getItem("ox_token");
        if (!storedToken) {
            alert("Please Login.");
            return;
        }
        if (board[index] === null && isO && !gameOver) {
            const newBoard = [...board];
            newBoard[index] = "human";
            setBoard(newBoard);
            setIsO(false);
        }
    };

    useEffect(() => {
        const winner = checkWinner(board);
        if (winner) {
            setGameOver(true);
            if (winner === "draw") {
                setBoardWinner("It's a draw!");
            } else {
                console.log(winner)
                setBoardWinner(`${winner === "human" ? "You" : "AI"} wins!`);
            }
        }else{
            if (!isO && !gameOver) {
                botMove();
            }
        }
    }, [isO, gameOver]);

    const botMove = () => {
        if (!isO && !gameOver) {
            const emptyIndices = board
                .map((value, index) => (value === null ? index : null))
                .filter(index => index !== null);
    
            const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    
            if (randomIndex !== undefined) {
                const newBoard = [...board];
                newBoard[randomIndex] = "bot";
                setBoard(newBoard);
                setIsO(true);
            }
        }
    };

    const checkWinner = (board) => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
    
        for (const [a, b, c] of winningCombinations) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                setWinningCombination([a, b, c]);
                return board[a]
            }
        }
    
        if (board.every((cell) => cell !== null)) {
            return "draw";
        }
    
        return null;
    };

    // useEffect(() => {
    //     const winner = checkWinner(board);
    //     if (winner) {
    //         setGameOver(true);
    //         if (winner === "draw") {
    //             setBoardWinner("It's a draw!");
    //         } else {
    //             setBoardWinner(`${winner === "O" ? "You" : "AI"} wins!`);
    //         }
    //     }
    // }, [isO]);

    return (
        <div className="ox-main">
            <h3 className="winner">{boardWinner}</h3>
            <div className={`processing ${isProcessing ? "" : "d-none"}`}></div>
            <div className="ox-wrapper">
                {board.map((value, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`ox-selector ${value ? "selected" : ""} ${winningCombination.includes(index) ? 'winning' : ''}`}
                        onClick={() => handleClick(index)}
                    >
                        {value === "human" && <img src={oIcon} alt="O" />}
                        {value === "bot" && <img src={xIcon} alt="X" />}
                    </button>
                ))}
            </div>
            {gameOver ? <button type="button" className="reset-game">Play again</button> : ""}
        </div>
    );
}
