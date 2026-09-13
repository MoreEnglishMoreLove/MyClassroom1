import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Gamepad2,
  Volume2,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  BookOpen,
  Layout,
  Table as TableIcon,
  PenLine,
  Briefcase,
  Armchair,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface GameTarget {
  id: string;
  name: string;
  arabic: string;
  icon: React.ReactNode;
  colorClass: string;
}

const TARGETS: GameTarget[] = [
  { id: 'desk', name: 'desk', arabic: 'مكتب دراسي', icon: <Layout className="w-10 h-10" />, colorClass: 'hover:border-sky-500 hover:bg-sky-950/40 text-sky-400' },
  { id: 'book', name: 'book', arabic: 'كتاب', icon: <BookOpen className="w-10 h-10" />, colorClass: 'hover:border-emerald-500 hover:bg-emerald-950/40 text-emerald-400' },
  { id: 'bag', name: 'bag', arabic: 'حقيبة', icon: <Briefcase className="w-10 h-10" />, colorClass: 'hover:border-purple-500 hover:bg-purple-950/40 text-purple-400' },
  { id: 'pencil', name: 'pencil', arabic: 'قلم رصاص', icon: <PenLine className="w-10 h-10" />, colorClass: 'hover:border-rose-500 hover:bg-rose-950/40 text-rose-400' },
  { id: 'table', name: 'table', arabic: 'طاولة', icon: <TableIcon className="w-10 h-10" />, colorClass: 'hover:border-amber-500 hover:bg-amber-950/40 text-amber-400' },
  { id: 'chair', name: 'chair', arabic: 'كرسي', icon: <Armchair className="w-10 h-10" />, colorClass: 'hover:border-pink-500 hover:bg-pink-950/40 text-pink-400' },
];

export const PlayGameSection: React.FC = () => {
  const [currentTarget, setCurrentTarget] = useState<GameTarget>(TARGETS[0]);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [roundsPlayed, setRoundsPlayed] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCommandPlaying, setIsCommandPlaying] = useState<boolean>(false);

  const playCommand = async (target: GameTarget) => {
    setIsCommandPlaying(true);
    await sound.speak(`Touch the ${target.name}!`, 0.85);
    setIsCommandPlaying(false);
  };

  const pickNewRound = (currentId?: string) => {
    const available = TARGETS.filter((t) => t.id !== currentId);
    const next = available[Math.floor(Math.random() * available.length)];
    setCurrentTarget(next);
    setFeedback(null);
    playCommand(next);
  };

  useEffect(() => {
    // Initial round
    pickNewRound();
  }, []);

  const handleItemClick = (target: GameTarget) => {
    if (feedback) return; // Prevent double clicking

    sound.playClickSound();
    setRoundsPlayed((r) => r + 1);

    if (target.id === currentTarget.id) {
      sound.playSuccessChime();
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
      setFeedback({
        isCorrect: true,
        text: `رائع جداً! أحسنت لمس الـ ${target.arabic} (${target.name}) بنجاح!`,
      });
      setTimeout(() => {
        pickNewRound(target.id);
      }, 1500);
    } else {
      sound.playErrorSound();
      setStreak(0);
      setFeedback({
        isCorrect: false,
        text: `حاول مرة أخرى! المعلمة طلبت: "Touch the ${currentTarget.name}" وليس ${target.arabic}.`,
      });
      setTimeout(() => {
        setFeedback(null);
      }, 1800);
    }
  };

  const handleRestart = () => {
    sound.playClickSound();
    setScore(0);
    setStreak(0);
    setRoundsPlayed(0);
    pickNewRound();
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 text-blue-300 text-xs font-bold mb-2">
              <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
              <span>3. Let's play. لنلعب!</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              لعبة أوامر المعلمة: "Touch the desk!"
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              استمع لأمر المعلمة جيداء صقر عبر الصوت، واضغط فوراً على الأداة المطلوبة في غرفة الصف لجمع النقاط!
            </p>
          </div>

          {/* Score & Streak Stats */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">مجموع النقاط</span>
                <span className="text-base font-black text-white">{score}</span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">سلسلة الإجابات</span>
                <span className="text-base font-black text-white">{streak}</span>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="إعادة تشغيل اللعبة"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Game Stage */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
        
        {/* Command Box */}
        <div className="max-w-md mx-auto mb-8">
          <div className="inline-block px-4 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-300 mb-3 border border-slate-700">
            أمر المعلمة جيداء الحالي:
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-blue-950/40 border border-blue-600/40 shadow-inner flex items-center justify-between gap-3">
            <div className="text-right">
              <span className="text-xs text-blue-300 font-semibold block">Listen and touch:</span>
              <span className="text-xl sm:text-2xl font-black text-white font-['Outfit'] tracking-wide">
                "Touch the {currentTarget.name}!"
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">
                (المس الـ {currentTarget.arabic})
              </span>
            </div>

            <button
              type="button"
              onClick={() => playCommand(currentTarget)}
              disabled={isCommandPlaying}
              className="p-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer shrink-0"
              title="إعادة سماع الأمر"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback Display */}
          {feedback && (
            <div
              className={`mt-3 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-fade-in ${
                feedback.isCorrect
                  ? 'bg-emerald-950/70 border border-emerald-700 text-emerald-300'
                  : 'bg-rose-950/70 border border-rose-700 text-rose-300'
              }`}
            >
              {feedback.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>{feedback.text}</span>
            </div>
          )}
        </div>

        {/* Classroom Interactive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {TARGETS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`p-6 rounded-2xl bg-slate-950 border-2 border-slate-800 transition-all transform active:scale-95 flex flex-col items-center justify-center cursor-pointer shadow-lg group ${item.colorClass}`}
            >
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 mb-3 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-base font-black text-white font-['Outfit'] uppercase tracking-wider mb-0.5">
                {item.name}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {item.arabic}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-xs text-slate-500">
          مجموع الجولات الملعوبة: {roundsPlayed} جولة | استمتع بالتعلم التفاعلي!
        </div>

      </div>

    </div>
  );
};
