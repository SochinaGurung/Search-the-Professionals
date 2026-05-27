import { useState } from "react";
import "./diceroll.css";

export default function DiceRollGame() {
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [computerValue, setComputerValue] = useState<number | null>(null);
  const [result, setResult] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [userWins, setUserWins] = useState<number>(0);
  const [computerWins, setComputerWins] = useState<number>(0);


  const rollDice = () => {
    const userRoll = Math.floor(Math.random() * 6) + 1; // 1-6
    const compRoll = Math.floor(Math.random() * 6) + 1;

    setDiceValue(userRoll);
    setComputerValue(compRoll);

    if (userRoll > compRoll) {
      setResult("You Win! 🎉");
      setScore(score + 1);
      setUserWins(userWins + 1);      
    } else if (userRoll < compRoll) {
      setResult("You Lose 😢");
      setScore(score - 1);
      setComputerWins(computerWins + 1); 
    } else {
      setResult("It's a Draw!");
    }
  };

    const resetGame = () => {
    setDiceValue(null);
    setComputerValue(null);
    setResult("");
    setScore(0);
    setUserWins(0);
    setComputerWins(0);
  };


  return (
    <div className="dice-container">
      <h3>Dice Roll Game 🎲</h3>

      <div className="dice-values">
        {diceValue && <p>You rolled: {diceValue}</p>}
        {computerValue && <p>Computer rolled: {computerValue}</p>}
      </div>

      {result && <h4 className="dice-result">{result}</h4>}

      <p>You won {userWins} times.</p>
      <p>The computer won {computerWins} times.</p>

      <div className="dice-buttons">
        <button onClick={rollDice}>Roll Dice</button>
        <button onClick={resetGame} className="reset-btn">Reset</button>
      </div>
    </div>
  );
}
