import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Animal, AudioStatus } from '../types';
import { ANIMALS, TOTAL_ROUNDS, POINTS_PER_CORRECT } from '../constants';
import { generateRiddle, generateAndPlaySpeech } from '../services/geminiService';
import { AnimalCard } from './AnimalCard';

interface GameScreenProps {
  onFinish: (score: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onFinish }) => {
  const [round, setRound] = useState(1);
  const [currentScore, setCurrentScore] = useState(0);
  const [targetAnimal, setTargetAnimal] = useState<Animal | null>(null);
  const [options, setOptions] = useState<Animal[]>([]);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('loading');
  const [riddleText, setRiddleText] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // To prevent double execution of effects
  const roundInitialized = useRef(false);

  // Initialize round
  const startRound = useCallback(async (currentRoundNumber: number) => {
    setAudioStatus('loading');
    setRiddleText("");
    setSelectedId(null);
    setIsCorrect(null);
    
    // Pick random target
    const target = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setTargetAnimal(target);

    // Pick 3 random distractors distinct from target
    const others = ANIMALS.filter(a => a.id !== target.id);
    const shuffledOthers = others.sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3);
    
    // Combine and shuffle options
    const roundOptions = [target, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(roundOptions);

    // Generate Content
    try {
      const riddle = await generateRiddle(target.name);
      setRiddleText(riddle);
      
      setAudioStatus('playing');
      await generateAndPlaySpeech(riddle);
      setAudioStatus('idle');
    } catch (e) {
      console.error("Game loop error", e);
      setAudioStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!roundInitialized.current) {
        startRound(1);
        roundInitialized.current = true;
    }
  }, [startRound]);

  const handleReplay = async () => {
    if (audioStatus === 'playing' || !riddleText) return;
    setAudioStatus('playing');
    await generateAndPlaySpeech(riddleText);
    setAudioStatus('idle');
  };

  const handleAnswer = (id: string) => {
    if (selectedId || !targetAnimal) return; // Prevent multiple clicks

    setSelectedId(id);
    const correct = id === targetAnimal.id;
    setIsCorrect(correct);

    if (correct) {
      setCurrentScore(prev => prev + POINTS_PER_CORRECT);
    }

    // Auto advance after delay
    setTimeout(() => {
      if (round < TOTAL_ROUNDS) {
        setRound(prev => prev + 1);
        startRound(round + 1);
      } else {
        onFinish(currentScore + (correct ? POINTS_PER_CORRECT : 0));
      }
    }, 2500);
  };

  if (!targetAnimal) return (
    <div className="flex flex-col items-center justify-center p-10 animate-pulse text-green-700">
        <div className="text-4xl mb-4">🐾</div>
        <div className="text-xl font-bold">Đang chuẩn bị vườn thú...</div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl px-4">
      {/* Progress Bar */}
      <div className="w-full bg-green-200 rounded-full h-4 mb-6 border-2 border-green-300">
        <div 
          className="bg-green-500 h-full rounded-full transition-all duration-500 relative"
          style={{ width: `${(round / TOTAL_ROUNDS) * 100}%` }}
        >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white border-2 border-green-500 w-3 h-3 rounded-full"></div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-xl text-green-600 mb-2 font-bold uppercase tracking-wider bg-white/50 inline-block px-4 py-1 rounded-full">
            Vòng {round} / {TOTAL_ROUNDS}
        </h2>
        
        {/* Interaction Area */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-100 min-h-[160px] flex flex-col items-center justify-center relative">
          
          {/* Status Indicator */}
          {audioStatus === 'loading' && (
             <div className="flex flex-col items-center space-y-2 text-green-600">
               <span className="animate-spin text-4xl">⏳</span>
               <span className="font-medium">Đang nghĩ câu đố...</span>
             </div>
          )}

          {audioStatus === 'playing' && (
             <div className="flex flex-col items-center space-y-2 text-green-600 animate-pulse font-bold text-lg">
               <span className="text-5xl">🔊</span>
               <span>Đang đọc... Bé nghe kĩ nhé!</span>
             </div>
          )}

          {/* Audio Replay & Text Fallback */}
          {(audioStatus === 'idle' || audioStatus === 'error') && (
            <div className="w-full">
               <button 
                onClick={handleReplay}
                className="mb-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-2 border-yellow-300 px-6 py-2 rounded-full font-bold flex items-center justify-center mx-auto transition-colors gap-2"
               >
                 <span>🔊</span> Nghe Lại
               </button>
               
               {/* Reveal text after selection to help learning */}
               {selectedId && (
                 <div className="animate-fade-in bg-slate-50 p-3 rounded-lg border border-slate-200 inline-block">
                    <p className="text-lg text-slate-700 font-medium italic">
                    "{riddleText}"
                    </p>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {options.map((animal) => {
          let status: 'default' | 'correct' | 'wrong' | 'dimmed' = 'default';
          
          if (selectedId) {
             if (animal.id === targetAnimal.id) {
               status = 'correct';
             } else if (animal.id === selectedId) {
               status = 'wrong';
             } else {
               status = 'dimmed';
             }
          }

          return (
            <AnimalCard
              key={animal.id}
              animal={animal}
              onClick={() => handleAnswer(animal.id)}
              disabled={!!selectedId || audioStatus === 'loading'}
              status={status}
            />
          );
        })}
      </div>
      
      {/* Feedback Message */}
      {selectedId && (
        <div className={`mt-6 text-center font-bold text-2xl animate-bounce ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
          {isCorrect ? "Chính xác! Giỏi quá! 🎉" : `Tiếc quá! Đó là bạn ${targetAnimal.vietnameseName} cơ.`}
        </div>
      )}
    </div>
  );
};