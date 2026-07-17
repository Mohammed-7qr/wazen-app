/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Star, Sparkles, ChevronLeft, ArrowRight, ExternalLink, GraduationCap, Clock, CheckCircle } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'budget' | 'savings' | 'investment' | 'debt';
  duration: string;
  xpReward: number;
  sourceName: string;
  sourceUrl: string;
  content: string[];
}

interface LearnPageProps {
  onAwardXp: (points: number) => void;
}

const LESSONS: Lesson[] = [
  {
    id: "l-1",
    title: "أساسيات إدارة المال الشخصي",
    description: "تعرف على المفاهيم الأساسية للتحكم بالدخل والمصاريف وصناعة الأمان المالي.",
    category: "savings",
    duration: "١٠ دقائق",
    xpReward: 30,
    sourceName: "البنك المركزي السعودي - الوعي المالي",
    sourceUrl: "https://www.sama.gov.sa/", // تم التحديث للموقع الرسمي للبنك المركزي
    content: [
      "إدارة المال ليست مجرد معرفة كم تجني وكم تنفق، بل هي فلسفة متكاملة لضبط أسلوب حياتك وصناعة الأمان المالي لغدك. تبدأ الإدارة الناجحة بالوعي التام بصافي دخلك الشهري وتحديد النفقات الأساسية مسبقاً.",
      "الخطوة الأولى والجوهرية هي التمييز الواضح بين الاحتياجات الضرورية (مثل الإيجار، الفواتير، الغذاء الأساسي) وبين الرغبات الكمالية والترفيهية (مثل المقاهي، العلامات التجارية الشهيرة، اشتراكات الترفيه الإضافية). ليس الهدف من الإدارة المالية هو الحرمان، بل التوجيه الذكي للفائض نحو البناء المستدام.",
      "صندوق الطوارئ هو صمام الأمان الحقيقي ضد التقلبات غير المتوقعة كوعكة صحية طارئة أو إصلاحات مفاجئة للسيارة. يُنصح علمياً بأن يغطي هذا الصندوق نفقاتك المعيشية لمدة ٣ إلى ٦ أشهر كاملة وتخزينه في حساب منفصل بعيداً عن متناول يدك اليومي."
    ]
  },
  {
    id: "l-2",
    title: "كيف تضع ميزانية بسيطة وناجحة",
    description: "خطوات عملية وبسيطة لإنشاء ميزانية شهرية متوازنة تضمن أهدافك وتفادي الديون.",
    category: "budget",
    duration: "١٥ دقيقة",
    xpReward: 40,
    sourceName: "البنك المركزي السعودي - مبادئ إعداد الميزانية",
    sourceUrl: "https://www.sama.gov.sa/", // تم توحيد وتحديث رابط المصدر الرسمي
    content: [
      "الميزانية ليست قيوداً تحد من حريتك اليومية بل هي أداة تمنحك القوة والتحكم بمسار أموالك وتوجهها مباشرة نحو ما يهمك حقاً. إحدى أشهر الطرق وأبسطها للمبتدئين هي قاعدة ٥٠/٣٠/٢٠ المالية الشهيرة.",
      "بموجب هذه القاعدة، يتم تقسيم دخلك الصافي كالتالي: ٥٠٪ للااحتياجات الأساسية والمعيشية الإلزامية، ٣٠٪ للرغبات والأنشطة الترفيهية الشخصية، و٢٠٪ للادخار الفوري أو الاستثمار المباشر وسداد الالتزامات إن وجدت.",
      "لمراقبة تطبيق ميزانيتك بفعالية عالية: سجّل كل حركة مالية صغرت أم كبرت فور حدوثها، وتجنب السحب العشوائي. استخدام تطبيقات التتبع الذكية مثل منصة وازن يضمن لك رؤية بيانية دقيقة تمنع الهدر المفاجئ في منتصف الشهر."
    ]
  },
  {
    id: "l-3",
    title: "أهمية الادخار السليم",
    description: "لماذا يعتبر الادخار هو حجر الأساس لبناء ثروتك الشخصية وتأمين خيارات مستقبلك؟",
    category: "savings",
    duration: "٨ دقائق",
    xpReward: 25,
    sourceName: "منصة دروب - مهارات الادخار الشخصي",
    sourceUrl: "https://www.doroob.sa/", // الرابط سليم وموثوق
    content: [
      "الادخار السليم ليس ما يتبقى بعد الإنفاق، بل هو الجزء المقتطع أولاً فور استلام الدخل. كما ينصح المستثمر الشهير وارن بافت: 'لا تدخر ما يتبقى بعد الإنفاق، بل أنفق ما يتبقى بعد الادخار المباشر'.",
      "الادخار المستدام يحميك تماماً من الاضطرار للاقتراض بفوائد ومرابحات عالية، ويتيح لك الاستفادة الفورية من الفرص الاستثمارية التي تطرأ فجأة، كما يمنحك استقلالية نفسية كبيرة تدعم اتخاذ قرارات مصيرية كتأسيس مشروعك الخاص.",
      "ابدأ صغيراً؛ ادخار ١٠٪ من دخلك بانتظام اليوم أفضل بكثير من انتظار اللحظة المثالية لادخار مبالغ ضخمة. الانضباط المستمر والتراكمي هو الصانع الحقيقي للحصالة الذهبية والنمو المالي عبر السنوات."
    ]
  },
  {
    id: "l-4",
    title: "أساسيات الاستثمار الذكي",
    description: "مقدمة مبسطة وموثوقة للمبتدئين لدخول عالم الاستثمار والنمو المالي السليم.",
    category: "investment",
    duration: "١٢ دقيقة",
    xpReward: 35,
    sourceName: "برنامج ثمين - التوعية الاستثمارية الخليجية",
    sourceUrl: "https://thameen.org/", // تم تصحيح النطاق من .org.sa إلى النطاق الفعال الحالي .org الرسمي المعتمد من هيئة السوق المالية
    content: [
      "الاستثمار هو تشغيل فائض أموالك لتعمل بالنيابة عنك وتحقق عوائد ملموسة تتفوق على معدل التضخم السنوي الذي يأكل القوة الشرائية للنقد الساكن. الاستثمار الذكي يتطلب فهماً واضحاً لمفهوم توزيع المخاطر.",
      "القاعدة الذهبية للاستثمار الآمن هي 'لا تضع البيض كله في سلة واحدة'؛ أي ضرورة تنويع استثماراتك بين الأسهم، الصناديق الاستثمارية، الصكوك، والعقارات لتقليل احتمالية الخسائر وتثبيت الأداء العام للمحفظة.",
      "للمبتدئين، تعتبر الصناديق الاستثمارية المشتركة أو الصناديق المتداولة (ETFs) خياراً مثالياً للمشاركة في نمو الاقتصاد الوطني أو العالمي دون الحاجة لتحليلات فنية معقدة أو إدارة يومية مرهقة للأسهم الفردية."
    ]
  },
  {
    id: "l-5",
    title: "التعامل الذكي مع الديون والائتمان",
    description: "كيف تستفيد من مميزات البطاقات الائتمانية دون الوقوع في تراكم الفوائد والالتزامات المعطلة.",
    category: "debt",
    duration: "١٠ دقائق",
    xpReward: 30,
    sourceName: "برنامج ريالي للوعي المالي - إدارة الديون",
    sourceUrl: "https://riyali.com/", // الرابط سليم ويعمل بكفاءة
    content: [
      "البطاقات الائتمانية أداة مالية ذات حدين؛ يمكن أن تكون أداة دفع ذكية تمنحك استرداداً نقدياً ومزايا تأمين مجانية، أو يمكن أن تتحول سريعاً لسلسلة من الديون التراكمية التي تلتهم جزءاً كبيراً من دخلك لسنوات طويلة.",
      "لتجنب الوقوع في الفوائد الإضافية وغرامات التأخير الصارمة: احرص دائماً على تسديد كامل المبلغ المستحق (Total Statement Balance) وليس الحد الأدنى للمطالبة المالية فقط (Minimum Payment) قبل تاريخ الاستحقاق.",
      "إذا كنت تواجه التزامات مالية حالية، استخدم إحدى طريقتين شهيرتين: إما 'كرة الثلج' بسداد الديون الصغيرة أولاً للحصول على دافع معنوي مستمر، أو 'الانهيار الجبلي' بالتركيز على سداد الديون ذات معدلات المرابحة الأعلى لتخفيض التكلفة الكلية للتمويل."
    ]
  }
];

