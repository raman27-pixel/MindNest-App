import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  Coffee, 
  Pill, 
  Heart, 
  ChevronRight,
  Smile
} from 'lucide-react';
import { db } from '../../services/db';
import { DailyTaskItem, DailyTaskStep } from '../../types';
import { sanitizeTextForSpeech } from '../../services/speechSanitizer';

export const DailyTasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<DailyTaskItem[]>(db.getDailyTasks());
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || 'task-teeth');

  useEffect(() => {
    return db.subscribe(() => {
      setTasks(db.getDailyTasks());
    });
  }, []);

  const activeTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];
  const currentStep: DailyTaskStep = activeTask.steps[activeTask.currentStepIndex] || activeTask.steps[0];
  const isLastStep = activeTask.currentStepIndex >= activeTask.totalSteps - 1;

  const handleAdvanceStep = () => {
    db.advanceDailyTaskStep(activeTask.id);
  };

  const handleReset = () => {
    db.resetDailyTask(activeTask.id);
  };

  const handleSpeakStep = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = sanitizeTextForSpeech(currentStep.voicePrompt || currentStep.instruction);
      const u = new SpeechSynthesisUtterance(clean);
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-28 pt-3 px-4 max-w-md mx-auto flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/patient/home')}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-black text-slate-800 font-heading">
          Daily Tasks
        </h1>

        <button
          onClick={handleSpeakStep}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-[#0E8765] hover:bg-slate-50 transition-all"
          aria-label="Read Step Aloud"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Task Selector Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tasks.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTaskId(t.id)}
            className={`px-3.5 py-2 rounded-[20px] text-xs font-black transition-all shrink-0 cursor-pointer ${
              selectedTaskId === t.id
                ? 'bg-[#0E8765] text-white shadow-clay-primary'
                : 'bg-white text-slate-600 border border-white shadow-clay-sm'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Main Step Card (Section 18 from Master Prompt) */}
      <div className="bg-white rounded-[32px] p-6 shadow-clay-card border border-white flex flex-col items-center text-center gap-6 my-auto">
        {/* Step Counter Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F5EF] text-[#0E8765] text-xs font-black">
          <Sparkles className="w-4 h-4" />
          <span>
            Step {currentStep.stepNumber} of {currentStep.totalSteps}
          </span>
        </div>

        {/* Big Illustration / Icon */}
        <div className="w-24 h-24 rounded-[28px] bg-[#E6F5EF] text-[#0E8765] flex items-center justify-center shadow-clay-sm">
          {activeTask.id === 'task-tea' ? (
            <Coffee className="w-12 h-12" />
          ) : activeTask.id === 'task-meds' ? (
            <Pill className="w-12 h-12" />
          ) : (
            <Smile className="w-12 h-12" />
          )}
        </div>

        {/* Large Readable Instruction (22-26px) */}
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading leading-snug px-2">
          "{currentStep.instruction}"
        </h2>

        {/* Action Buttons: Done & Repeat */}
        <div className="flex flex-col gap-3 w-full pt-2">
          {!activeTask.completed ? (
            <button
              onClick={handleAdvanceStep}
              className="w-full min-h-[62px] rounded-[24px] bg-[#0E8765] hover:bg-[#0B6D52] active:scale-98 text-white font-black text-xl font-heading shadow-clay-primary flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>{isLastStep ? 'Finish Task' : 'Done'}</span>
            </button>
          ) : (
            <div className="bg-emerald-100 text-emerald-800 p-4 rounded-[24px] text-base font-black flex items-center justify-center gap-2 animate-fade-in">
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Task Completed! Well done, Asha ❤️</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleSpeakStep}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-500 hover:text-[#0E8765] flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>Repeat Voice</span>
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Over</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <span className="text-xs text-slate-400 font-semibold">
          Adaptive Step Assistant • Never timed, always at your own pace
        </span>
      </div>
    </div>
  );
};
