import React, { useState } from 'react';
import {
  Lock,
  Sparkles,
  MessageCircle,
  GraduationCap,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  School,
  CheckCircle2,
} from 'lucide-react';
import {
  verifyStudentCode,
  buildStudentWhatsAppRequestUrl,
  TEACHER_NAME,
  TEACHER_WHATSAPP,
  getOrCreateDeviceId,
  SUBSCRIPTION_DURATION_DAYS,
} from '../utils/cryptoCode';
import { sound } from '../utils/audio';
import { StudentActivation } from '../types';

interface LockScreenProps {
  onSuccessfulActivation: (session: StudentActivation) => void;
  onOpenTeacherPortal: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  onSuccessfulActivation,
  onOpenTeacherPortal,
}) => {
  const [studentName, setStudentName] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format code as user types: MEML-XXXX-XXXX
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    
    // Auto insert prefix if user just starts typing letters
    if (val && !val.startsWith('MEML') && !val.startsWith('M')) {
      val = 'MEML-' + val;
    }
    
    setActivationCode(val);
    if (errorMessage) setErrorMessage(null);
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClickSound();
    setIsSubmitting(true);
    setErrorMessage(null);

    const result = verifyStudentCode(studentName, activationCode);

    if (result.isValid) {
      sound.playSuccessChime();
      setSuccessMessage(`أهلاً بك يا بطل! تم التحقق الرياضي من كود التفعيل بنجاح.`);

      const now = Date.now();
      const expiresAt = now + SUBSCRIPTION_DURATION_DAYS * 24 * 60 * 60 * 1000; // 180 days
      const deviceId = getOrCreateDeviceId();

      const newSession: StudentActivation = {
        studentName: studentName.trim(),
        code: activationCode.trim().toUpperCase(),
        activatedAt: now,
        expiresAt,
        deviceId,
      };

      // Save to localStorage for single-device offline persistence
      try {
        localStorage.setItem('meml_student_session', JSON.stringify(newSession));
      } catch (err) {
        console.error('Storage error:', err);
      }

      setTimeout(() => {
        onSuccessfulActivation(newSession);
      }, 1000);
    } else {
      sound.playErrorSound();
      setErrorMessage(result.errorMessage || 'كود التفعيل غير صالح لهذا الاسم');
      setIsSubmitting(false);
    }
  };

  const whatsAppUrl = buildStudentWhatsAppRequestUrl(studentName);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 selection:bg-blue-600 selection:text-white" dir="rtl">
      
      {/* Top Header Bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-200 tracking-wide font-['Outfit'] uppercase">
              More English More Love
            </h2>
            <p className="text-xs text-blue-400 font-medium">
              بإشراف وتدريس المعلمة {TEACHER_NAME}
            </p>
          </div>
        </div>

        {/* Teacher Portal Secret Entry */}
        <button
          id="teacher-portal-trigger-btn"
          type="button"
          onClick={() => {
            sound.playClickSound();
            onOpenTeacherPortal();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-blue-300 hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
          title="بوابة المعلمة لتوليد أكواد التفعيل"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>بوابة المعلمة</span>
        </button>
      </header>

      {/* Center Lock Screen Content */}
      <main className="w-full max-w-md mx-auto my-auto py-6 flex flex-col items-center">
        
        {/* App Title & Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/40 border border-blue-600/40 text-blue-300 text-xs font-semibold mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>المنهاج التعليمي التفاعلي الشامل</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 font-['Outfit']">
            MORE ENGLISH MORE LOVE
          </h1>
          <p className="text-sm text-slate-300 font-medium">
            تطبيق المنهاج الإلكتروني المقفل — بإشراف المعلمة <span className="text-amber-400 font-bold">{TEACHER_NAME}</span>
          </p>
        </div>

        {/* Main Activation Box */}
        <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle accent light */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500" />

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">تفعيل الحساب والدخول للمنهاج</h2>
              <p className="text-xs text-slate-400">كود مشفر حصري باسم الطالب وصالح لمدة 6 أشهر</p>
            </div>
          </div>

          <form onSubmit={handleActivate} className="space-y-4">
            {/* Student Full Name */}
            <div>
              <label htmlFor="student-name-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                الاسم الكامل للطالب/ة (ثلاثي أو ثنائي):
              </label>
              <div className="relative">
                <input
                  id="student-name-input"
                  type="text"
                  required
                  placeholder="مثال: أحمد محمد علي"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                * يجب كتابة الاسم تماماً كما زودت به المعلمة لتطابق التشفير الرياضي.
              </span>
            </div>

            {/* Secret Activation Code */}
            <div>
              <label htmlFor="activation-code-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                كود التفعيل السري المولد لك:
              </label>
              <div className="relative">
                <input
                  id="activation-code-input"
                  type="text"
                  required
                  placeholder="MEML-XXXX-XXXX"
                  value={activationCode}
                  onChange={handleCodeChange}
                  maxLength={14}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm font-mono font-bold tracking-wider text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all uppercase"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">{successMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="submit-activation-btn"
              type="submit"
              disabled={isSubmitting || !studentName.trim() || !activationCode.trim()}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'جاري التحقق والمطابقة...' : 'تفعيل الحساب والدخول للمنهاج'}</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </form>

          {/* Quick Notice about local device lock */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              🔒 الكود يفتح حصرياً على جهازك ومحمي بنظام التحقق المشفر المستقل
            </p>
          </div>
        </div>

        {/* WhatsApp Request Help Section for Students */}
        <section className="w-full bg-slate-900/60 border border-emerald-900/50 rounded-2xl p-5 mt-5 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-1">
                كيف أحصل على كود تفعيل؟
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                تواصل مباشرة مع المعلمة <strong className="text-white">{TEACHER_NAME}</strong> عبر واتساب وسيقوم الرابط تلقائياً بصياغة رسالة ترحيبية تطلب الكود باسمك:
              </p>

              <a
                id="whatsapp-request-code-btn"
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClickSound()}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/30 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>طلب الكود عبر واتساب للمعلمة ({TEACHER_WHATSAPP})</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto text-center py-3 text-xs text-slate-500 border-t border-slate-900">
        <p>
          جميع الحقوق محفوظة © {new Date().getFullYear()} — تطبيق <span className="text-slate-300 font-semibold">MORE ENGLISH MORE LOVE</span> بإشراف المعلمة جيداء صقر.
        </p>
      </footer>
    </div>
  );
};
