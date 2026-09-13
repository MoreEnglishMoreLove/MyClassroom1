import React, { useState } from 'react';
import {
  Volume2,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  Layout,
  Table as TableIcon,
  PenLine,
  Briefcase,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { DIALOGUES_DATA } from '../../data/curriculumData';
import { sound } from '../../utils/audio';

const getObjectIcon = (iconName: string) => {
  switch (iconName) {
    case 'book':
      return <BookOpen className="w-8 h-8 text-emerald-400" />;
    case 'desk':
      return <Layout className="w-8 h-8 text-sky-400" />;
    case 'table':
      return <TableIcon className="w-8 h-8 text-amber-400" />;
    case 'pencil':
      return <PenLine className="w-8 h-8 text-rose-400" />;
    case 'bag':
      return <Briefcase className="w-8 h-8 text-purple-400" />;
    default:
      return <BookOpen className="w-8 h-8 text-blue-400" />;
  }
};

export const DialoguesSection: React.FC = () => {
  const [activeDialogueIndex, setActiveDialogueIndex] = useState<number | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.85); // slightly slower for young learners
  const [showArabic, setShowArabic] = useState<boolean>(true);

  const handleSpeak = async (text: string, index: number) => {
    sound.playClickSound();
    setActiveDialogueIndex(index);
    await sound.speak(text, speechSpeed);
    setActiveDialogueIndex(null);
  };

  const handlePlayFullPair = async (qIndex: number, aIndex: number) => {
    sound.playClickSound();
    setActiveDialogueIndex(qIndex);
    await sound.speak(DIALOGUES_DATA[qIndex].textEnglish, speechSpeed);
    await new Promise((r) => setTimeout(r, 600));
    setActiveDialogueIndex(aIndex);
    await sound.speak(DIALOGUES_DATA[aIndex].textEnglish, speechSpeed);
    setActiveDialogueIndex(null);
  };

  // Group dialogues into Question & Answer pairs (5 pairs)
  const pairs = [
    { q: DIALOGUES_DATA[0], a: DIALOGUES_DATA[1], qIdx: 0, aIdx: 1, title: 'Item 1: The Book (الكتاب)' },
    { q: DIALOGUES_DATA[2], a: DIALOGUES_DATA[3], qIdx: 2, aIdx: 3, title: 'Item 2: The Desk (المكتب الدراسي)' },
    { q: DIALOGUES_DATA[4], a: DIALOGUES_DATA[5], qIdx: 4, aIdx: 5, title: 'Item 3: The Table (الطاولة)' },
    { q: DIALOGUES_DATA[6], a: DIALOGUES_DATA[7], qIdx: 6, aIdx: 7, title: 'Item 4: The Pencil (قلم الرصاص)' },
    { q: DIALOGUES_DATA[8], a: DIALOGUES_DATA[9], qIdx: 8, aIdx: 9, title: 'Item 5: The Bag (الحقيبة)' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Section Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 text-blue-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>الوحدة الثانية: فصلي الدراسي (Unit 2: My classroom)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              1. Listen and repeat — استمع وكرّر
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              تدرب مع المعلمة جيداء صقر على السؤال عن الأدوات الصفية: "What's this?" والإجابة النموذجية: "It's a..."
            </p>
          </div>

          {/* Controls: Speed & Translation toggle */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => {
                sound.playClickSound();
                setShowArabic(!showArabic);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                showArabic
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {showArabic ? 'إخفاء الترجمة' : 'إظهار الترجمة'}
            </button>

            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="px-2 text-slate-400">السرعة:</span>
              <button
                onClick={() => setSpeechSpeed(0.75)}
                className={`px-2 py-1 rounded-lg font-mono ${speechSpeed === 0.75 ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                0.75x
              </button>
              <button
                onClick={() => setSpeechSpeed(0.9)}
                className={`px-2 py-1 rounded-lg font-mono ${speechSpeed === 0.9 ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                1.0x
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogues Pairs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pairs.map((pair, index) => (
          <div
            key={pair.title}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              {/* Pair Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-400">
                    #{index + 1}
                  </div>
                  <span className="text-xs font-bold text-slate-200">{pair.title}</span>
                </div>

                <button
                  onClick={() => handlePlayFullPair(pair.qIdx, pair.aIdx)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>استماع للمحادثة كاملة</span>
                </button>
              </div>

              {/* Character 1: Teacher */}
              <div
                className={`p-3.5 rounded-xl mb-3 transition-all ${
                  activeDialogueIndex === pair.qIdx
                    ? 'bg-blue-900/40 border border-blue-500 scale-[1.01]'
                    : 'bg-slate-950/70 border border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <span>👩‍🏫 {pair.q.speakerArabic}</span>
                  </span>

                  <button
                    onClick={() => handleSpeak(pair.q.textEnglish, pair.qIdx)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="نطق السؤال"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-base sm:text-lg font-bold text-white font-['Outfit'] tracking-wide ltr text-left">
                  "{pair.q.textEnglish}"
                </div>

                {showArabic && (
                  <div className="text-xs text-slate-400 mt-1">
                    {pair.q.textArabic}
                  </div>
                )}
              </div>

              {/* Character 2: Student */}
              <div
                className={`p-3.5 rounded-xl transition-all ${
                  activeDialogueIndex === pair.aIdx
                    ? 'bg-emerald-900/40 border border-emerald-500 scale-[1.01]'
                    : 'bg-slate-950/70 border border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <span>👧 {pair.a.speakerArabic}</span>
                  </span>

                  <button
                    onClick={() => handleSpeak(pair.a.textEnglish, pair.aIdx)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="نطق الإجابة"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-base sm:text-lg font-bold text-white font-['Outfit'] tracking-wide ltr text-left">
                  "{pair.a.textEnglish}"
                </div>

                {showArabic && (
                  <div className="text-xs text-slate-400 mt-1">
                    {pair.a.textArabic}
                  </div>
                )}
              </div>
            </div>

            {/* Object Illustration Icon & Tag */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                  {getObjectIcon(pair.a.imageIcon)}
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-mono">الهدف التعليمي:</span>
                  <span className="text-xs font-bold text-white">{pair.a.targetObject} ({pair.a.targetArabic})</span>
                </div>
              </div>

              <span className="text-[11px] text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/50 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>إتقان نطق الجملة</span>
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
