import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, ChevronRight, CheckCircle2, Volume2, Sparkles } from 'lucide-react';

interface FamilyQuestion {
  id: number;
  question: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  choices: string[];
  correct: string;
  audioPromptHindi: string;
}

const FAMILY_QUESTIONS: FamilyQuestion[] = [
  {
    id: 1,
    question: 'Who is this person in your family?',
    subtitle: 'He visits every morning and brings warm tea',
    image: '/images/person_son_gaurav.jpg',
    imageAlt: 'Son Gaurav smiling in front of home',
    choices: ['Son (Gaurav)', 'Brother', 'Neighbor', 'Doctor'],
    correct: 'Son (Gaurav)',
    audioPromptHindi: 'यह आपके परिवार में कौन हैं? जो हर सुबह आपके लिए चाय लाते हैं।'
  },
  {
    id: 2,
    question: 'Who is this dear person smiling warmly?',
    subtitle: 'She calls every evening from Tezpur to ask about your day',
    image: '/images/person_daughter_sunita.jpg',
    imageAlt: 'Daughter Sunita smiling in traditional kurta',
    choices: ['Daughter (Sunita)', 'Teacher', 'Nurse', 'Cousin'],
    correct: 'Daughter (Sunita)',
    audioPromptHindi: 'यह प्यारी बेटी कौन हैं जो हर शाम आपको प्यार से कॉल करती हैं?'
  },
  {
    id: 3,
    question: 'Who is this respected elder in the courtyard?',
    subtitle: 'He wore the handwoven white gamosa with dignity',
    image: '/images/person_grandfather_mukul.jpg',
    imageAlt: 'Respected elder grandfather Mukul with traditional attire',
    choices: ['Grandfather (Mukul)', 'Son', 'Nephew', 'Friend'],
    correct: 'Grandfather (Mukul)',
    audioPromptHindi: 'यह आंगन में बैठे आदरणीय बड़े बुजुर्ग कौन हैं?'
  },
  {
    id: 4,
    question: 'Who is this bright little boy laughing?',
    subtitle: 'Your beloved grandson who loves village festival sweets',
    image: '/images/person_grandson_kabir.jpg',
    imageAlt: 'Young grandson Kabir laughing happily',
    choices: ['Grandson (Kabir)', 'Uncle', 'Brother', 'Grandfather'],
    correct: 'Grandson (Kabir)',
    audioPromptHindi: 'यह मुस्कुराते हुए प्यारे पोते कौन हैं?'
  },
  {
    id: 5,
    question: 'Who is this loving person wearing the silk saree?',
    subtitle: 'She helps prepare delicious pitha and takes care of the house',
    image: '/images/person_daughter_in_law.jpg',
    imageAlt: 'Daughter-in-law Simran in traditional attire',
    choices: ['Daughter-in-law (Simran)', 'School Friend', 'Neighbor', 'Shopkeeper'],
    correct: 'Daughter-in-law (Simran)',
    audioPromptHindi: 'यह रेशमी साड़ी में घर की देखभाल करने वाली कौन हैं?'
  }
];

export const MatchPeopleGamePage: React.FC = () => {
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const totalQuestions = FAMILY_QUESTIONS.length;
  const currentQ = FAMILY_QUESTIONS[questionIndex];

  const handleChoiceSelect = (choice: string) => {
    setSelectedChoice(choice);
    setShowFeedback(true);

    // Speak comforting reinforcement
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const isCorrect = choice === currentQ.correct;
      const text = isCorrect ? `हाँ, यह ${choice} हैं। बहुत सुंदर!` : `यह प्यारी याद ${currentQ.correct} की है।`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate('/patient/activities');
    }
  };

  const handleSpeakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQ.audioPromptHindi || currentQ.question);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24 pt-3 px-4 max-w-md mx-auto flex flex-col justify-between">
      {/* Top Header matching Screen 6 */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/patient/activities')}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E6F5EF] text-[#0E8765] flex items-center justify-center">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <span className="text-base font-black text-slate-800 font-heading">
            Who is in my Family?
          </span>
        </div>

        <button
          onClick={handleSpeakQuestion}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-[#0E8765] hover:bg-slate-50 transition-all"
          title="Listen to question"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Game Card */}
      <div className="flex flex-col items-center gap-3.5 my-auto">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            {currentQ.question}
          </h2>
          <p className="text-xs font-bold text-[#0E8765] mt-0.5">
            {currentQ.subtitle}
          </p>
        </div>

        {/* Dynamic Distinct Realistic Family Photo for Each Question */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-[28px] overflow-hidden shadow-clay-card border-4 border-white bg-slate-100 relative group">
          <img
            key={currentQ.image}
            src={currentQ.image}
            alt={currentQ.imageAlt}
            className="w-full h-full object-cover animate-fade-in transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            Photo {currentQ.id} of {totalQuestions}
          </div>
        </div>

        {/* 2x2 Option Buttons matching Screen 6 */}
        <div className="grid grid-cols-2 gap-3 w-full pt-1">
          {currentQ.choices.map((choice) => {
            const isSelected = selectedChoice === choice;
            const isCorrect = choice === currentQ.correct;

            let buttonStyle = 'bg-white text-slate-800 hover:bg-slate-50 shadow-clay-card border border-white';

            if (showFeedback) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-500 text-white shadow-clay-primary scale-102 ring-4 ring-emerald-300/40';
              } else if (isSelected) {
                buttonStyle = 'bg-amber-100 text-amber-900 border-2 border-amber-300';
              } else {
                buttonStyle = 'bg-white/60 text-slate-400 opacity-60 border border-slate-100';
              }
            } else if (isSelected) {
              buttonStyle = 'bg-[#0E8765] text-white shadow-clay-primary scale-102';
            }

            return (
              <button
                key={choice}
                onClick={() => handleChoiceSelect(choice)}
                className={`min-h-[58px] p-2.5 rounded-[22px] font-black text-sm sm:text-base font-heading transition-all duration-150 cursor-pointer flex items-center justify-center text-center ${buttonStyle}`}
              >
                <span>{choice}</span>
              </button>
            );
          })}
        </div>

        {/* Reassuring Feedback Pill */}
        {showFeedback && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-[#0E8765] px-4 py-2 rounded-full text-xs font-black animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>
              {selectedChoice === currentQ.correct
                ? `Wonderful! This is ${currentQ.correct}.`
                : `This is your beloved ${currentQ.correct}.`}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Progress & Next Button matching Screen 6 */}
      <div className="flex items-center justify-between gap-4 pt-3">
        {/* Progress Bar & Counter */}
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0E8765] transition-all duration-300 rounded-full"
              style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
          <span className="text-xs font-black text-slate-500 font-heading">
            {questionIndex + 1}/{totalQuestions}
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-[22px] bg-[#0E8765] hover:bg-[#0B6D52] text-white text-xs font-black font-heading shadow-clay-primary transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>{questionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MatchPeopleGamePage;
