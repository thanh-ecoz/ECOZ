import React, { useState, useEffect } from 'react';
import { GameState } from './types';
import { GameMenu } from './components/GameMenu';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setScore(0);
    setGameState(GameState.PLAYING);
  };

  const finishGame = (finalScore: number) => {
    setScore(finalScore);
    setGameState(GameState.FINISHED);
  };

  const returnToMenu = () => {
    setGameState(GameState.MENU);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-green-700 tracking-wide drop-shadow-sm flex items-center gap-2">
            🦁 Sound Safari
            </h1>
            <span className="text-green-600/70 text-sm font-semibold pl-1">English for Movers</span>
        </div>
        
        {gameState === GameState.PLAYING && (
           <div className="bg-white px-4 py-2 rounded-full shadow-md text-green-800 font-bold border-2 border-green-200">
             Điểm: {score}
           </div>
        )}
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center mt-16 md:mt-0">
        {gameState === GameState.MENU && <GameMenu onStart={startGame} />}
        {gameState === GameState.PLAYING && <GameScreen onFinish={finishGame} />}
        {gameState === GameState.FINISHED && (
          <ResultScreen score={score} onRestart={returnToMenu} />
        )}
      </main>
      
      <footer className="absolute bottom-4 text-xs md:text-sm text-green-600 opacity-70 text-center w-full">
        Hỗ trợ bởi Gemini AI • Dành cho giáo dục
      </footer>
    </div>
  );
};

export default App;