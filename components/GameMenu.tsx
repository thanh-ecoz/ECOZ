import React from 'react';
import { getAudioContext } from '../services/geminiService';

interface GameMenuProps {
  onStart: () => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({ onStart }) => {
  const handleStart = async () => {
    // Initialize AudioContext on user gesture
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    onStart();
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl text-center max-w-md w-full border-4 border-green-200 animate-fade-in">
      <div className="mb-6">
        <div className="text-6xl mb-4 animate-bounce">🦁</div>
        <h2 className="text-3xl font-bold text-green-800 mb-2">Bé đã sẵn sàng chưa?</h2>
        <p className="text-green-600 mb-6">
          Lắng nghe câu đố tiếng Anh và đoán tên con vật nhé!
          <br/>
          <span className="text-sm italic font-semibold text-green-500">(Dành cho trình độ Movers)</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-xl text-left border border-green-100">
          <h3 className="font-bold text-green-800 mb-2">Cách chơi:</h3>
          <ul className="text-sm text-green-700 space-y-3">
            <li className="flex items-center"><span className="text-xl mr-2">👂</span> <strong>Nghe</strong> mô tả bằng tiếng Anh.</li>
            <li className="flex items-center"><span className="text-xl mr-2">🤔</span> <strong>Đoán</strong> xem đó là bạn nào.</li>
            <li className="flex items-center"><span className="text-xl mr-2">🏆</span> <strong>Ghi điểm</strong> khi trả lời đúng!</li>
          </ul>
        </div>

        <button 
          onClick={handleStart}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all transform hover:scale-105 shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1"
        >
          BẮT ĐẦU CHƠI ▶
        </button>
      </div>
    </div>
  );
};