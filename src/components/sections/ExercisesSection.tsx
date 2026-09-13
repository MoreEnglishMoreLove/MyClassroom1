import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Volume2,
  Sparkles,
  RotateCcw,
  Trophy,
  BookOpen,
  Layout,
  Table as TableIcon,
  PenLine,
  Briefcase,
  HelpCircle,
  Award,
} from 'lucide-react';
import { MATCHING_PAIRS, CIRCLE_QUESTIONS } from '../../data/curriculumData';
import { sound } from '../../utils/audio';

export const ExercisesSection: React.FC = () => {
  // Matching state
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({}); // wordId -> targetId

  // Circle test state
  const [circleAnswers, setCircleAnswers] = useState<Record<string, string>>({}); // questionId -> optionId

  // Score
  const [showResults, setShowResults] = useState(false);

  const targets = [
    { id: 'target-desk', label: 'المكتب الدراسي (Desk)', icon: <Layout className="w-6 h-6 text-sky-400" /> },
    { id: 'target-book', label: 'الكتاب المدرسي (Book)', icon: <BookOpen className="w-6 h-6 text-emerald-400" /> },
    { id: 'target-bag', label: 'حقيبة الظهر (Bag)', icon: <Briefcase className="w-6 h-6 text-purple-400" /> },
    { id: 'target-table', label: 'الطاولة الخشبية (Table)', icon: <TableIcon className="w-6 h-6 text-amber-400" /> },
    { id: 'target-pencil', label: 'قلم الرصاص (Pencil)', icon: <PenLine className="w-6 h-6 text-rose-400" /> },
  ];

  const handleWordSelect = (wordId: string) => {
    sound.playClickSound();
    setSelectedWordId(wordId);
  };

  const handleTargetSelect = (targetId: string) => {
    if (!selectedWordId) return;

    sound.playClickSound();
    const pair = MATCHING_PAIRS.find((p) => p.id === selectedWordId);
    if (!pair) return;

    if (pair.targetMatchId === targetId) {
      sound.playSuccessChime();
    } else {
      sound.playErrorSound();
    }

    setMatchedPairs((prev) => ({
      ...prev,
      [selectedWordId]: targetId,
    }));
    setSelectedWordId(null);
  };

  const handleCircleSelect = (questionId: string, optionId: string, isCorrect: boolean) => {
    sound.playClickSound();
    if (isCorrect) {
      sound.playSuccessChime();
    } else {
      sound.playErrorSound();
    }
    setCircleAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handlePlayPrompt = async (text: string) => {
    sound.playClickSound();
    await sound.speak(text, 0.85);
  };

  const resetAll = () => {
    sound.playClickSound();
    setMatchedPairs({});
    setCircleAnswers({});
    setShowResults(false);
  };

  // Calculate score
  let correctMatches = 0;
  MATCHING_PAIRS.forEach((p) => {
    if (matchedPairs[p.id] === p.targetMatchId) correctMatches++;
  });

  let correctCircles = 0;
  CIRCLE_QUESTIONS.forEach((q) => {
    const chosen = q.options.find((opt) => opt.id === circleAnswers[q.id]);
    if (chosen && chosen.isCorrect) correctCircles++;
  });

  const totalScore = correctMatches * 10 + correctCircles * 10;
  const maxScore = (MATCHING_PAIRS.length + CIRCLE_QUESTIONS.length) * 10;

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 text-blue-300 text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>تمارين كتاب الأنشطة (Activity Book Exercises)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              6. Exercises: Listen, Match and Circle
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              تمارين تفاعلية مطابقة لصفحات 11 و 12 في كتاب الأنشطة مع تصحيح فوري ونتائج معتمدة من المعلمة جيداء صقر.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block">درجة الاختبار</span>
                <span className="text-base font-black text-white">{totalScore} / {maxScore}</span>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="إعادة التمارين"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Part 1: Listen and Match */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>التمرين الأول: Listen and match (استمع وصل)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              اضغط على الكلمة من القائمة اليمنى أولاً، ثم اضغط على الصورة المناسبة لها في القائمة اليسرى:
            </p>
          </div>

          <span className="text-xs font-bold text-amber-400 bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-800/40">
            {correctMatches} / {MATCHING_PAIRS.length} تم توصيلها
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column A: Words to click */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 mb-2">قائمة الكلمات:</h4>
            {MATCHING_PAIRS.map((pair) => {
              const isSelected = selectedWordId === pair.id;
              const isMatched = matchedPairs[pair.id] !== undefined;
              const isCorrect = matchedPairs[pair.id] === pair.targetMatchId;

              return (
                <div
                  key={pair.id}
                  onClick={() => handleWordSelect(pair.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/30 border-blue-400 shadow-md ring-2 ring-blue-500/30'
                      : isMatched
                      ? isCorrect
                        ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-700 text-rose-200'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-white font-['Outfit']">
                      {pair.word}
                    </span>
                    <span className="text-xs text-slate-400">({pair.arabic})</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPrompt(pair.word.replace(/^\d+\.\s*/, ''));
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Column B: Target Pictures to click */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 mb-2">الصور والأدوات الصفية المقابلة:</h4>
            {targets.map((target) => {
              const matchedWordEntry = Object.entries(matchedPairs).find(([, tId]) => tId === target.id);
              const matchedWordId = matchedWordEntry ? matchedWordEntry[0] : null;
              const matchedWord = matchedWordId ? MATCHING_PAIRS.find((p) => p.id === matchedWordId) : null;

              return (
                <div
                  key={target.id}
                  onClick={() => handleTargetSelect(target.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedWordId
                      ? 'bg-slate-950/90 border-blue-500/50 hover:bg-blue-900/20'
                      : matchedWord
                      ? 'bg-slate-950/90 border-emerald-700/60'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {target.icon}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {target.label}
                      </span>
                      {matchedWord && (
                        <span className="text-[11px] text-emerald-400 font-medium">
                          ✓ تم الربط مع: {matchedWord.word}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500">
                    {matchedWord ? 'مكتمل' : 'اضغط للتوصيل'}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Part 2: Listen and Circle */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>التمرين الثاني: Listen and circle (استمع وضع دائرة)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              استمع للجملة من المعلمة جيداء ثم اختر الصورة الصحيحة بوضع دائرة عليها:
            </p>
          </div>

          <span className="text-xs font-bold text-blue-400 bg-blue-950/40 px-3 py-1 rounded-xl border border-blue-800/40">
            {correctCircles} / {CIRCLE_QUESTIONS.length} إجابات صحيحة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CIRCLE_QUESTIONS.map((q, idx) => {
            const chosenId = circleAnswers[q.id];

            return (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  {/* Prompt with Speaker */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs text-slate-400 font-mono block">سؤال #{idx + 1}:</span>
                      <h4 className="text-base font-bold text-white font-['Outfit'] ltr text-left">
                        "{q.promptEnglish}"
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{q.promptArabic}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlayPrompt(q.promptEnglish)}
                      className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-colors"
                      title="استمع للجملة"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {q.options.map((opt) => {
                      const isSelected = chosenId === opt.id;
                      const isCorrectChoice = isSelected && opt.isCorrect;
                      const isWrongChoice = isSelected && !opt.isCorrect;

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleCircleSelect(q.id, opt.id, opt.isCorrect)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                            isCorrectChoice
                              ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30'
                              : isWrongChoice
                              ? 'bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/30'
                              : isSelected
                              ? 'bg-blue-900/40 border-blue-500'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-base font-bold text-white font-['Outfit'] uppercase mb-1">
                            {opt.label}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({opt.labelArabic})
                          </span>

                          {isSelected && (
                            <div className="mt-2 text-xs font-bold flex items-center gap-1">
                              {opt.isCorrect ? (
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>دائرة صحيحة!</span>
                                </span>
                              ) : (
                                <span className="text-rose-400 flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>خيار خاطئ</span>
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
