import React, { useState, useEffect } from 'react';
import {
  Clock,
  LogOut,
  User,
  Sparkles,
  School,
  ExternalLink,
  MessageCircle,
  Share2,
  Calendar,
} from 'lucide-react';
import { StudentActivation, SectionId } from '../types';
import { SECTIONS_META, TEACHER_SOCIALS } from '../data/curriculumData';
import { TEACHER_NAME, TEACHER_WHATSAPP } from '../utils/cryptoCode';
import { sound } from '../utils/audio';

interface CurriculumHeaderProps {
  session: StudentActivation;
  activeSection: SectionId;
  onSelectSection: (id: SectionId) => void;
  onLogout: () => void;
  onExpired: () => void;
}

export const CurriculumHeader: React.FC<CurriculumHeaderProps> = ({
  session,
  activeSection,
  onSelectSection,
  onLogout,
  onExpired,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: 180,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = session.expiresAt - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        onExpired();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [session.expiresAt, onExpired]);

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl" dir="rtl">
      
      {/* Top Notification & Social Contact Strip */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-blue-400 font-semibold">
            <School className="w-3.5 h-3.5" />
            <span>بإشراف وتدريس المعلمة {TEACHER_NAME}</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <a
            href={`https://wa.me/963933036079`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3 h-3" />
            <span>واتساب: {TEACHER_WHATSAPP}</span>
          </a>
        </div>

        {/* Social channels */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="hidden md:inline">منصات المتابعة:</span>
          {TEACHER_SOCIALS.map((soc) => (
            <a
              key={soc.name}
              href={soc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 transition-colors"
              title={soc.name}
            >
              {soc.name}
            </a>
          ))}
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md">
            <School className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-wide font-['Outfit'] flex items-center gap-2">
              <span>MORE ENGLISH MORE LOVE</span>
            </h1>
            <p className="text-xs text-blue-400 font-medium">
              المنهاج التعليمي التفاعلي — فصلي الدراسي (My Classroom)
            </p>
          </div>
        </div>

        {/* Student Profile & Countdown Timer */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Active Student Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block leading-tight">الطالب/ة المشترك:</span>
              <span className="text-xs font-bold text-white">{session.studentName}</span>
            </div>
          </div>

          {/* 6-Month Subscription Countdown Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-right font-mono">
              <span className="text-[10px] text-amber-400/80 block leading-tight font-sans">
                صلاحية الاشتراك (6 أشهر):
              </span>
              <span className="text-xs font-bold">
                {timeLeft.days} يوم و {timeLeft.hours}س : {timeLeft.minutes}د
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              sound.playClickSound();
              onLogout();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-red-300 hover:bg-slate-800 transition-colors"
            title="تسجيل الخروج / قفل المنهاج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 7 Curriculum Navigation Tabs */}
      <div className="bg-slate-950/60 border-t border-slate-800/60 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none">
          {SECTIONS_META.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  sound.playClickSound();
                  onSelectSection(sec.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {sec.number}
                </span>
                <span>{sec.titleArabic}</span>
                {sec.id === 'worksheets' && (
                  <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded text-[10px] font-black">
                    7 أوراق
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
};
