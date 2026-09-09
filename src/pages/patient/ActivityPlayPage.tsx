import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, HelpCircle, CheckCircle2, Volume2, ArrowRight } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { VoiceButton } from '../../components/ui/VoiceButton';
import { ActivityEngine } from '../../services/activityEngine';
import { db } from '../../services/db';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { t } from '../../locales/i18n';
import { CognitiveActivity, ActivityType, ActivityQuestion } from '../../types';

export const ActivityPlayPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedType = (searchParams.get('type') as ActivityType) || 'photo_recognition';
  const { settings } = useAccessibility();
  const lang = settings.language;

  const [activity, setActivity] = useState<CognitiveActivity | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [hintShown, setHintShown] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Stats for the 7-question session
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState<number>(0);
  const [totalHintsCount, setTotalHintsCount] = useState<number>(0);

  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    const approvedMemories = db.getAiApprovedMemories();
    const act = ActivityEngine.generateActivity(approvedMemories, requestedType, 'EASY', 7, lang);
    setActivity(act);
    setCurrentQuestionIndex(0);
    setCorrectAnswersCount(0);
    setWrongAnswersCount(0);
    setTotalHintsCount(0);
  }, [requestedType, lang]);

  if (!activity || !activity.questions || activity.questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] pb-28 pt-12 px-4 max-w-2xl mx-auto flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#6C63FF]/20 text-[#6C63FF] flex items-center justify-center animate-spin">
          <Sparkles className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 font-heading">
          {t('common.loading', lang)}
        </h2>
      </div>
    );
  }

  const currentQ: ActivityQuestion = activity.questions[currentQuestionIndex];
  const totalQuestions = activity.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleChoiceClick = (choiceId: string) => {
    if (isAnswerSubmitted) return; // Prevent multiple clicks on same question

    setSelectedChoiceId(choiceId);
    setIsAnswerSubmitted(true);

    const isCorrect = choiceId === currentQ.correctChoiceId;

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      setFeedback(t('patient.greatJob', lang));
    } else {
      setWrongAnswersCount(prev => prev + 1);
      setFeedback(t('patient.gentleFeedback', lang));
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Finished all 7 questions! Record session in db
      const durationSeconds = Math.max(15, Math.round((Date.now() - startTimeRef.current) / 1000));
      const totalCorrect = correctAnswersCount + (selectedChoiceId === currentQ.correctChoiceId ? 1 : 0);

      db.recordSession({
        patientId: 'patient-anita-123',
        activityId: activity.id,
        activityType: activity.type,
        difficulty: activity.difficulty,
        startedAt: new Date(startTimeRef.current).toISOString(),
        completedAt: new Date().toISOString(),
        durationSeconds,
        completed: true,
        skipped: false,
        assistanceRequested: totalHintsCount > 0,
        hesitationCount: totalHintsCount,
        correctCount: totalCorrect,
        wrongCount: 7 - totalCorrect,
        totalQuestions: 7,
        hintCount: totalHintsCount,
        voiceInteractionUsed: settings.voiceEnabled
      });

      navigate('/patient/activity-result', {
        state: {
          activityTitle: activity.title,
          correctCount: totalCorrect,
          totalQuestions: 7,
          durationSeconds
        }
      });
      return;
    }

    // Advance to next question
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedChoiceId(null);
    setIsAnswerSubmitted(false);
    setHintShown(false);
    setFeedback(null);
  };

  const handleNeedHelp = () => {
    setHintShown(true);
    setTotalHintsCount(prev => prev + 1);
    const correctChoice = currentQ.choices.find(c => c.id === currentQ.correctChoiceId);
    setFeedback(`Gentle reminder: Look at "${correctChoice?.text}". Take your time.`);
  };

  const speechText = `${currentQ.prompt}. Choice 1: ${currentQ.choices[0]?.text}. Choice 2: ${currentQ.choices[1]?.text}. Choice 3: ${currentQ.choices[2]?.text}. Choice 4: ${currentQ.choices[3]?.text}.`;

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-32 pt-4 px-4 md:px-8 max-w-3xl mx-auto flex flex-col gap-5">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patient/activities')}
          className="w-12 h-12 rounded-[18px] bg-white shadow-clay-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-[#0E8765]" />
        </button>

        {/* Question X of 7 Progress Badge */}
        <div className="bg-white px-5 py-2 rounded-full shadow-clay-sm border border-slate-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0E8765] animate-pulse"></span>
          <span className="text-sm font-black text-slate-800 font-heading">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/80 h-3 rounded-full overflow-hidden shadow-inner">
        <div 
          className="bg-[#0E8765] h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Active Question Clay Card */}
      <ClayCard padding="xl" className="flex flex-col gap-6 border-2 border-white shadow-clay-card relative">
        {/* Optional Memory Photo */}
        {currentQ.memoryImageUrl && (
          <div className="w-full h-56 sm:h-72 rounded-[28px] overflow-hidden shadow-md border-2 border-white relative">
            <img
              src={currentQ.memoryImageUrl}
              alt={currentQ.memoryTitle || 'Family Memory'}
              className="w-full h-full object-cover"
            />
            {currentQ.memoryTitle && (
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold">
                {currentQ.memoryTitle}
              </div>
            )}
          </div>
        )}

        {/* Prompt & Voice Readout */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-heading leading-snug">
              {currentQ.prompt}
            </h2>
            <VoiceButton textToSpeak={speechText} label="Listen" size="md" />
          </div>
          {currentQ.instructions && (
            <p className="text-base font-bold text-slate-500">
              {currentQ.instructions}
            </p>
          )}
        </div>

        {/* 4 Choices Grid (Minimum 4 Options Required) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQ.choices.map((choice, idx) => {
            const isSelected = selectedChoiceId === choice.id;
            const isCorrect = choice.id === currentQ.correctChoiceId;

            let buttonClass = 'bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 shadow-clay-card';

            if (isAnswerSubmitted) {
              if (isCorrect) {
                buttonClass = 'bg-emerald-50 border-4 border-emerald-500 text-emerald-900 shadow-md scale-102';
              } else if (isSelected) {
                buttonClass = 'bg-amber-50 border-2 border-amber-400 text-amber-900';
              } else {
                buttonClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={choice.id}
                onClick={() => handleChoiceClick(choice.id)}
                disabled={isAnswerSubmitted}
                className={`
                  min-h-[68px] p-4 sm:p-5 rounded-[24px] text-left font-extrabold flex items-center gap-4 transition-all
                  ${buttonClass}
                `}
              >
                {/* Visual Option Letter A, B, C, D */}
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-base font-black text-slate-700 shrink-0 font-heading">
                  {String.fromCharCode(65 + idx)}
                </div>

                {choice.imageUrl && (
                  <img
                    src={choice.imageUrl}
                    alt={choice.text}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                )}

                <span className="text-lg sm:text-xl font-extrabold flex-1">
                  {choice.text}
                </span>

                {isAnswerSubmitted && isCorrect && (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Encouraging Feedback Banner */}
        {feedback && (
          <div className={`p-4 rounded-[22px] flex items-center gap-3 font-bold text-base sm:text-lg animate-fade-in ${
            selectedChoiceId === currentQ.correctChoiceId ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}>
            <Sparkles className="w-6 h-6 shrink-0 text-[#6C63FF]" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Bottom Actions: Hint or Next */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleNeedHelp}
              className="clay-btn-neutral px-5 py-3 rounded-2xl flex items-center gap-2 text-sm font-extrabold text-amber-700 hover:text-amber-800"
            >
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <span>{t('patient.needHelp', lang)}</span>
            </button>
          ) : (
            <ClayButton
              variant="primary"
              size="patient"
              onClick={handleNextQuestion}
              className="w-full sm:w-auto"
              icon={<ArrowRight className="w-7 h-7" />}
            >
              {isLastQuestion ? 'Complete Activity' : t('common.next', lang)}
            </ClayButton>
          )}
        </div>
      </ClayCard>
    </div>
  );
};
