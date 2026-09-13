import React, { useState } from 'react';
import {
  Smile,
  Frown,
  Sparkles,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Trophy,
  HeartHandshake,
} from 'lucide-react';
import { BEHAVIOR_ITEMS } from '../../data/curriculumData';
import { sound } from '../../utils/audio';
import { GoodBadItem } from '../../types';

export const BehaviorSection: React.FC = () => {
  const [userDecisions, setUserDecisions] = useState<Record<string, boolean | null>>({});
  const [selectedItem, setSelectedItem] = useState<GoodBadItem>(BEHAVIOR_ITEMS[0]);

  const handleClassify = (item: GoodBadItem, isGoodChoice: boolean) => {
    sound.playClickSound();
    setUserDecisions((prev) => ({
      ...prev,
      [item.id]: isGoodChoice,
    }));

    if (isGoodChoice === item.isGood) {
      sound.playSuccessChime();
    } else {
      sound.playErrorSound();
    }
  };

  const handleReset = () => {
    sound.playClickSound();
    setUserDecisions({});
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/40 text-emerald-300 text-xs font-bold mb-2">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
              <span>6. Draw & Values — السلوك الصفي والقيم</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              السلوك الإيجابي والسلبي في الصف (Good vs Bad)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              تعلم التمييز بين السلوك الجيد (Good 🙂) كرمي الزجاجة في السلة، والسلوك السيئ (Bad 🙁) كرمي القمامة على الأرض.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة التقييم</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {BEHAVIOR_ITEMS.map((item) => {
          const userChoice = userDecisions[item.id];
          const hasAnswered = userChoice !== undefined && userChoice !== null;
          const isCorrect = hasAnswered && userChoice === item.isGood;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                hasAnswered
                  ? isCorrect
                    ? 'bg-emerald-950/30 border-emerald-700/60 shadow-lg'
                    : 'bg-rose-950/30 border-rose-700/60 shadow-lg'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div>
                {/* Status bar */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-slate-400 font-['Outfit'] uppercase">
                    Classroom Behavior
                  </span>

                  {hasAnswered && (
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600/50'
                          : 'bg-rose-900/60 text-rose-300 border border-rose-600/50'
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{isCorrect ? 'إجابة صحيحة ممتاز!' : 'إجابة غير صحيحة، راجع التقييم'}</span>
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-3 rounded-2xl shrink-0 ${item.isGood ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {item.isGood ? <Smile className="w-7 h-7" /> : <Frown className="w-7 h-7" />}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white mb-1">
                      {item.titleArabic}
                    </h3>
                    <p className="text-xs text-slate-400 font-['Outfit'] ltr text-left mb-1">
                      "{item.title}"
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Feedback when answered */}
                {hasAnswered && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 mb-4 animate-fade-in">
                    <p className="font-semibold text-amber-400 mb-0.5">توجيه المعلمة جيداء:</p>
                    <p>{item.feedbackArabic}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons: Good or Bad */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleClassify(item, true)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    userChoice === true
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-slate-800 hover:bg-emerald-600/20 text-emerald-400 border border-slate-700 hover:border-emerald-600/40'
                  }`}
                >
                  <Smile className="w-4 h-4" />
                  <span>تصرف جيد (Good 🙂)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleClassify(item, false)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    userChoice === false
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-slate-800 hover:bg-rose-600/20 text-rose-400 border border-slate-700 hover:border-rose-600/40'
                  }`}
                >
                  <Frown className="w-4 h-4" />
                  <span>تصرف سيئ (Bad 🙁)</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
