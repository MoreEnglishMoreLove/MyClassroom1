import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  KeyRound,
  UserCheck,
  Copy,
  Check,
  Share2,
  Trash2,
  Search,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import {
  ADMIN_PIN,
  generateStudentCode,
  verifyStudentCode,
  buildTeacherSendCodeUrl,
  TEACHER_NAME,
  SUBSCRIPTION_DURATION_DAYS,
} from '../utils/cryptoCode';
import { sound } from '../utils/audio';
import { GeneratedCodeRecord } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreloadStudent?: (name: string, code: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onPreloadStudent,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Generator State
  const [studentName, setStudentName] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  // History State
  const [history, setHistory] = useState<GeneratedCodeRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Verifier State
  const [testName, setTestName] = useState('');
  const [testCode, setTestCode] = useState('');
  const [testResult, setTestResult] = useState<{ isValid: boolean; message: string } | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('meml_admin_code_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // silent
    }
  }, []);

  const saveHistory = (newHistory: GeneratedCodeRecord[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('meml_admin_code_history', JSON.stringify(newHistory));
    } catch {
      // silent
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClickSound();

    if (pinInput.trim() === ADMIN_PIN) {
      sound.playSuccessChime();
      setIsAuthenticated(true);
      setPinError(null);
    } else {
      sound.playErrorSound();
      setPinError('الرمز السري غير صحيح. يرجى إدخال رمز المعلمة المعتمد.');
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || studentName.trim().length < 2) return;

    sound.playClickSound();
    const code = generateStudentCode(studentName);
    setGeneratedCode(code);

    // Add to history
    const record: GeneratedCodeRecord = {
      id: 'rec-' + Date.now(),
      studentName: studentName.trim(),
      code,
      createdAt: Date.now(),
      durationDays: SUBSCRIPTION_DURATION_DAYS,
    };

    const updated = [record, ...history.filter(h => h.code !== code)];
    saveHistory(updated);
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    sound.playClickSound();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteHistory = (id: string) => {
    sound.playClickSound();
    const updated = history.filter(item => item.id !== id);
    saveHistory(updated);
  };

  const handleTestVerify = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClickSound();
    const res = verifyStudentCode(testName, testCode);
    if (res.isValid) {
      sound.playSuccessChime();
      setTestResult({ isValid: true, message: 'الكود مطابق 100% رياضياً لاسم الطالب وصالح للاستخدام!' });
    } else {
      sound.playErrorSound();
      setTestResult({ isValid: false, message: res.errorMessage || 'الكود غير مطابق لهذا الاسم' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">بوابة المعلمة {TEACHER_NAME}</h3>
              <p className="text-[11px] text-slate-400">لوحة توليد وإدارة أكواد التفعيل المشفرة</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {!isAuthenticated ? (
            /* PIN Protection Form */
            <form onSubmit={handlePinSubmit} className="max-w-sm mx-auto my-6 space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">أدخل الرمز السري للمعلمة</h4>
              <p className="text-xs text-slate-400">
                هذه اللوحة مخصصة فقط للأستاذة {TEACHER_NAME} لتوليد أكواد الطلاب الحصرية.
              </p>

              <div>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="رمز المعلمة السري..."
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-center px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono tracking-widest text-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {pinError && (
                <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
              >
                تأكيد الدخول للوحة
              </button>
            </form>
          ) : (
            /* Authenticated Admin Dashboard */
            <div className="space-y-6">
              
              {/* Generator Section */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">توليد كود جديد لطالب</h4>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-800 font-mono">
                    صلاحية 180 يوماً
                  </span>
                </div>

                <form onSubmit={handleGenerate} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      placeholder="اكتبي اسم الطالب كاملاً (مثال: أحمد محمد علي)"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!studentName.trim() || studentName.trim().length < 2}
                      className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>توليد الكود الرياضي</span>
                    </button>
                  </div>
                </form>

                {/* Generated Code Result Box */}
                {generatedCode && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-950/40 border border-blue-600/40 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-0.5">كود التفعيل الرياضي المولد:</span>
                        <div className="text-xl font-extrabold font-mono text-amber-400 tracking-wider">
                          {generatedCode}
                        </div>
                        <span className="text-xs text-slate-300">مربوط بالاسم: <strong className="text-white">{studentName}</strong></span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="flex-1 sm:flex-none py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
                        </button>

                        <a
                          href={buildTeacherSendCodeUrl(studentName, generatedCode)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>إرسال للطالب واتساب</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* History of Generated Codes */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span>سجل الأكواد المولدة ({history.length})</span>
                  </h4>

                  {history.length > 0 && (
                    <div className="relative w-48">
                      <input
                        type="text"
                        placeholder="بحث عن طالب..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none"
                      />
                      <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2 pointer-events-none" />
                    </div>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                    لم تقومي بتوليد أي كود بعد. اكتبي اسم الطالب بالأعلى واضغطي توليد.
                  </div>
                ) : (
                  <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800 max-h-48 overflow-y-auto">
                    {history
                      .filter(h => h.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || h.code.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((item) => (
                        <div key={item.id} className="p-3 flex items-center justify-between bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs">
                              <UserCheck className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">{item.studentName}</div>
                              <div className="text-[11px] font-mono text-amber-400">{item.code}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500">
                              {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.code);
                                sound.playClickSound();
                              }}
                              title="نسخ"
                              className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <a
                              href={buildTeacherSendCodeUrl(item.studentName, item.code)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="إرسال عبر واتساب"
                              className="p-1.5 rounded hover:bg-emerald-700/50 text-emerald-400"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              onClick={() => handleDeleteHistory(item.id)}
                              title="حذف من السجل"
                              className="p-1.5 rounded hover:bg-red-900/30 text-slate-500 hover:text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Code Verification Tester */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>فحص كود طالب للتأكد من صحته رياضياً</span>
                </h4>
                <form onSubmit={handleTestVerify} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="اسم الطالب"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="الكود MEML-XXXX-XXXX"
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value.toUpperCase())}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                  <button
                    type="submit"
                    className="col-span-1 sm:col-span-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    اختبار المطابقة الرياضية
                  </button>
                </form>

                {testResult && (
                  <div className={`p-2 rounded-lg text-xs flex items-center gap-2 ${testResult.isValid ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' : 'bg-red-950/60 text-red-300 border border-red-800'}`}>
                    {testResult.isValid ? <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>نظام التشفير الرياضي المستقل - MORE ENGLISH MORE LOVE</span>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
