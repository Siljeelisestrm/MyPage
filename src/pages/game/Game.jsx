import React, { useState, useEffect } from "react";
import Button from "../../components/button/Button";
import "./Game.css";

const GRID_SIZE = 10;
const GAME_TIME = 30; // sekunder

export default function Game() {
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [dotPos, setDotPos] = useState({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("catchTheDotHighScore");
    return saved ? Number(saved) : 0;
  });

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(GAME_TIME);
    setPlayerPos({ x: 0, y: 0 });
    setDotPos({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
  };

  // Nedtelling
  useEffect(() => {
    if (!isPlaying) return;

    if (timeLeft === 0) {
      setIsPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("catchTheDotHighScore", score);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, highScore]);

  // Tastaturkontroll
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e) => {
      setPlayerPos((prev) => {
        let { x, y } = prev;
        if (e.key === "ArrowUp" && y > 0) y--;
        if (e.key === "ArrowDown" && y < GRID_SIZE - 1) y++;
        if (e.key === "ArrowLeft" && x > 0) x--;
        if (e.key === "ArrowRight" && x < GRID_SIZE - 1) x++;
        return { x, y };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  // Fange dot
  useEffect(() => {
    if (!isPlaying) return;
    if (playerPos.x === dotPos.x && playerPos.y === dotPos.y) {
      setScore((s) => s + 1);
      setDotPos({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
    }
  }, [playerPos, dotPos, isPlaying]);

  return (
    <div style={{ color: "var(--midnight)" }}>
      <h2>Catch the Dot!</h2>
      <p>Highscore: {highScore}</p>

      {/* Startskjerm */}
      {!isPlaying && timeLeft === GAME_TIME && (
        <div className="start-screen">
          <Button
            onClick={startGame}
            style={{
              backgroundColor: "var(--coralGreen)",
              color: "var(--midnight)",
            }}
          >
            Start Spill
          </Button>
        </div>
      )}

      {/* Spillet */}
      {isPlaying && (
        <div>
          <p>Tid igjen: {timeLeft}s</p>
          <p>Poeng: {score}</p>
          <div className="grid">
            {Array.from({ length: GRID_SIZE }).map((_, y) =>
              Array.from({ length: GRID_SIZE }).map((_, x) => {
                const isPlayer = playerPos.x === x && playerPos.y === y;
                const isDot = dotPos.x === x && dotPos.y === y;
                return (
                  <div
                    key={`${x}-${y}`}
                    className="cell"
                    style={{
                      backgroundColor: isPlayer
                        ? "var(--softWhite)"
                        : isDot
                        ? "var(--blood)"
                        : "var(--midnight)",
                    }}
                  ></div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Sluttskjerm */}
      {!isPlaying && timeLeft !== GAME_TIME && (
        <div className="end-screen">
          <h2>Spillet er over!</h2>
          <p>Du fikk {score} poeng!</p>
          <Button
            onClick={startGame}
            style={{
              backgroundColor: "var(--coralGreen)",
              color: "var(--midnight)",
            }}
          >
            Spill igjen
          </Button>
        </div>
      )}
    </div>
  );
}
