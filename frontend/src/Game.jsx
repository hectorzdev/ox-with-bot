import React, { useState, useEffect } from 'react';
import oIcon from './imgs/o-icon.png';
import xIcon from './imgs/x-icon.png';

export default function Game() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isO, setIsO] = useState(true); // true means 'O' player's turn

    const handleClick = (index) => {
      if (board[index] === null) {
        const newBoard = [...board];
        newBoard[index] = isO ? oIcon : xIcon;
        setBoard(newBoard);
        setIsO(!isO);
    
        const winner = checkWinner(newBoard);
        if (winner) {
          if (winner === 'draw') {
            alert("It's a draw!");
          } else {
            alert(`${winner} wins!`);
          }
          // ล้างบอร์ดและรีเซ็ตสถานะหลังจากแสดงผลลัพธ์
          setTimeout(() => {
            setBoard(Array(9).fill(null)); // รีเซ็ตบอร์ด
            setIsO(true); // รีเซ็ตสถานะเพื่อให้ 'O' เริ่มเล่นใหม่
          }, 2000); // รอ 2 วินาทีก่อนรีเซ็ต
        }
      }
    };

    useEffect(() => {
      if (!isO) { 
        botMove();
      }
    }, [isO]); // ใช้ isO เท่านั้น
    
    const botMove = () => {
      if (!isO) {
        const emptyIndices = board.map((value, index) => value === null ? index : null).filter(index => index !== null);
        if (emptyIndices.length > 0) {
          const randomMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          const newBoard = [...board];
          newBoard[randomMove] = xIcon;
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
        [2, 4, 6]
      ];
    
      // ตรวจสอบผู้ชนะ
      for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a]; // คืนค่า icon ของผู้ชนะ
        }
      }
    
      // ตรวจสอบว่าเสมอหรือยัง
      if (board.every(cell => cell !== null)) {
        return 'draw'; // คืนค่า 'draw' หากทุกช่องเต็มแล้ว
      }
    
      return null; // ยังไม่มีผู้ชนะ
    };
    

    useEffect(() => {
        if (!isO) { 
            botMove();
        }
    }, [board, isO]);

    return (
        <div className="ox-wrapper">
            {board.map((icon, index) => (
                <button
                    key={index}
                    type="button"
                    className={`ox-selector ${icon ? 'selected' : ''}`}
                    onClick={() => handleClick(index)}
                >
                    {icon && <img src={icon} alt={isO ? 'O' : 'X'} />}
                </button>
            ))}
        </div>
    );
}
