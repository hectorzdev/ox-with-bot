import React, { useState, useEffect } from "react";
import oIcon from "./imgs/o-icon.png";
import xIcon from "./imgs/x-icon.png";
import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
const HUMAN_PLAYER = oIcon;
const AI_PLAYER = xIcon;
const WIN_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export default function Game({ onGameEnd }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isO, setIsO] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [boardWinner, setBoardWinner] = useState("");
    const [winningCombo, setWinningCombo] = useState([]);

    const playAgain = (index) => {
        setWinningCombo([])
        setBoardWinner("")
        setGameOver(false)
        setIsO(true)
        setBoard(Array(9).fill(null))
    };

    const handleClick = (index) => {
        const storedToken = localStorage.getItem("ox_token");
        if (!storedToken) {
            alert("Please Login.");
            return;
        }
        if (board[index] === null && isO && !gameOver) {
            const newBoard = [...board];
            newBoard[index] = HUMAN_PLAYER;
            setBoard(newBoard);
            setIsO(false);
        }
    };

    useEffect(() => {
        const winner = checkWinner(board);
        if (winner) {
            setGameOver(true);
            let result 
            if (winner === "draw") {
                result = "draw"
                setBoardWinner("It's a draw!");
            } else {
                setBoardWinner(`${winner === oIcon ? "You" : "AI"} wins!`);
                if(winner == oIcon){
                    result = "win"
                }else{
                    result = "loss"
                }

            }
            if (winner !== "draw") {
                const winningIndices = WIN_COMBINATIONS.find(([a, b, c]) =>
                    board[a] && board[a] === board[b] && board[a] === board[c]
                );
                setWinningCombo(winningIndices || []);
            }

            const storedToken = localStorage.getItem("ox_token");
            if(storedToken){
                axios.post(`${apiEndpoint}/save-result`, {
                    result: result,
                    token: storedToken
                })
                .then(response => {
                    console.log(response)
                    onGameEnd(response.data.point, response.data.consecutiveWins);
                })
                .catch(error => {
                    console.error('Error saving result:', error);
                });
            }
        } else if (!isO && !gameOver) {
            botMove();
        }
    }, [board, isO, gameOver]);

    const botMove = () => {
        const move = minimax(board, AI_PLAYER).index;
        const newBoard = [...board];
        newBoard[move] = AI_PLAYER;
        setBoard(newBoard);
        setIsO(true);
    };

    const minimax = (newBoard, player) => {
        // ค้นหาตำแหน่งที่ว่างในกระดาน
        const availableSpots = newBoard.reduce((acc, curr, idx) => {
            if (curr === null) acc.push(idx);
            return acc;
        }, []);
    
        // ตรวจสอบว่ามีผู้ชนะหรือไม่ และกำหนดคะแนนให้ตามผลลัพธ์
        if (checkWinner(newBoard) === HUMAN_PLAYER) {
            return { score: -5 }; // ผู้เล่นมนุษย์ชนะ
        } else if (checkWinner(newBoard) === AI_PLAYER) {
            return { score: 5 }; // บอทชนะ
        } else if (availableSpots.length === 0) {
            return { score: 0 }; // เสมอ
        }
    
        // สร้างการเคลื่อนไหวที่เป็นไปได้
        const moves = availableSpots.map((spot) => {
            const move = { index: spot };
            newBoard[spot] = player; // ทำการเคลื่อนไหว
            const result = minimax(newBoard, player === AI_PLAYER ? HUMAN_PLAYER : AI_PLAYER); // เรียกฟังก์ชัน minimax ซ้ำ
            move.score = result.score; // เก็บคะแนนของการเคลื่อนไหวนี้
            newBoard[spot] = null; // ยกเลิกการเคลื่อนไหวเพื่อการคำนวณครั้งถัดไป
            return move;
        });
    
        // เพิ่มความสุ่มให้กับการตัดสินใจของบอท
        if (player === AI_PLAYER) {
            if (Math.random() < 0.1) { // 20% ของเวลาที่บอทจะเลือกแบบสุ่ม
                const randomMove = Math.floor(Math.random() * moves.length);
                return moves[randomMove]; // เลือกการเคลื่อนไหวแบบสุ่ม
            }
        }
    
        // ค้นหาการเคลื่อนไหวที่ดีที่สุด
        return moves.reduce((bestMove, move) => {
            if (
                (player === AI_PLAYER && move.score > bestMove.score) ||
                (player !== AI_PLAYER && move.score < bestMove.score)
            ) {
                return move;
            }
            return bestMove;
        });
    };
    

    const checkWinner = (board) => {
        for (let [a, b, c] of WIN_COMBINATIONS) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (board.every((cell) => cell !== null)) return "draw";
        return null;
    };

    return (
        <div className="ox-main">
            <h3 className="winner">{boardWinner}</h3>
            <div className="ox-wrapper">
                {board.map((icon, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`ox-selector ${icon ? "selected" : ""} ${winningCombo.includes(index) ? "winning" : ""}`}
                        onClick={() => handleClick(index)}
                    >
                        {icon && <img src={icon} alt={isO ? "O" : "X"} />}
                    </button>
                ))}
            </div>
            {gameOver ? <button type="button" onClick={playAgain} className="reset-game">Play again</button> : ""}
        </div>
    );
}
