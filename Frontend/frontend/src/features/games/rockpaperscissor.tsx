import { useState } from "react";
import "./rockpaperscissor.css";
import rockImg from "../../assets/rock.png";
import paperImg from "../../assets/paper.png";
import scissorImg from "../../assets/scissor.png";

const choices = [
  { name: "Rock", img: rockImg },
  { name: "Paper", img: paperImg },
  { name: "Scissors", img: scissorImg }
];

export default function RockPaperScissors() {
  const [userChoice, setUserChoice] = useState<string>("");
  const [computerChoice, setComputerChoice] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [userWins, setUserWins] = useState<number>(0);
  const [computerWins, setComputerWins] = useState<number>(0);

  const playGame = (choice: string) => {
    const randomIndex = Math.floor(Math.random() * 3);
    const compChoice = choices[randomIndex].name;

    setUserChoice(choice);
    setComputerChoice(compChoice);

    if (choice === compChoice) {
      setResult("It's a Draw!");
    } else if (
      (choice === "Rock" && compChoice === "Scissors") ||
      (choice === "Paper" && compChoice === "Rock") ||
      (choice === "Scissors" && compChoice === "Paper")
    ) {
      setResult("You Win! 🎉");
      setScore(score + 1);
      setUserWins(userWins + 1);
    } else {
      setResult("You Lose 😢");
      setScore(score - 1);
      setComputerWins(computerWins + 1);
    }
  };

  const resetGame = () => {
    setUserChoice("");
    setComputerChoice("");
    setResult("");
    setScore(0);
    setUserWins(0);
    setComputerWins(0);
  };

  return (
    <div className="rps-container">
      <h3>Rock-Paper-Scissors 🎮</h3>

      <div className="rps-buttons">
        {choices.map((choice) => (
          <button key={choice.name} onClick={() => playGame(choice.name)}>
            <img src={choice.img} alt={choice.name} className="rps-img" />
            <span>{choice.name}</span>
          </button>
        ))}
      </div>

      {userChoice && (
        <div className="rps-result">
          <p>You chose: <b>{userChoice}</b></p>
          <p>Computer chose: <b>{computerChoice}</b></p>
          <h4>{result}</h4>
        </div>
      )}

      <div className="final-result">
        <p>You won {userWins} times.</p>
        <p>The computer won {computerWins} times.</p>
      </div>

      <button className="rps-reset" onClick={resetGame}>Reset</button>
    </div>
  );
}
