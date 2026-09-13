import React, { useState } from 'react';
import {
  Music,
  Play,
  Pause,
  Volume2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Mic,
  Armchair,
  Layout,
} from 'lucide-react';
import { SONG_VERSES } from '../../data/curriculumData';
import { sound } from '../../utils/audio';

export const SongSection: React.FC = () => {
  const [activeVerseIndex, setActiveVerseIndex] = useState<number | null>(null);
  const [isPlayingFull, setIsPlayingFull] = useState<boolean>(false);

  const handlePlayVerse = async (index: number) => {
    sound.playClickSound();
    setActiveVerseIndex(index);
    const verse = SONG_VERSES[index];
    await sound.speak(verse.audioPrompt, 0.85);
    setActiveVerseIndex(null);
  };

  const handlePlayFullSong = async () => {
    if (isPlayingFull) {
      window.speechSynthesis.cancel();
      setIsPlayingFull(false);
      setActiveVerseIndex(null);
      return;
    }

    sound.playClickSound();
    setIsPlayingFull(true);

    for (let i = 0; i < SONG_VERSES.length; i++) {
      if (!window.speechSynthesis) break;
      setActiveVerseIndex(i);
      await sound.speak(SONG_VERSES[i].audioPrompt, 0.82);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    setIsPlayingFull(false);
    setActiveVerseIndex(null);
    sound.playSuccessChime();
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 text-purple-300 text-xs font-bold mb-2">
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <span>5. Listen and sing. استمع وغنِّ!</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              أنشودة فصلي الدراسي (In my classroom chant)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              ردد مع المعلمة جيداء صقر كلمات الأنشودة بالإيقاع الصوتي لتنمية الطلاقة وحفظ أدوات الصف.
            </p>
          </div>

          {/* Karaoke Play / Stop Button */}
          <button
            onClick={handlePlayFullSong}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              isPlayingFull
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
            }`}
          >
            {isPlayingFull ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlayingFull ? 'إيقاف الأنشودة' : 'تشغيل الأنشودة كاملة (كاراوكي)'}</span>
          </button>
        </div>
      </div>

      {/* Lyrics & Karaoke Stage */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Visual Spotlight on Key Objects */}
        <div className="flex items-center justify-center gap-6 mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Armchair className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-white block">Chair (كرسي)</span>
              <span className="text-[11px] text-slate-400 font-mono">I can see a chair</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Layout className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-white block">Desk (مكتب)</span>
              <span className="text-[11px] text-slate-400 font-mono">I can see a desk</span>
            </div>
          </div>
        </div>

        {/* Verses List */}
        <div className="space-y-3 max-w-2xl mx-auto">
          {SONG_VERSES.map((verse, idx) => {
            const isActive = activeVerseIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => handlePlayVerse(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isActive
                    ? 'bg-purple-950/70 border-purple-500 scale-[1.02] shadow-lg shadow-purple-950/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                    isActive ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="text-right">
                    <div className="text-base sm:text-lg font-bold text-white font-['Outfit'] tracking-wide ltr text-left">
                      {verse.englishLines[0]}
                    </div>
                    <div className="text-xs text-slate-400">
                      {verse.arabicLines[1]}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="استمع للسطر"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
