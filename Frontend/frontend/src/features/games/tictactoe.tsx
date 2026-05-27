import { useState, useEffect } from "react";
import "./tictactoe.css";

type Player = "X" | "O" | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [result, setResult] = useState<string>("");
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [userWins, setUserWins] = useState<number>(0);
  const [computerWins, setComputerWins] = useState<number>(0);

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

  const checkWinner = (currentBoard: Player[]) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }
    if (!currentBoard.includes(null)) return "Draw";
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || result) return;
    const newBoard = board.slice();
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const computerMove = () => {
    const emptyIndexes = board
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((v) => v !== null) as number[];

    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      const values = [board[a], board[b], board[c]];
      if (values.filter((v) => v === "O").length === 2 && values.includes(null)) {
        const move = combo[values.indexOf(null)];
        return move;
      }
    }

    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      const values = [board[a], board[b], board[c]];
      if (values.filter((v) => v === "X").length === 2 && values.includes(null)) {
        const move = combo[values.indexOf(null)];
        return move;
      }
    }

    if (board[4] === null) return 4;

    const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];


    return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  };

  useEffect(() => {
    if (isPlayerTurn || result) return;

    const move = computerMove();
    if (move === undefined) return;

    const newBoard = board.slice();
    newBoard[move] = "O";
    setBoard(newBoard);
    setIsPlayerTurn(true);
  }, [isPlayerTurn, board, result]);

  useEffect(() => {
  const winner = checkWinner(board);
  if (winner) {
    if (winner === "Draw") {
      setResult("It's a Draw!");
    } else {
      const displayWinner = winner === "X" ? "You" : "I";
      setResult(`${displayWinner} Won! 🎉`);
      setScore((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));

      if (winner === "X") setUserWins((prev) => prev + 1);
      if (winner === "O") setComputerWins((prev) => prev + 1);
    }
  }
}, [board]);



  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setResult("");
    setIsPlayerTurn(true);
  };

  return (
    <div className="tictactoe-container">
      <h3>Tic-Tac-Toe 🎮</h3>
      <p>
        Score: X: {score.X} | O: {score.O}
      </p>
      <div className="board">
        {board.map((cell, idx) => (
          <div key={idx} className="cell" onClick={() => handleClick(idx)}>
            {cell}
          </div>
        ))}
      </div>

      {result && <h4 className="result">{result}</h4>}

      <div className="final-result">
        <p>You won {userWins} times.</p>
        <p>Computer won {computerWins} times.</p>
      </div>

      <button className="reset-btn" onClick={resetGame}>
        Reset
      </button>
    </div>
  );
}
