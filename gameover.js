import React, { useEffect } from 'react';
import './gameover.css';

function GameOver() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const score = urlParams.get('score') || 0;
    const scoreElement = document.getElementById('final-score');
    if (scoreElement) {
      scoreElement.innerText = score;
    }
  }, []);

  function restartGame() {
    window.location.href = './Main';
  }

  function goHome() {
    window.location.href = './';
  }

  return (
    <div className="body">
      <h2 style={{ color: 'red', fontSize: '40px' }}>Game Over</h2>
      <div className="score-text">
        Final Score: <span id="final-score">0</span>
      </div>

      <a className="card credentialing" href="#" onClick={(e) => e.preventDefault()}>
        <div className="overlay"></div>
        <div className="circle">
          <p className="btn" onClick={restartGame}>Restart Game</p>
          <p className="btn" onClick={goHome}>Homepage</p>
        </div>
        <h3>Pomme Harvest</h3>
      </a>
    </div>
  );
}

export default GameOver;
