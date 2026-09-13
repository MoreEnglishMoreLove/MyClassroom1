import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  BookOpen,
  Layout,
  Table as TableIcon,
  PenLine,
  Briefcase,
  Armchair,
  School,
  Hand,
  MousePointerClick,
  Eye,
  RotateCw,
  Check,
  Star,
} from 'lucide-react';
import { VOCABULARY_DATA } from '../../data/curriculumData';
import { sound } from '../../utils/audio';
import { VocabWord } from '../../types';

const getVocabIcon = (iconName: string) => {
  switch (iconName) {
    case 'BookOpen':
      return <BookOpen className="w-10 h-10 text-emerald-400" />;
    case 'Layout':
      return <Layout className="w-10 h-10 text-sky-400" />;
    case 'Briefcase':
      return <Briefcase className="w-10 h-10 text-purple-400" />;
    case 'PenLine':
      return <PenLine className="w-10 h-10 text-rose-400" />;
    case 'Table':
      return <TableIcon className="w-10 h-10 text-amber-400" />;
    case 'Armchair':
      return <Armchair className="w-10 h-10 text-pink-400" />;
    case 'School':
      return <School className="w-10 h-10 text-indigo-400" />;
    case 'Hand':
      return <Hand className="w-10 h-10 text-orange-400" />;
    case 'MousePointerClick':
      return <MousePointerClick className="w-10 h-10 text-teal-400" />;
    case 'Eye':
      return <Eye className="w-10 h-10 text-blue-400" />;
    default:
      return <BookOpen className="w-10 h-10 text-blue-400" />;
  }
};

export const VocabularySection: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'objects' | 'verbs'>('all');

  const toggleFlip = (id: string) => {
    sound.playClickSound();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSpeak = async (e: React.MouseEvent, word: VocabWord) => {
    e.stopPropagation();
    sound.playClickSound();
    setSpeakingId(word.id);
    await sound.speak(word.word, 0.85);
    setSpeakingId(null);
  };

  const handleSpeakSentence = async (e: React.MouseEvent, sentence: string) => {
    e.stopPropagation();
    sound.playClickSound();
    await sound.speak(sentence, 0.85);
  };

  const filtered = VOCABULARY_DATA.filter((item) => {
    if (activeTab === 'objects') return item.category.includes('Objects') || item.category.includes('Furniture') || item.category.includes('Places');
    if (activeTab === 'verbs') return item.category.includes('Verbs');
    return true;
  });

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Section Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/40 text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>بطاقات الذاكرة التفاعلية (Interactive Flashcards)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              2. New Words — كلمات المنهاج المصورة
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              اضغط على أي بطاقة لقلبها واكتشاف المعنى بالعربية والجملة النموذجية، واضغط على زر الصوت لسماع النطق الإنجليزي الصحيح.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-center">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              جميع الكلمات ({VOCABULARY_DATA.length})
            </button>
            <button
              onClick={() => setActiveTab('objects')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'objects' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الأدوات الصفية
            </button>
            <button
              onClick={() => setActiveTab('verbs')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'verbs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الأفعال الحركية
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const isFlipped = !!flippedCards[item.id];
          const isSpeaking = speakingId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => toggleFlip(item.id)}
              className={`cursor-pointer group relative rounded-2xl border transition-all duration-300 min-h-[220px] flex flex-col justify-between p-5 shadow-lg ${
                isFlipped
                  ? 'bg-gradient-to-br from-slate-900 to-blue-950/80 border-blue-500/60 shadow-blue-900/20'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:scale-[1.02]'
              }`}
            >
              {/* Top Row: Category tag and Flip indicator */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                  {item.category}
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-blue-400 transition-colors">
                  <RotateCw className="w-3 h-3" />
                  <span>{isFlipped ? 'اقلب للواجهة' : 'اقلب للترجمة'}</span>
                </span>
              </div>

              {!isFlipped ? (
                /* FRONT VIEW: English Word, Phonetic, Icon, Audio Button */
                <div className="my-auto py-3 text-center flex flex-col items-center">
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-3 shadow-inner group-hover:scale-110 transition-transform">
                    {getVocabIcon(item.icon)}
                  </div>

                  <h3 className="text-2xl font-black text-white font-['Outfit'] tracking-wider mb-1">
                    {item.word}
                  </h3>
                  <span className="text-xs font-mono text-slate-400 block mb-3">
                    {item.phonetic}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleSpeak(e, item)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSpeaking
                        ? 'bg-blue-600 text-white scale-105'
                        : 'bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>استمع للنطق الإنجليزي</span>
                  </button>
                </div>
              ) : (
                /* BACK VIEW: Arabic Translation & Example Sentence */
                <div className="my-auto py-2 text-center flex flex-col items-center animate-fade-in">
                  <div className="text-3xl font-extrabold text-amber-400 mb-1">
                    {item.arabic}
                  </div>
                  <span className="text-xs text-slate-400 mb-4 font-['Outfit'] font-bold">
                    English: {item.word}
                  </span>

                  <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-right">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-semibold text-slate-300">جملة توضيحية من المنهاج:</span>
                      <button
                        type="button"
                        onClick={(e) => handleSpeakSentence(e, item.exampleSentence)}
                        className="p-1 rounded hover:bg-slate-800 text-blue-400"
                        title="استمع للجملة"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-white font-['Outfit'] ltr text-left mb-1">
                      "{item.exampleSentence}"
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {item.exampleArabic}
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom footer bar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>كتاب الطالب — الوحدة 2</span>
                <span className="flex items-center gap-1 text-amber-400/80">
                  <Star className="w-3 h-3 fill-current" />
                  <span>معتمدة</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
