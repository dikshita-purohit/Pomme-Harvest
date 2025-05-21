import React from 'react';
import './App.css';

function App() {
  const handlePlayClick = () => {
    window.location.href = './Main';
  };

  return (
    <div className="body">
      <a className="card credentialing" href="#" onClick={(e) => e.preventDefault()}>
        <div className="overlay"></div>
        <div className="circle">
          <p className="btn" onClick={handlePlayClick}>Play</p>
          
        </div>
        <h2>Pomme Harvest</h2>
      </a><br></br>
      <h1>“Catch the fall, fill your basket -welcome to the sweetest harvest!”</h1>
    </div>
  );
}

export default App;
