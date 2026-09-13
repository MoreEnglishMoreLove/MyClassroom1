import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Eye,
  EyeOff,
  Printer,
  Sparkles,
  Award,
  BookOpen,
  Volume2,
  ChevronLeft,
  ChevronRight,
  School,
  Star,
} from 'lucide-react';
import { CURRICULUM_WORKSHEETS } from '../../data/curriculumData';
import { sound } from '../../utils/audio';
import { TEACHER_NAME } from '../../utils/cryptoCode';

export const WorksheetsSection: React.FC = () => {
  const [activeWorksheetId, setActiveWorksheetId] = useState<number>(1);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const activeWorksheet = CURRICULUM_WORKSHEETS.find((w) => w.id === activeWorksheetId) || CURRICULUM_WORKSHEETS[0];

  const toggleAnswer = (key: string) => {
    sound.playClickSound();
    setRevealedAnswers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const revealAllForCurrent = () => {
    sound.playClickSound();
    const updated = { ...revealedAnswers };
    activeWorksheet.exercises.forEach((ex) => {
      ex.modelAnswers.forEach((_, idx) => {
        updated[`${activeWorksheet.id}-${ex.number}-${idx}`] = true;
      });
    });
    setRevealedAnswers(updated);
  };

  const hideAllForCurrent = () => {
    sound.playClickSound();
    const updated = { ...revealedAnswers };
    activeWorksheet.exercises.forEach((ex) => {
      ex.modelAnswers.forEach((_, idx) => {
        delete updated[`${activeWorksheet.id}-${ex.number}-${idx}`];
      });
    });
    setRevealedAnswers(updated);
  };

  const handlePrint = () => {
    sound.playClickSound();
    window.print();
  };

  const handleSpeak = async (text: string) => {
    sound.playClickSound();
    await sound.speak(text, 0.85);
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/40 text-amber-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>القسم السابع والأخير (7 Curriculum Worksheets)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              أوراق عمل المنهاج والحلول النموذجية المعتمدة
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              7 أوراق عمل مطابقة للمنهاج الأصلي بإشراف المعلمة {TEACHER_NAME}، مع إمكانية عرض الحلول النموذجية والطباعة.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700 shadow-md"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>طباعة ورقة العمل (Print PDF)</span>
          </button>
        </div>

        {/* 7 Worksheets Selector Strip */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CURRICULUM_WORKSHEETS.map((ws) => {
            const isActive = ws.id === activeWorksheetId;
            return (
              <button
                key={ws.id}
                onClick={() => {
                  sound.playClickSound();
                  setActiveWorksheetId(ws.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>ورقة {ws.id} (صـ {ws.pageNumber})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Worksheet Document */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:p-6 print:border-none print:shadow-none">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 print:border-slate-300 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 print:text-amber-700 mb-1">
              <School className="w-4 h-4" />
              <span>MORE ENGLISH MORE LOVE — بإشراف المعلمة {TEACHER_NAME}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white print:text-slate-900 mb-1">
              {activeWorksheet.titleArabic}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 print:text-slate-600 font-['Outfit'] ltr text-left">
              {activeWorksheet.title} • {activeWorksheet.unit} • Page {activeWorksheet.pageNumber}
            </p>
          </div>

          {/* Quick Reveal Controls (Hidden on Print) */}
          <div className="flex items-center gap-2 print:hidden self-start sm:self-center">
            <button
              onClick={revealAllForCurrent}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>إظهار جميع الحلول</span>
            </button>
            <button
              onClick={hideAllForCurrent}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>إخفاء الحلول</span>
            </button>
          </div>
        </div>

        {/* Objectives Box */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-950/30 border border-blue-900/40 print:bg-slate-50 print:border-slate-200">
          <h4 className="text-xs font-bold text-blue-400 print:text-blue-800 mb-2 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>الأهداف التعليمية لورقة العمل:</span>
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 print:text-slate-700">
            {activeWorksheet.objectives.map((obj, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Exercises */}
        <div className="space-y-6">
          {activeWorksheet.exercises.map((ex) => (
            <div key={ex.number} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-100 print:border-slate-300 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white print:text-slate-900">
                    {ex.titleArabic}
                  </h4>
                  <span className="text-xs text-slate-400 print:text-slate-600 font-['Outfit'] ltr text-left block">
                    {ex.titleEnglish}
                  </span>
                </div>
                <span className="text-xs text-slate-400 print:text-slate-500">
                  {ex.instructions}
                </span>
              </div>

              {/* Questions and Model Answers Table */}
              <div className="space-y-3">
                {ex.modelAnswers.map((item, idx) => {
                  const key = `${activeWorksheet.id}-${ex.number}-${idx}`;
                  const isRevealed = !!revealedAnswers[key];

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 print:bg-white print:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-6 h-6 rounded-md bg-slate-800 print:bg-slate-200 text-xs font-mono font-bold flex items-center justify-center text-amber-400 print:text-slate-800">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-200 print:text-slate-900 font-['Outfit'] ltr text-left">
                            {item.question}
                          </span>
                        </div>

                        {item.arabicHint && (
                          <span className="text-[11px] text-slate-400 print:text-slate-500 mr-8 block">
                            توجيه: {item.arabicHint}
                          </span>
                        )}
                      </div>

                      {/* Model Answer Box */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleSpeak(item.answer)}
                          className="p-2 rounded-lg bg-slate-800 print:hidden text-slate-300 hover:text-white"
                          title="استمع للإجابة"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleAnswer(key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer print:hidden flex items-center gap-1.5 ${
                            isRevealed
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{isRevealed ? 'إخفاء الإجابة' : 'إظهار حل المعلمة'}</span>
                        </button>

                        {/* Revealed / Printable Answer */}
                        <div
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            isRevealed
                              ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700'
                              : 'hidden print:block print:bg-emerald-50 print:text-emerald-900 print:border-emerald-300'
                          }`}
                        >
                          <span className="font-semibold block sm:inline">الحل النموذجي: </span>
                          <span className="font-['Outfit']">{item.answer}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* Footer Document Certification */}
        <div className="mt-8 pt-6 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 print:text-slate-600">
          <div>
            <span>منهاج اللغة الإنجليزية التفاعلي — تم التدقيق والاعتماد بواسطة </span>
            <strong className="text-slate-300 print:text-slate-800">المعلمة {TEACHER_NAME}</strong>
          </div>

          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-amber-400/90 print:text-amber-800">
              ورقة عمل {activeWorksheet.id} من أصل 7 أوراق
            </span>
          </div>
        </div>

      </div>

      {/* Navigation Between Worksheets */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <button
          disabled={activeWorksheetId <= 1}
          onClick={() => {
            sound.playClickSound();
            setActiveWorksheetId((prev) => Math.max(1, prev - 1));
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          <span>ورقة العمل السابقة</span>
        </button>

        <span className="text-xs text-slate-400 font-bold">
          ورقة {activeWorksheetId} / 7
        </span>

        <button
          disabled={activeWorksheetId >= 7}
          onClick={() => {
            sound.playClickSound();
            setActiveWorksheetId((prev) => Math.min(7, prev + 1));
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>ورقة العمل التالية</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
