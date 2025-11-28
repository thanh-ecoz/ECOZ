import React from 'react';
import { TOTAL_ROUNDS, POINTS_PER_CORRECT } from '../constants';

interface ResultScreenProps {
  score: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, onRestart }) => {
  const maxScore = TOTAL_ROUNDS * POINTS_PER_CORRECT;
  const percentage = (score / maxScore) * 100;

  let message = "";
  let emoji = "";

  if (percentage === 100) {
    message = "Xuất sắc! Bé là chuyên gia động vật!";
    emoji = "🏆";
  } else if (percentage >= 70) {
    message = "Làm tốt lắm! Bé biết rất nhiều con vật!";
    emoji = "🌟";
  } else {
    message = "Cố gắng lên nhé! Hãy thử lại nào!";
    emoji = "📚";
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl text-center max-w-md w-full border-4 border-green-200 animate-scale-up">
      <div className="text-8xl mb-4">{emoji}</div>
      <h2 className="text-3xl font-bold text-green-800 mb-2">Hoàn thành!</h2>
      
      <div className="my-8 bg-green-50 p-6 rounded-2xl border border-green-100">
        <div className="text-green-600 font-bold uppercase text-sm tracking-wider mb-2">Tổng điểm của bé</div>
        <div className="text-6xl font-black text-green-600 tracking-tighter">{score} <span className="text-2xl text-gray-400 font-normal">/ {maxScore}</span></div>
      </div>

      <p className="text-xl text-slate-700 font-bold mb-8 px-4">
        {message}
      </p>

      <button 
        onClick={onRestart}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all transform hover:scale-105 shadow-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1"
      >
        Chơi Lại ↺
      </button>
    </div>
  );
};