export default function LearnPage({ onAwardXp }: LearnPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'budget' | 'savings' | 'investment' | 'debt'>('all');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wazen_completed_lessons_v1");
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse completed lessons", e);
      }
    }
  }, []);

  // Filter lessons based on active filter
  const filteredLessons = LESSONS.filter(lesson => {
    if (selectedFilter === 'all') return true;
    return lesson.category === selectedFilter;
  });

  // Handle lesson reading completion
  const handleMarkAsCompleted = (lessonId: string, xp: number) => {
    if (completedLessons.includes(lessonId)) return;

    const newCompleted = [...completedLessons, lessonId];
    setCompletedLessons(newCompleted);
    localStorage.setItem("wazen_completed_lessons_v1", JSON.stringify(newCompleted));
    
    // Award XP in parent App component
    onAwardXp(xp);

    // Show toast notification
    setShowToast(`تهانينا! لقد أنهيت قراءة الدرس بنجاح وحصلت على +${xp} XP 🏆`);
    setTimeout(() => {
      setShowToast(null);
    }, 4000);
  };

  // Custom SVG icon rendering matching the requirements
  const renderLessonIcon = (category: string, id: string) => {
    if (category === 'savings' || id === 'l-1' || id === 'l-3') {
      return (
        <div className="relative w-16 h-16 flex items-center justify-center bg-rose-50 rounded-2xl p-2 border border-rose-100 shadow-sm flex-shrink-0">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sparkles/Stars for Smart concept */}
            <path d="M7 13L9 15M7 15L9 13" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M41 11L39 13M41 13L39 11" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Coin falling in */}
            <g>
              <circle cx="24" cy="7" r="4.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
              <text x="24" y="10" textAnchor="middle" fill="#78350F" fontSize="8" fontWeight="black" fontFamily="monospace">$</text>
            </g>

            {/* Piggy Ears */}
            <path d="M19 14L16 8C15.5 7 17 6 18 7.5L21.5 13" fill="#FB7185" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M29 14L32 8C32.5 7 31 6 30 7.5L26.5 13" fill="#FB7185" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Piggy Body */}
            <rect x="11" y="13" width="26" height="23" rx="11.5" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2.2" />

            {/* Piggy Snout */}
            <rect x="35" y="21" width="5" height="7" rx="2" fill="#FB7185" stroke="#E11D48" strokeWidth="2.2" />
            <circle cx="37.5" cy="23.5" r="0.7" fill="#881337" />
            <circle cx="37.5" cy="25.5" r="0.7" fill="#881337" />

            {/* Eye */}
            <circle cx="29" cy="21" r="1.5" fill="#1F2937" />
            <circle cx="29.5" cy="20.5" r="0.5" fill="#FFFFFF" />

            {/* Feet */}
            <path d="M16 35V39C16 39.8 17.2 40 18 40V35" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 35V39C24 39.8 25.2 40 26 40V35" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M31 35V39C31 39.8 32.2 40 33 40V35" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Tail */}
            <path d="M11 24C9 24 8 22 8 21C8 20 9 19 10 20C11 21 10.5 22.5 11 23" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );
    } else if (category === 'budget' || id === 'l-2') {
      return (
        <div className="relative w-16 h-16 flex items-center justify-center bg-emerald-50 rounded-2xl p-2 border border-emerald-100 shadow-sm flex-shrink-0">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="10" width="24" height="32" rx="4" fill="#ECFDF5" stroke="#059669" strokeWidth="2.2" />
            <path d="M20 10V8C20 6.9 20.9 6 22 6H26C27.1 6 28 6.9 28 8V10" fill="#A7F3D0" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="18" y1="18" x2="30" y2="18" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="24" x2="30" y2="24" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 32L22 35L30 27" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    } else if (category === 'investment' || id === 'l-4') {
      return (
        <div className="relative w-16 h-16 flex items-center justify-center bg-amber-50 rounded-2xl p-2 border border-amber-100 shadow-sm flex-shrink-0">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Soil / Seedling sprout representing growing capital */}
            <path d="M10 40C14 36 34 36 38 40H10Z" fill="#78350F" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 40V20" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M24 28C24 28 32 26 34 18C30 18 24 24 24 28Z" fill="#34D399" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 22C24 22 16 20 14 12C18 12 24 18 24 22Z" fill="#10B981" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="relative w-16 h-16 flex items-center justify-center bg-slate-50 rounded-2xl p-2 border border-slate-100 shadow-sm flex-shrink-0">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Credit card/wallet SVG */}
            <rect x="8" y="12" width="32" height="24" rx="4" fill="#EEF2F6" stroke="#475569" strokeWidth="2.2" />
            <rect x="8" y="18" width="32" height="6" fill="#1E293B" />
            <rect x="12" y="28" width="6" height="4" rx="1" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="32" cy="30" r="3" fill="#EF4444" />
            <circle cx="35" cy="30" r="3" fill="#FBBF24" opacity="0.8" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6 pb-24 text-right rtl relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 left-4 right-4 m-auto max-w-sm bg-emerald-950 text-accent font-black text-xs py-3 px-4 rounded-2xl shadow-xl border border-accent/20 z-50 text-center flex items-center justify-center gap-2"
          >
            <Sparkles size={16} className="text-accent animate-bounce" />
            <span>{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main View Header */}
      {!selectedLesson && (
        <>
          <div className="flex justify-between items-center bg-white/70 p-4 rounded-2xl border border-emerald-950/5 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-emerald-950 flex items-center gap-2 justify-end">
                <span>تعلم المالية والوعي المالي</span>
                <GraduationCap size={22} className="text-primary" />
              </h2>
              <p className="text-[11px] text-gray-500">طوّر ثقافتك المالية، واكسب الـ XP لدعم مستواك الشخصي</p>
            </div>
          </div>

          {/* Categorized Filter Tabs (Horizontal scrolling) */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none justify-end">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-black border transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                  : 'bg-white text-gray-500 border-gray-100 hover:text-gray-700'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setSelectedFilter('budget')}
              className={`px-4 py-1.5 rounded-full text-xs font-black border transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === 'budget'
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                  : 'bg-white text-gray-500 border-gray-100 hover:text-gray-700'
              }`}
            >
              الميزانية
            </button>
            <button
              onClick={() => setSelectedFilter('savings')}
              className={`px-4 py-1.5 rounded-full text-xs font-black border transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === 'savings'
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                  : 'bg-white text-gray-500 border-gray-100 hover:text-gray-700'
              }`}
            >
              الادخار
            </button>
            <button
              onClick={() => setSelectedFilter('investment')}
              className={`px-4 py-1.5 rounded-full text-xs font-black border transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === 'investment'
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                  : 'bg-white text-gray-500 border-gray-100 hover:text-gray-700'
              }`}
            >
              الاستثمار
            </button>
            <button
              onClick={() => setSelectedFilter('debt')}
              className={`px-4 py-1.5 rounded-full text-xs font-black border transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === 'debt'
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                  : 'bg-white text-gray-500 border-gray-100 hover:text-gray-700'
              }`}
            >
              الديون والائتمان
            </button>
          </div>

          {/* Lessons List Layout */}
          <div className="space-y-4">
            {filteredLessons.map((lesson) => {
              const isRead = completedLessons.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className="bg-white border-2 border-gray-100 p-4.5 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex gap-4 items-center text-right relative overflow-hidden"
                >
                  {/* Read Badge Status Indicator */}
                  {isRead && (
                    <div className="absolute top-3 left-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full p-1 shadow-sm">
                      <CheckCircle size={14} className="fill-emerald-100" />
                    </div>
                  )}

                  {/* Left Column SVG Icon */}
                  {renderLessonIcon(lesson.category, lesson.id)}

                  {/* Right Column text */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-sm font-black text-emerald-950 leading-tight">{lesson.title}</h4>
                      <div className="bg-accent/20 border border-accent/10 rounded-full px-2 py-0.5 flex items-center gap-0.5 text-emerald-950 font-extrabold text-[9px] flex-shrink-0 font-sans">
                        <Star size={10} className="fill-accent text-accent" />
                        <span>+{lesson.xpReward} XP</span>
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-gray-500 leading-normal font-medium">{lesson.description}</p>
                    
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold font-sans pt-0.5">
                      <Clock size={11} />
                      <span>زمن القراءة المقدر: {lesson.duration}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLessons.length === 0 && (
              <p className="text-center text-xs text-gray-400 py-8 font-bold">لا توجد مواد تعليمية مسجلة لهذه الفئة حتى الآن.</p>
            )}
          </div>
        </>
      )}

      {/* Lesson Reader Panel View (Immersive reader view) */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-[2rem] border-2 border-gray-100 p-6 space-y-6 text-right"
          >
            {/* Header / Back Button */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <button
                onClick={() => setSelectedLesson(null)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-black text-gray-600 transition-all cursor-pointer border border-gray-100"
              >
                <span>رجوع للمقالات</span>
                <ChevronLeft size={14} />
              </button>

              <div className="bg-accent/20 border border-accent/15 rounded-full px-3 py-1 flex items-center gap-1 text-emerald-950 font-black text-xs font-sans">
                <Star size={13} className="fill-accent text-accent" />
                <span>+{selectedLesson.xpReward} XP متاح</span>
              </div>
            </div>

            {/* Content & Metadata */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-emerald-950">{selectedLesson.title}</h3>
              
              <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold font-sans pb-1 border-b border-gray-50">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>مدة القراءة: {selectedLesson.duration}</span>
                </span>
                <span>•</span>
                <span>المصدر: {selectedLesson.sourceName}</span>
              </div>

              {/* Formatted body paragraphs */}
              <div className="space-y-4 pt-2 text-gray-700 text-sm leading-relaxed font-medium">
                {selectedLesson.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* External Reference Link */}
            <div className="bg-gray-50/70 border border-gray-100 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-right">
                <h5 className="text-xs font-black text-emerald-950">هل تود الاستزادة والتعمق؟</h5>
                <p className="text-[10px] text-gray-400 mt-0.5">يمكنك تصفح المقال الأصلي بالتفصيل لدى الجهة الرسمية الناشرة</p>
              </div>
              <a
                href={selectedLesson.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs font-black hover:bg-emerald-100/60 transition-all font-sans whitespace-nowrap"
              >
                <span>زيارة المصدر المعتمد</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Mark as Completed Button */}
            <div className="pt-2">
              {completedLessons.includes(selectedLesson.id) ? (
                <div className="w-full py-3.5 bg-emerald-50 text-emerald-800 font-black rounded-2xl text-xs flex items-center justify-center gap-2 border border-emerald-100 shadow-sm">
                  <CheckCircle size={16} className="fill-emerald-100" />
                  <span>لقد أنهيت قراءة هذه المادة بنجاح! 🏆</span>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleMarkAsCompleted(selectedLesson.id, selectedLesson.xpReward)}
                  className="w-full py-3.5 bg-primary text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/25 border border-white hover:bg-primary-light transition-all"
                >
                  <Sparkles size={16} className="animate-spin text-accent" />
                  <span>أنهيت القراءة، احسب نقاط الـ XP الموعودة 🚀</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
