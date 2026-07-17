/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Zap, ShieldAlert, Sparkles, CheckCircle2, ChevronLeft, HelpCircle, Trophy, Star, Lock, X } from "lucide-react";
import { Challenge, Achievement } from "../types";
import { CelebrationEffect } from "./CelebrationEffect";

interface ChallengesPageProps {
  challenges: Challenge[];
  achievements: Achievement[];
  userProfile: { level: number; xp: number; xpToNextLevel: number; budgetStreak: number };
  onClaimReward: (challengeId: string, xpReward: number) => void;
}

export default function ChallengesPage({ 
  challenges, 
  achievements, 
  userProfile,
  onClaimReward 
}: ChallengesPageProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'achievements'>('active');
  const [unlockedChallengeId, setUnlockedChallengeId] = useState<string | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Filter challenges
  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');

  const handleClaim = (id: string, xp: number) => {
    onClaimReward(id, xp);
    setUnlockedChallengeId(id);
    setTimeout(() => {
      setUnlockedChallengeId(null);
    }, 2500);
  };

  // Choose icon based on category or id
  const getChallengeIcon = (category: string, id: string) => {
    if (category === 'savings' || id === 'c-1') {
      return (
        <div className="relative w-16 h-16 flex items-center justify-center bg-rose-50/80 rounded-2xl p-2 border border-rose-100 shadow-sm flex-shrink-0">
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
    } else if (category === 'budget' || id === 'c-2') {
      return (
        <div className="relative w-16 h-16 flex items-center justify-center bg-emerald-50/80 rounded-2xl p-2 border border-emerald-100 shadow-sm flex-shrink-0">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Clipboard base */}
            <rect x="12" y="10" width="24" height="32" rx="4" fill="#ECFDF5" stroke="#059669" strokeWidth="2.2" />
            
            {/* Clip */}
            <path d="M20 10V8C20 6.9 20.9 6 22 6H26C27.1 6 28 6.9 28 8V10" fill="#A7F3D0" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Lines */}
            <line x1="18" y1="18" x2="30" y2="18" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="24" x2="30" y2="24" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            
            {/* Beautiful analytics line */}
            <path d="M18 32L22 35L30 27" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="relative w-16 h-16 flex items-center justify-center bg-amber-50/80 rounded-2xl p-2 border border-amber-100 shadow-sm flex-shrink-0">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cash bills peaking */}
            <rect x="15" y="8" width="18" height="12" rx="2" fill="#D1FAE5" stroke="#059669" strokeWidth="2.2" />
            <circle cx="24" cy="14" r="2" fill="#34D399" />
            
            {/* Wallet Body */}
            <rect x="10" y="14" width="28" height="26" rx="4" fill="#D97706" stroke="#78350F" strokeWidth="2.2" />
            
            {/* Flap */}
            <path d="M25 21H38V33H25C23 33 21 31 21 29V25C21 23 23 21 25 21Z" fill="#B45309" stroke="#78350F" strokeWidth="2.2" />
            
            {/* Lock button */}
            <circle cx="30" cy="27" r="2.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6 pb-24 text-right rtl">
      {/* Gamification Level Dashboard Header */}
      <div className="card-premium p-4.5 bg-gradient-to-r from-emerald-950 to-primary text-white relative overflow-hidden">
        {/* Repeating star background subtle */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-overlay"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-accent">
              <Trophy size={16} />
              <span className="text-[10px] uppercase font-bold tracking-wider">نظام الإنجازات والتحفيز</span>
            </div>
            <h2 className="text-xl font-black font-sans mt-1">مستوى المهارة: {userProfile.level}</h2>
            
            {/* XP bar */}
            <div className="w-52 mt-3 bg-white/10 h-2.5 rounded-full overflow-hidden border border-white/5 p-[1px]">
              <div 
                className="bg-accent h-full rounded-full transition-all duration-1000"
                style={{ width: `${(userProfile.xp / userProfile.xpToNextLevel) * 100}%` }}
              ></div>
            </div>
            
            <p className="text-[10px] text-gray-300 mt-1.5 font-sans">
              لديك الآن <span className="text-accent font-bold">{userProfile.xp} XP</span> متبقي لك {userProfile.xpToNextLevel - userProfile.xp} نقطة للترقي التالي
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-accent text-emerald-950 rounded-2xl flex flex-col items-center justify-center font-extrabold shadow-lg shadow-accent/10 border-2 border-white relative">
              <span className="text-xs">المستوى</span>
              <span className="text-xl font-sans font-black">{userProfile.level}</span>
              {/* Streak badge */}
              <div className="absolute -bottom-2 -left-2 bg-primary text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full border border-accent">
                {userProfile.budgetStreak} أيام 🔥
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selector tab switches */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setActiveTab('active')}
          className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'active' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'
          }`}
        >
          التحديات الجارية ({activeChallenges.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'completed' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'
          }`}
        >
          المكتملة ({completedChallenges.length})
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'achievements' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'
          }`}
        >
          الأوسمة الشرفية ({achievements.filter(a=>a.unlocked).length})
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-3.5">
        <AnimatePresence mode="wait">
          {activeTab === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {activeChallenges.map((c) => {
                const pct = Math.min(100, Math.round((c.progress / c.target) * 100));
                const canClaim = c.progress >= c.target;
                
                return (
                  <div 
                    key={c.id} 
                    className="bg-white border-2 border-gray-100 p-5 rounded-[2rem] shadow-sm relative overflow-hidden flex gap-4 items-center text-right"
                  >
                    {/* Glowing highlight for ready to claim challenges */}
                    {canClaim && (
                      <div className="absolute top-0 right-0 left-0 h-1 bg-accent animate-pulse"></div>
                    )}

                    {/* Left Column: Icon + Deadline */}
                    <div className="flex flex-col items-center gap-2 w-20 flex-shrink-0 text-center">
                      {getChallengeIcon(c.category, c.id)}
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/50 whitespace-nowrap font-sans">
                        {c.deadline}
                      </span>
                    </div>

                    {/* Right Column: Title, Description, Progress */}
                    <div className="flex-1 flex flex-col justify-between space-y-2.5">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-sm font-black text-emerald-950 leading-tight">{c.title}</h4>
                          <div className="bg-accent/20 border border-accent/10 rounded-full px-2 py-0.5 flex items-center gap-0.5 text-emerald-950 font-extrabold text-[9px] flex-shrink-0 font-sans">
                            <Star size={10} className="fill-accent text-accent" />
                            <span>+{c.rewardXp} XP</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-normal font-medium">{c.description}</p>
                      </div>

                      {/* Percentage + Progress line */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-emerald-950 font-sans min-w-[32px]">
                          %{pct}
                        </span>
                        <div className="flex-1 bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-100 p-[1px]">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Claim Button */}
                      {canClaim && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleClaim(c.id, c.rewardXp)}
                          className="w-full mt-1.5 py-2 bg-accent text-emerald-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-accent/10 border border-white"
                        >
                          <Sparkles size={13} className="animate-spin text-emerald-800" />
                          <span>استلام المكافأة (+{c.rewardXp} XP) 🏆</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                );
              })}

              {activeChallenges.length === 0 && (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-2">
                  <HelpCircle size={32} className="mx-auto text-gray-300" />
                  <p className="text-xs text-gray-400 font-semibold">لا توجد تحديات نشطة حالياً. انتظر اقتراحات جديدة من وازن!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {completedChallenges.map((c) => (
                <div 
                  key={c.id} 
                  className="bg-emerald-50/20 border border-emerald-50 p-4 rounded-2xl flex justify-between items-center shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-accent/20 text-emerald-900 rounded-xl flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">{c.title}</h4>
                      <p className="text-[10px] text-gray-500 leading-normal mt-0.5">{c.description}</p>
                    </div>
                  </div>
                  
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                    تم استلام XP 👑
                  </span>
                </div>
              ))}

              {completedChallenges.length === 0 && (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-2">
                  <HelpCircle size={32} className="mx-auto text-gray-300" />
                  <p className="text-xs text-gray-400 font-semibold">لم تنهِ أي تحدٍ بعد. التزم بميزانيتك لتحصل على أولى إنجازاتك!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 gap-3"
            >
              {achievements.map((a) => (
                <motion.div 
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAchievement(a)}
                  key={a.id}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between gap-2.5 transition-all shadow-sm cursor-pointer select-none ${
                    a.unlocked 
                      ? 'bg-white border-accent/25 hover:border-accent hover:shadow-md' 
                      : 'bg-gray-50/50 border-gray-100 grayscale opacity-65 hover:opacity-90'
                  }`}
                >
                  <div className={`text-3xl p-2.5 rounded-2xl border shadow-inner transition-transform duration-300 ${
                    a.unlocked ? 'bg-accent/10 border-accent/10 scale-110' : 'bg-gray-100 border-gray-200'
                  }`}>
                    {a.badge}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-800 block">{a.title}</span>
                    <p className="text-[9px] text-gray-400 leading-tight mt-1">{a.description}</p>
                  </div>

                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                    a.unlocked ? 'bg-accent/20 text-emerald-950' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {a.unlocked ? `مفتوح (+${a.xpValue} XP)` : 'مغلق'}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Unlocked Reward Fireworks simulation animation popup */}
      <AnimatePresence>
        {unlockedChallengeId && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed inset-0 m-auto max-w-xs h-fit bg-emerald-950 border border-accent/30 rounded-3xl p-6 text-center text-white z-50 shadow-2xl flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-3xl animate-bounce">
              👑
            </div>
            <div>
              <h3 className="text-base font-bold text-accent">مبارك! ارتقيت في المستوى 🌟</h3>
              <p className="text-xs text-gray-300 leading-relaxed mt-1">
                لقد أنجزت التحدي بنجاح وحصلت على نقاط الخبرة الإضافية. استمر بهذا الانضباط الرائع!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Achievement Detail Modal with Confetti Celebration */}
      <AnimatePresence>
        {selectedAchievement && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAchievement(null)}
              className="fixed inset-0 bg-emerald-950/70 backdrop-blur-sm z-[100000] cursor-pointer"
            />

            {/* If unlocked, trigger center-spawn confetti celebration */}
            {selectedAchievement.unlocked && (
              <CelebrationEffect duration={3500} spawnFromCenterOnly={true} />
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 m-auto max-w-sm bg-white border-2 border-accent/30 rounded-[2.5rem] p-6 z-[100001] text-center text-gray-900 shadow-2xl flex flex-col items-center gap-5 rtl overflow-hidden"
            >
              {/* Decorative design header */}
              <div className={`absolute top-0 inset-x-0 h-36 bg-gradient-to-b -z-10 pointer-events-none ${
                selectedAchievement.unlocked ? "from-accent/15" : "from-gray-100"
              }`} />

              {/* Close button */}
              <button
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer border border-gray-100 transition-colors"
              >
                <X size={14} />
              </button>

              {/* Badge Container */}
              <div className="relative mt-4">
                {selectedAchievement.unlocked && (
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl scale-125 animate-pulse" />
                )}
                <motion.div
                  animate={selectedAchievement.unlocked ? { 
                    rotate: [0, -8, 8, -8, 8, 0],
                    scale: [1, 1.08, 1.08, 1]
                  } : {}}
                  transition={{ repeat: Infinity, repeatDelay: 3.5, duration: 1.5 }}
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-lg border-4 relative ${
                    selectedAchievement.unlocked 
                      ? "bg-gradient-to-br from-accent/20 to-accent border-accent/20 text-white" 
                      : "bg-gray-100 border-gray-200 grayscale opacity-50"
                  }`}
                >
                  {selectedAchievement.badge}
                  {selectedAchievement.unlocked && (
                    <div className="absolute -top-1.5 -right-1.5 bg-accent text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-white">
                      مكتمل
                    </div>
                  )}
                </motion.div>
                
                {selectedAchievement.unlocked && (
                  <>
                    <div className="absolute -top-2 -left-2 text-xl animate-bounce">✨</div>
                    <div className="absolute -bottom-1 -right-2 text-lg animate-bounce" style={{ animationDelay: "300ms" }}>🌟</div>
                  </>
                )}
              </div>

              {/* Achievement description */}
              <div className="space-y-1.5 w-full mt-2">
                <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                  selectedAchievement.unlocked 
                    ? "text-accent bg-accent/10 border-accent/10" 
                    : "text-gray-400 bg-gray-50 border-gray-100"
                }`}>
                  {selectedAchievement.unlocked ? "أوسمة الشرف الذهبية" : "الأوسمة المقفلة"}
                </span>
                <h3 className="text-xl font-black text-emerald-950 mt-2.5">
                  {selectedAchievement.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed px-2">
                  {selectedAchievement.description}
                </p>
              </div>

              {/* Status pill & Rewards info */}
              <div className="w-full mt-1">
                {selectedAchievement.unlocked ? (
                  <div className="bg-emerald-50 text-emerald-950 text-xs font-bold rounded-xl py-3 px-4 flex justify-between items-center border border-emerald-100">
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} className="text-accent" />
                      <span>+{selectedAchievement.xpValue} XP</span>
                    </span>
                    <span>تم كسب هذا الوسام! 🎉</span>
                  </div>
                ) : (
                  <div className="bg-gray-50 text-gray-500 text-xs font-bold rounded-xl py-3 px-4 flex justify-between items-center border border-gray-100">
                    <span className="flex items-center gap-1">
                      <Lock size={12} className="text-gray-400" />
                      <span>+{selectedAchievement.xpValue} XP متوقع</span>
                    </span>
                    <span>تطلب لإلغاء القفل 🔒</span>
                  </div>
                )}
              </div>

              {/* Motivator text */}
              <p className="text-[10px] text-gray-400 leading-normal max-w-[85%]">
                {selectedAchievement.unlocked 
                  ? "أحسنت صنعاً! هذا الوسام يعكس مستوى رفيعاً من الذكاء والانضباط في إدارة ميزانيتك ومحفظتك."
                  : "استمر في تحقيق التوازن المالي وتجنب الإسراف لتكسب هذا الوسام ومكافأة الـ XP الثمينة الخاصة به!"
                }
              </p>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedAchievement(null)}
                className={`w-full py-3.5 font-extrabold rounded-2xl text-xs cursor-pointer shadow-md transition-all mt-1 ${
                  selectedAchievement.unlocked
                    ? "bg-accent hover:bg-accent-light text-emerald-950 shadow-accent/10 border border-white"
                    : "bg-emerald-950 hover:bg-emerald-900 text-white border border-emerald-900"
                }`}
              >
                {selectedAchievement.unlocked ? "فخور به! متابعة ⚡" : "سأعمل على كسبه! 🎯"}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
