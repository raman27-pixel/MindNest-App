import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, CheckCircle2, XCircle, Trophy, ChevronRight } from 'lucide-react';

interface FillQuestion {
  id: number;
  sentence: string;
  blank: string;
  options: string[];
  correct: string;
  emoji: string;
}

const JOURNEY_QUESTIONS: FillQuestion[] = [
  {
    id: 1,
    sentence: 'Rita grew up in the city of',
    blank: '___',
    options: ['Tezpur', 'Mumbai', 'Delhi'],
    correct: 'Tezpur',
    emoji: '🏠'
  },
  {
    id: 2,
    sentence: "Rita's loving son's name is",
    blank: '___',
    options: ['Rohan', 'Gaurav', 'Amit'],
    correct: 'Gaurav',
    emoji: '👨'
  },
  {
    id: 3,
    sentence: "Rita's favourite festival is",
    blank: '___',
    options: ['Diwali', 'Holi', 'Bihu'],
    correct: 'Bihu',
    emoji: '🎉'
  },
  {
    id: 4,
    sentence: 'The great river near Rita\'s home is the',
    blank: '___',
    options: ['Ganga', 'Brahmaputra', 'Yamuna'],
    correct: 'Brahmaputra',
    emoji: '🌊'
  },
  {
    id: 5,
    sentence: "Rita's favourite sweet dish is",
    blank: '___',
    options: ['Gulab Jamun', 'Pitha', 'Jalebi'],
    correct: 'Pitha',
    emoji: '🍮'
  },
  {
    id: 6,
    sentence: "Rita's husband's name was",
    blank: '___',
    options: ['Suresh', 'Rajan', 'Mukul'],
    correct: 'Mukul',
    emoji: '🧓'
  },
  {
    id: 7,
    sentence: 'Rita loves listening to the music of',
    blank: '___',
    options: ['Kishore Kumar', 'Bhupen Hazarika', 'Lata Mangeshkar'],
    correct: 'Bhupen Hazarika',
    emoji: '🎵'
  },
  {
    id: 8,
    sentence: 'Rita\'s childhood home had a beautiful',
    blank: '___',
    options: ['Garden', 'Wooden Veranda', 'Pond'],
    correct: 'Wooden Veranda',
    emoji: '🌿'
  }
];

export const JourneyActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const current = JOURNEY_QUESTIONS[currentIdx];
  const total = JOURNEY_QUESTIONS.length;
  const progress = ((currentIdx) / total) * 100;

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'hi-IN';
      utt.rate = 0.85;
      window.speechSynthesis.speak(utt);
    }
  };

  useEffect(() => {
    if (!finished) {
      speak(`${current.sentence} ... blank`);
    }
  }, [currentIdx]);

  const handleSelect = (option: string) => {
    if (selected !== null) return;
    setSelected(option);
    setShowFeedback(true);
    const isCorrect = option === current.correct;
    if (isCorrect) {
      setScore(s => s + 1);
      speak(`Correct! ${current.correct}`);
    } else {
      speak(`The answer is ${current.correct}`);
    }
    setTimeout(() => {
      setShowFeedback(false);
      setSelected(null);
      if (currentIdx + 1 >= total) {
        setFinished(true);
      } else {
        setCurrentIdx(i => i + 1);
      }
    }, 1800);
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setShowFeedback(false);
    window.speechSynthesis.cancel();
  };

  if (finished) {
    const percentage = Math.round((score / total) * 100);
    return (
      <div className="min-h-screen bg-[#F4F7FB] pb-24 pt-3 px-4 max-w-md mx-auto flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-5xl shadow-lg">
          <Trophy className="w-12 h-12 text-amber-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 font-heading text-center">
          Well Done, Rita Ji! 🎉
        </h2>
        <div className="bg-white rounded-[28px] p-6 shadow-clay-card border border-white text-center w-full">
          <p className="text-5xl font-black text-[#0E8765] mb-1">{score}/{total}</p>
          <p className="text-base font-bold text-slate-500">You remembered {percentage}% of your life journey!</p>
          <div className="w-full bg-slate-100 rounded-full h-3 mt-4 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-[#0E8765] to-emerald-400 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <p className="text-lg font-bold text-slate-600 text-center px-4">
          {percentage >= 80
            ? 'Amazing! Your memories are shining bright. ✨'
            : percentage >= 50
            ? 'Good effort! Every memory is precious. 💛'
            : 'Your family loves you always. 💖'}
        </p>
        <button
          onClick={handleReset}
          className="w-full min-h-[58px] rounded-[24px] bg-[#0E8765] text-white font-black text-lg font-heading shadow-clay-primary flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-[#0B6D52] active:scale-98"
        >
          <RefreshCw className="w-5 h-5" />
          Play Again
        </button>
        <button
          onClick={() => navigate('/patient/activities')}
          className="text-sm font-bold text-slate-400 underline"
        >
          Back to Activities
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24 pt-3 px-4 max-w-md mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/patient/activities')}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-black text-slate-800 font-heading">My Life Journey</h1>
        <button
          onClick={handleReset}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all"
          aria-label="Reset"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs font-black text-slate-400">
          <span>Question {currentIdx + 1} of {total}</span>
          <span>Score: {score} ⭐</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#0E8765] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-[28px] p-6 shadow-clay-card border border-white flex flex-col items-center gap-4 text-center">
        <span className="text-5xl">{current.emoji}</span>
        <p className="text-xl sm:text-2xl font-black text-slate-800 font-heading leading-snug">
          {current.sentence}{' '}
          <span className="inline-block bg-[#E6F5EF] text-[#0E8765] px-3 py-0.5 rounded-xl border-2 border-dashed border-[#0E8765]">
            {selected ? selected : '  ?  '}
          </span>
        </p>
        <p className="text-xs font-semibold text-slate-400">Tap the correct answer below</p>
      </div>

      {/* Answer Options */}
      <div className="flex flex-col gap-3">
        {current.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === current.correct;
          let btnClass = 'bg-white border-2 border-white text-slate-800';
          if (showFeedback && isSelected) {
            btnClass = isCorrect
              ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-800'
              : 'bg-red-100 border-2 border-red-400 text-red-800';
          } else if (showFeedback && isCorrect) {
            btnClass = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-800';
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
              className={`w-full min-h-[60px] rounded-[22px] ${btnClass} font-black text-lg font-heading shadow-clay-card flex items-center justify-between px-5 transition-all active:scale-98 cursor-pointer`}
            >
              <span>{option}</span>
              {showFeedback && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
              {showFeedback && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
              {!showFeedback && <ChevronRight className="w-5 h-5 text-slate-300" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyActivityPage;
