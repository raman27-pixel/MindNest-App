import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, ArrowUpDown, RefreshCw } from 'lucide-react';
import { db } from '../../services/db';
import { LifeJourneyStep } from '../../types';

export const JourneyActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<LifeJourneyStep[]>(db.getJourneySteps());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleSwap = (idx1: number, idx2: number) => {
    const updated = [...steps];
    const temp = updated[idx1];
    updated[idx1] = updated[idx2];
    updated[idx2] = temp;
    setSteps(updated);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    // Check if order is 1, 2, 3, 4
    const correct = steps.every((s, i) => s.correctOrder === i + 1);
    setIsCorrect(correct);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24 pt-3 px-4 max-w-md mx-auto flex flex-col justify-between">
      {/* Top Header matching Screen 14 */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/patient/activities')}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-black text-slate-800 font-heading">
          Arrange the Journey
        </h1>

        <button
          onClick={() => {
            setSteps([...db.getJourneySteps()]);
            setSubmitted(false);
          }}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all"
          aria-label="Reset"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Container matching Screen 14 */}
      <div className="flex flex-col gap-4 my-auto">
        <div className="text-center px-2">
          <p className="text-base sm:text-lg font-black text-slate-800 font-heading">
            Put these in the correct order (your life journey)
          </p>
          <span className="text-xs text-slate-500 font-semibold">
            Tap two cards to swap their positions
          </span>
        </div>

        {/* 2x2 Grid of Journey Photo Cards matching Screen 14 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              onClick={() => {
                const nextIdx = (idx + 1) % steps.length;
                handleSwap(idx, nextIdx);
              }}
              className="bg-white rounded-[24px] p-2.5 shadow-clay-card border-2 border-white flex flex-col gap-2 cursor-pointer hover:scale-102 transition-transform relative group"
            >
              <div className="w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-slate-100 relative">
                <img
                  src={step.imageUrl}
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs font-black flex items-center justify-center">
                  {idx + 1}
                </div>
              </div>

              <div className="flex flex-col text-center px-1 pb-1">
                <span className="text-base font-black text-slate-800 font-heading">
                  {step.title}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {step.caption}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Message */}
        {submitted && (
          <div className={`p-4 rounded-[22px] text-center text-sm font-black animate-fade-in ${
            isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {isCorrect 
              ? 'Wonderful! You remembered the exact sequence of your life journey ❤️'
              : 'Almost there! Try swapping Work and Family.'}
          </div>
        )}

        {/* Large Teal Submit Button matching Screen 14 */}
        <button
          onClick={handleSubmit}
          className="w-full min-h-[58px] rounded-[24px] bg-[#0E8765] hover:bg-[#0B6D52] active:scale-98 text-white font-black text-lg font-heading shadow-clay-primary flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>Submit</span>
        </button>
      </div>
    </div>
  );
};
