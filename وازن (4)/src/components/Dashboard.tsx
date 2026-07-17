/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, TrendingDown, PiggyBank, Award, Plus, ArrowLeftRight, Sparkles, 
  ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight, CheckCircle2, Circle, Star
} from "lucide-react";
import { Wallet, Transaction, Challenge, Goal } from "../types";

interface DashboardProps {
  wallets: Wallet[];
  transactions: Transaction[];
  challenges: Challenge[];
  goals: Goal[];
  userProfile: { name: string; email: string; level: number; xp: number; xpToNextLevel: number; budgetStreak: number };
  onNavigateToTab: (tab: string) => void;
  onAddTransactionQuick: (type: 'income' | 'expense') => void;
  onOpenAiAdvisor: () => void;
}

export default function Dashboard({ 
  wallets, 
  transactions, 
  challenges, 
  goals,
  userProfile, 
  onNavigateToTab,
  onAddTransactionQuick,
  onOpenAiAdvisor
}: DashboardProps) {
  // Choose icon based on category or id
  const getChallengeIcon = (category: string, id: string) => {
    if (category === 'savings' || id === 'c-1') {
      return (
        <div className="relative w-14 h-14 flex items-center justify-center bg-rose-50/80 rounded-2xl p-1.5 border border-rose-100 shadow-sm flex-shrink-0">
          <svg width="38" height="38" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <div className="relative w-14 h-14 flex items-center justify-center bg-emerald-50/80 rounded-2xl p-1.5 border border-emerald-100 shadow-sm flex-shrink-0">
          <svg width="38" height="38" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="10" width="24" height="32" rx="4" fill="#ECFDF5" stroke="#059669" strokeWidth="2.2" />
            <path d="M20 10V8C20 6.9 20.9 6 22 6H26C27.1 6 28 6.9 28 8V10" fill="#A7F3D0" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="18" y1="18" x2="30" y2="18" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="24" x2="30" y2="24" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 32L22 35L30 27" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="relative w-14 h-14 flex items-center justify-center bg-amber-50/80 rounded-2xl p-1.5 border border-amber-100 shadow-sm flex-shrink-0">
          <svg width="38" height="38" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="8" width="18" height="12" rx="2" fill="#D1FAE5" stroke="#059669" strokeWidth="2.2" />
            <circle cx="24" cy="14" r="2" fill="#34D399" />
            <rect x="10" y="14" width="28" height="26" rx="4" fill="#D97706" stroke="#78350F" strokeWidth="2.2" />
            <path d="M25 21H38V33H25C23 33 21 31 21 29V25C21 23 23 21 25 21Z" fill="#B45309" stroke="#78350F" strokeWidth="2.2" />
            <circle cx="30" cy="27" r="2.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />
          </svg>
        </div>
      );
    }
  };

  // Aggregate stats
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSavings = totalIncome > totalExpense ? (totalIncome - totalExpense) : 0;
  const savingsRate = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

  // Formatting utility
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ar-SA') + ' ريال';
  };

  // Recent 3 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-24 text-right rtl">
      {/* Top Greeting & AI Advisor Bubble */}
      <div className="flex justify-between items-center bg-white/70 p-4 rounded-2xl border border-emerald-950/5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg border-2 border-emerald-50">
            {userProfile.name[0]}
          </div>
          <div>
            <h3 className="text-sm font-black text-emerald-950">السلام عليكم، {userProfile.name} 👋</h3>
            <p className="text-[11px] text-gray-500">مستشارك المالي الذكي وازن جاهز لمساعدتك</p>
          </div>
        </div>
        
        {/* Sparkly AI Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenAiAdvisor}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 text-white font-bold rounded-xl text-xs hover:bg-primary-light transition-all cursor-pointer shadow-sm shadow-emerald-950/15"
        >
          <Sparkles size={13} className="text-accent animate-pulse" />
          <span>مستشار وازن الذكي</span>
        </motion.button>
      </div>

      {/* Gamification Tracker (Level & XP Status) */}
      <div className="card-premium p-4.5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white relative overflow-hidden">
        {/* Subtle Islamic motif background overlay */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-overlay"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent/80">المستوى المالي الحالي</span>
            <h2 className="text-xl font-black font-sans mt-0.5">مستوى {userProfile.level}</h2>
            
            {/* Progress Bar to next level */}
            <div className="w-48 mt-3 bg-white/10 h-2.5 rounded-full overflow-hidden border border-white/5 p-[1px]">
              <div 
                className="bg-accent h-full rounded-full transition-all duration-1000"
                style={{ width: `${(userProfile.xp / userProfile.xpToNextLevel) * 100}%` }}
              ></div>
            </div>
            
            <p className="text-[10px] text-gray-300 mt-1.5 font-sans">
              <span className="text-accent font-bold">{userProfile.xp} نقطة</span> / {userProfile.xpToNextLevel} نقطة إلى مستوى {userProfile.level + 1}
            </p>
          </div>
          
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-accent border border-white/10 shadow-inner backdrop-blur-sm relative animate-pulse-subtle">
            <Award size={32} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-emerald-950 font-bold rounded-full flex items-center justify-center text-[10px] border-2 border-emerald-950">
              {userProfile.budgetStreak}🔥
            </span>
          </div>
        </div>
      </div>

      {/* Raseed (Balance Card) */}
      <div className="card-premium p-5 text-center relative overflow-hidden">
        <span className="text-xs text-gray-400 font-extrabold block mb-1">رصيدك المالي الإجمالي</span>
        <h1 className="text-3xl font-black text-primary font-sans tracking-tight mb-4">
          {formatCurrency(totalBalance)}
        </h1>
        
        {/* Stats Grid inside Balance */}
        <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-emerald-950/5">
          <div className="flex flex-col items-center p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-50 text-center">
            <span className="text-[10px] text-gray-400 font-extrabold mb-1">إجمالي الدخل</span>
            <div className="flex items-center gap-1 text-emerald-800 font-black text-sm">
              <TrendingUp size={14} className="text-emerald-600" />
              <span className="font-sans">{formatCurrency(totalIncome)}</span>
            </div>
          </div>

          <div className="flex flex-col items-center p-2.5 bg-red-50/40 rounded-xl border border-red-50/20 text-center">
            <span className="text-[10px] text-gray-400 font-extrabold mb-1">إجمالي المصروفات</span>
            <div className="flex items-center gap-1 text-red-800 font-black text-sm">
              <TrendingDown size={14} className="text-red-500" />
              <span className="font-sans">{formatCurrency(totalExpense)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Circle Buttons */}
      <div className="grid grid-cols-4 gap-3">
        <button
          onClick={() => onAddTransactionQuick('expense')}
          className="flex flex-col items-center gap-2 p-2 bg-white rounded-2xl border border-emerald-950/5 hover:bg-emerald-50/40 transition-all cursor-pointer shadow-sm"
        >
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
            <Plus size={18} className="rotate-45" />
          </div>
          <span className="text-[10px] font-bold text-gray-700">تسجيل صرف</span>
        </button>

        <button
          onClick={() => onAddTransactionQuick('income')}
          className="flex flex-col items-center gap-2 p-2 bg-white rounded-2xl border border-emerald-950/5 hover:bg-emerald-50/40 transition-all cursor-pointer shadow-sm"
        >
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
            <Plus size={18} />
          </div>
          <span className="text-[10px] font-bold text-gray-700">تسجيل دخل</span>
        </button>

        <button
          onClick={() => onNavigateToTab('wallets')}
          className="flex flex-col items-center gap-2 p-2 bg-white rounded-2xl border border-emerald-950/5 hover:bg-emerald-50/40 transition-all cursor-pointer shadow-sm"
        >
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
            <ArrowLeftRight size={18} />
          </div>
          <span className="text-[10px] font-bold text-gray-700">تحويل محافظ</span>
        </button>

        <button
          onClick={onOpenAiAdvisor}
          className="flex flex-col items-center gap-2 p-2 bg-white rounded-2xl border border-emerald-950/5 hover:bg-emerald-50/40 transition-all cursor-pointer shadow-sm"
        >
          <div className="w-10 h-10 bg-emerald-950 rounded-xl flex items-center justify-center text-accent">
            <Sparkles size={16} />
          </div>
          <span className="text-[10px] font-bold text-gray-700">استشِر الذكاء</span>
        </button>
      </div>

      {/* Financial Overview & Savings Rate Donut */}
      <div className="card-premium p-4.5 space-y-4">
        <h3 className="text-sm font-black text-emerald-950">مؤشرات الادخار الشهرية</h3>
        
        <div className="flex items-center gap-4">
          {/* Circular Donut Representation */}
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-accent"
                strokeWidth="3.5"
                strokeDasharray={`${savingsRate}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-base font-black text-primary font-sans">{savingsRate}%</span>
              <span className="text-[8px] text-gray-400 font-extrabold">معدل الادخار</span>
            </div>
          </div>

          <div className="flex-1 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-extrabold">القيمة الادخارية:</span>
              <span className="font-black text-emerald-800 font-sans">{formatCurrency(totalSavings)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-extrabold">معدل الفارق الشهري:</span>
              <span className="font-black text-emerald-800 flex items-center gap-0.5">
                +15% <span className="text-[10px] text-gray-400 font-normal">عن الشهر الماضي</span>
              </span>
            </div>
            <div className="p-2 bg-emerald-50/50 rounded-lg text-[10px] text-emerald-900 border border-emerald-50">
              <strong>أحسنت!</strong> سلوكك المالي في تحسن مستمر، ادخارك يفوق الشهر الماضي بنسبة رائعة.
            </div>
          </div>
        </div>
      </div>

      {/* Learn Promotion Banner */}
      <div 
        onClick={() => onNavigateToTab('learn')}
        className="p-4 bg-gradient-to-l from-emerald-900 to-emerald-800 text-white rounded-[2rem] border-2 border-emerald-950/10 shadow-sm relative overflow-hidden flex gap-3.5 items-center justify-between text-right hover:from-emerald-850 hover:to-emerald-750 transition-all duration-300 cursor-pointer"
      >
        <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-overlay"></div>
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 bg-white/10 text-accent rounded-2xl flex items-center justify-center border border-white/10 shadow-inner flex-shrink-0">
            <Award size={24} className="animate-bounce" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-accent block">ثقافة مالية مستدامة</span>
            <h4 className="text-xs font-black text-white leading-tight">اكسب حتى +150 XP من المقالات التعليمية 📚</h4>
            <p className="text-[10px] text-gray-300 font-medium">اقرأ مقالات حقيقية وموثوقة لتعزيز وعيك المالي</p>
          </div>
        </div>
        <ChevronLeft size={16} className="text-accent relative z-10 flex-shrink-0" />
      </div>

      {/* Goals Preview */}
      <div className="card-premium p-4.5 space-y-3.5">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-emerald-950">أهدافك المالية القادمة</h3>
          <button 
            onClick={() => onNavigateToTab('goals')} 
            className="text-[10px] font-extrabold text-accent hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            عرض الكل <ChevronLeft size={10} />
          </button>
        </div>

        {goals.slice(0, 1).map((goal) => {
          const progressPercent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          return (
            <div key={goal.id} className="p-3 bg-white border border-gray-100 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-black text-gray-800">{goal.title}</span>
                  <span className="block text-[8px] text-gray-400 font-medium">تاريخ الإنجاز المتوقع: {goal.deadline}</span>
                </div>
                <span className="text-xs font-black font-sans text-emerald-800">{progressPercent}%</span>
              </div>
              
              <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100">
                <div className="bg-primary h-full rounded-full" style={{ width: `${progressPercent}%` }}></div>
              </div>
              
              <div className="flex justify-between text-[10px] text-gray-500 font-sans font-extrabold">
                <span>المحقق: {formatCurrency(goal.currentAmount)}</span>
                <span>المستهدف: {formatCurrency(goal.targetAmount)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions List */}
      <div className="card-premium p-4.5 space-y-3.5">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-emerald-950">أحدث المعاملات</h3>
          <button 
            onClick={() => onNavigateToTab('transactions')} 
            className="text-[10px] font-extrabold text-accent hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            عرض الكل <ChevronLeft size={10} />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentTransactions.map((t) => {
            const isIncome = t.type === 'income';
            return (
              <div key={t.id} className="flex justify-between items-center p-2.5 bg-gray-50/60 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                    isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50/60 text-red-600'
                  }`}>
                    {isIncome ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <span className="text-xs font-black text-gray-800 block">{t.category}</span>
                    <span className="text-[9px] text-gray-400 font-sans">{t.date}</span>
                  </div>
                </div>
                <span className={`text-xs font-black font-sans ${isIncome ? 'text-emerald-700' : 'text-red-600'}`}>
                  {isIncome ? '+' : '-'}{t.amount.toLocaleString('ar-SA')} ر.س
                </span>
              </div>
            );
          })}
          {recentTransactions.length === 0 && (
            <p className="text-center text-xs text-gray-400 py-4 font-bold">لم تسجل أي معاملة حتى الآن.</p>
          )}
        </div>
      </div>

      {/* Gamified Challenge Streak Preview */}
      <div className="card-premium p-4.5 space-y-3.5">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-emerald-950">تحديات مالية نشطة</h3>
          <button 
            onClick={() => onNavigateToTab('challenges')} 
            className="text-[10px] font-extrabold text-accent hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            عرض الكل <ChevronLeft size={10} />
          </button>
        </div>

        <div className="space-y-3.5">
          {challenges.filter(c => c.status === 'active').slice(0, 3).map((c) => {
            const pct = Math.min(100, Math.round((c.progress / c.target) * 100));
            return (
              <div 
                key={c.id} 
                className="bg-[#F8F9FA]/40 border border-gray-100 p-4 rounded-3xl relative overflow-hidden flex gap-3.5 items-center text-right hover:bg-white transition-all duration-300"
              >
                {/* Left side: custom icon & deadline text */}
                <div className="flex flex-col items-center gap-1.5 w-16 flex-shrink-0 text-center">
                  {getChallengeIcon(c.category, c.id)}
                  <span className="text-[9px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/30 whitespace-nowrap font-sans">
                    {c.deadline}
                  </span>
                </div>

                {/* Right side: title, description, and percentage progress bar */}
                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs font-black text-emerald-950 leading-tight">{c.title}</h4>
                      <div className="bg-accent/15 border border-accent/10 rounded-full px-1.5 py-0.5 flex items-center gap-0.5 text-emerald-950 font-black text-[8px] flex-shrink-0 font-sans">
                        <Star size={8} className="fill-accent text-accent" />
                        <span>+{c.rewardXp} XP</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-normal font-medium">{c.description}</p>
                  </div>

                  {/* Percentage + Progress line */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[10px] font-black text-emerald-950 font-sans min-w-[28px]">
                      %{pct}
                    </span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-50">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {challenges.filter(c => c.status === 'active').length === 0 && (
            <p className="text-center text-xs text-gray-400 py-4 font-bold">لم تسجل أي تحديات نشطة حتى الآن.</p>
          )}
        </div>
      </div>
    </div>
  );
}
