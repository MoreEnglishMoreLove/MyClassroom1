import React, { useState, useEffect } from 'react';
import { LockScreen } from './components/LockScreen';
import { AdminModal } from './components/AdminModal';
import { CurriculumHeader } from './components/CurriculumHeader';
import { DialoguesSection } from './components/sections/DialoguesSection';
import { VocabularySection } from './components/sections/VocabularySection';
import { PlayGameSection } from './components/sections/PlayGameSection';
import { SongSection } from './components/sections/SongSection';
import { BehaviorSection } from './components/sections/BehaviorSection';
import { ExercisesSection } from './components/sections/ExercisesSection';
import { WorksheetsSection } from './components/sections/WorksheetsSection';
import { StudentActivation, SectionId } from './types';
import {
  verifyStudentCode,
  getOrCreateDeviceId,
  TEACHER_NAME,
  TEACHER_WHATSAPP,
} from './utils/cryptoCode';
import { TEACHER_SOCIALS } from './data/curriculumData';
import { sound } from './utils/audio';
import { Lock, School, AlertTriangle } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<StudentActivation | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<SectionId>('dialogues');
  const [sessionExpiredAlert, setSessionExpiredAlert] = useState<boolean>(false);

  // Restore session from localStorage on load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('meml_student_session');
      if (stored) {
        const parsed: StudentActivation = JSON.parse(stored);
        const currentDeviceId = getOrCreateDeviceId();

        // Check expiration
        if (parsed.expiresAt <= Date.now()) {
          localStorage.removeItem('meml_student_session');
          setSession(null);
          setSessionExpiredAlert(true);
        } else {
          // Mathematical validation of code + device lock
          const verification = verifyStudentCode(parsed.studentName, parsed.code);
          if (verification.isValid && parsed.deviceId === currentDeviceId) {
            setSession(parsed);
          } else {
            // Invalid code or foreign device
            localStorage.removeItem('meml_student_session');
            setSession(null);
          }
        }
      }
    } catch (err) {
      console.error('Session restore error:', err);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const handleSuccessfulActivation = (newSession: StudentActivation) => {
    setSession(newSession);
    setSessionExpiredAlert(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('meml_student_session');
    } catch {
      // silent
    }
    setSession(null);
  };

  const handleExpired = () => {
    try {
      localStorage.removeItem('meml_student_session');
    } catch {
      // silent
    }
    setSession(null);
    setSessionExpiredAlert(true);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-['Cairo',sans-serif]" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-semibold">جاري التحقق الأمني والرياضي للبيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Cairo',sans-serif] selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      
      {/* Session Expired Notice Modal */}
      {sessionExpiredAlert && !session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">انتهت فترة الاشتراك (6 أشهر)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              لقد انتهت فترة الـ 180 يوماً المخصصة لحسابك. لتجديد الاشتراك وتوليد كود جديد يرجى التواصل مع المعلمة جيداء صقر عبر واتساب.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <a
                href={`https://wa.me/963933036079?text=${encodeURIComponent('مرحباً أستاذة جيداء صقر، أود تجديد كود اشتراك MORE ENGLISH MORE LOVE بعد انتهاء الـ 6 أشهر')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors"
              >
                تواصل للتجديد عبر واتساب ({TEACHER_WHATSAPP})
              </a>
              <button
                onClick={() => setSessionExpiredAlert(false)}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                إغلاق والعودة لشاشة التفعيل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content: Lock Screen OR Curriculum Screen */}
      {!session ? (
        <LockScreen
          onSuccessfulActivation={handleSuccessfulActivation}
          onOpenTeacherPortal={() => setIsTeacherModalOpen(true)}
        />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Header with Countdown & Nav */}
          <CurriculumHeader
            session={session}
            activeSection={activeSection}
            onSelectSection={(secId) => setActiveSection(secId)}
            onLogout={handleLogout}
            onExpired={handleExpired}
          />

          {/* Section Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
            {activeSection === 'dialogues' && <DialoguesSection />}
            {activeSection === 'vocabulary' && <VocabularySection />}
            {activeSection === 'game' && <PlayGameSection />}
            {activeSection === 'song' && <SongSection />}
            {activeSection === 'behavior' && <BehaviorSection />}
            {activeSection === 'exercises' && <ExercisesSection />}
            {activeSection === 'worksheets' && <WorksheetsSection />}
          </main>

          {/* App Footer */}
          <footer className="bg-slate-900/90 border-t border-slate-800/80 py-6 px-4 text-center mt-12 print:hidden" dir="rtl">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <School className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white block">MORE ENGLISH MORE LOVE</span>
                  <span className="text-[11px] text-slate-400">بإشراف وتدريس المعلمة {TEACHER_NAME}</span>
                </div>
              </div>

              {/* Teacher Portal Trigger in App Footer */}
              <button
                type="button"
                onClick={() => {
                  sound.playClickSound();
                  setIsTeacherModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>بوابة المعلمة (توليد الأكواد)</span>
              </button>

              <div className="text-xs text-slate-500">
                واتساب: <span className="font-mono text-slate-300 font-bold">{TEACHER_WHATSAPP}</span> | جميع الحقوق محفوظة © {new Date().getFullYear()}
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* Secret Teacher Portal Modal */}
      <AdminModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
      />

    </div>
  );
}
