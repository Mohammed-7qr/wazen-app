/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend 
} from "recharts";
import { 
  TrendingUp, TrendingDown, PiggyBank, Sparkles, Filter, 
  ChevronLeft, AlertTriangle, Lightbulb, Zap, Send, Loader2, ArrowDownLeft, ArrowUpRight
} from "lucide-react";
import { Transaction, Wallet, Budget, Goal } from "../types";

interface ReportsPageProps {
  transactions: Transaction[];
  wallets: Wallet[];
  budgets: Budget[];
  goals: Goal[];
  userProfile: { name: string; email: string };
  isAdvisorOpenInitially?: boolean;
}

interface AdvisorAdvice {
  healthScore: number;
  analysis: string;
  tips: string[];
  risks: string[];
  recommendations: string;
}

export default function ReportsPage({ 
  transactions, 
  wallets, 
  budgets, 
  goals,
  userProfile,
  isAdvisorOpenInitially = false
}: ReportsPageProps) {
  const [range, setRange] = useState<'month' | '3months' | '6months' | 'year'>('month');
  
  // AI Advisor States
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);
  const [advice, setAdvice] = useState<AdvisorAdvice | null>(null);
  const [advisorQuery, setAdvisorQuery] = useState("");
  const [advisorChat, setAdvisorChat] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: "مرحباً بك! أنا مستشارك المالي الذكي من وازن. يمكنني تحليل مصاريفك وتقديم نصائح ادخار فوريّة مخصصة لك بالكامل. اضغط على الزر بالأسفل للتحليل الذكي الشامل!" }
  ]);

  // Arabic month names mapping
  const ARABIC_MONTHS = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  // Filter transactions based on the selected range
  const getFilteredTransactions = () => {
    const baseDate = new Date("2026-07-16");
    const cutoff = new Date(baseDate);
    
    if (range === 'month') {
      cutoff.setDate(1);
    } else if (range === '3months') {
      cutoff.setMonth(baseDate.getMonth() - 2);
      cutoff.setDate(1);
    } else if (range === '6months') {
      cutoff.setMonth(baseDate.getMonth() - 5);
      cutoff.setDate(1);
    } else if (range === 'year') {
      cutoff.setFullYear(baseDate.getFullYear() - 1);
      cutoff.setDate(1);
    }
    
    return transactions.filter(t => {
      if (!t.date) return false;
      const tDate = new Date(t.date);
      return tDate >= cutoff && tDate <= baseDate;
    });
  };

  const rangeTransactions = getFilteredTransactions();

  // Aggregate stats based on current filter range
  const totalIncome = rangeTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = rangeTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const savings = totalIncome > totalExpense ? (totalIncome - totalExpense) : 0;
  const savingsRatio = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  // Formatting utility
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ar-SA') + ' ريال';
  };

  // Recharts Data preparation
  // 1. Category Distribution Pie Chart
  const expenseByCategory = rangeTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

  const pieData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  }));

  const COLORS = ['#064e3b', '#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#99f6e4', '#f0fdfa', '#a7f3d0'];

  // 2. Dynamic Monthly Comparison representing the trend
  const getComparisonData = () => {
    const today = new Date("2026-07-16");
    let monthsCount = 4; // Default for 'month' to show trend
    if (range === '3months') monthsCount = 3;
    if (range === '6months') monthsCount = 6;
    if (range === 'year') monthsCount = 12;

    const list: { name: string; yearMonth: string; دخل: number; صرف: number; ادخار: number }[] = [];
    
    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(today.getMonth() - i);
      const year = d.getFullYear();
      const monthIdx = d.getMonth();
      const yearMonth = `${year}-${String(monthIdx + 1).padStart(2, '0')}`;
      const name = `${ARABIC_MONTHS[monthIdx]} ${year}`;
      list.push({ name, yearMonth, دخل: 0, صرف: 0, ادخار: 0 });
    }

    transactions.forEach(t => {
      if (!t.date) return;
      const tDate = new Date(t.date);
      const year = tDate.getFullYear();
      const monthIdx = tDate.getMonth();
      const yearMonth = `${year}-${String(monthIdx + 1).padStart(2, '0')}`;
      
      const found = list.find(item => item.yearMonth === yearMonth);
      if (found) {
        if (t.type === 'income') {
          found.دخل += t.amount;
        } else if (t.type === 'expense') {
          found.صرف += t.amount;
        }
      }
    });

    list.forEach(item => {
      item.ادخار = item.دخل > item.صرف ? (item.دخل - item.صرف) : 0;
    });

    return list;
  };

  const comparisonData = getComparisonData();

  // Request AI advice from our fullstack server
  const fetchAdvice = async () => {
    setIsAdvisorLoading(true);
    setAdvisorChat(prev => [...prev, { sender: 'user', text: "قم بتحليل وضعي المالي الحالي وإعطائي التوصيات المناسبة." }]);
    
    try {
      const res = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactions,
          budgets,
          goals,
          wallets,
          userName: userProfile.name
        })
      });

      if (!res.ok) throw new Error("API call returned non-200");
      const data = await res.json() as AdvisorAdvice;
      setAdvice(data);
      
      const responseMsg = `تقييمك المالي الحالي هو ${data.healthScore}/100.
      
${data.analysis}

🎯 أهم المخاطر التي تم اكتشافها:
${data.risks.map(r => `• ${r}`).join('\n')}

💡 نصائح مخصصة لك:
${data.tips.map(t => `• ${t}`).join('\n')}

✨ التوصية الذهبية:
${data.recommendations}`;

      setAdvisorChat(prev => [...prev, { sender: 'bot', text: responseMsg }]);
    } catch (err) {
      console.error(err);
      setAdvisorChat(prev => [...prev, { sender: 'bot', text: "عذراً، حدث خطأ أثناء الاتصال بمستشار وازن الذكي. الرجاء المحاولة مجدداً." }]);
    } finally {
      setIsAdvisorLoading(false);
    }
  };

  const handleCustomQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisorQuery.trim()) return;

    const userText = advisorQuery;
    setAdvisorQuery("");
    setAdvisorChat(prev => [...prev, { sender: 'user', text: userText }]);
    setIsAdvisorLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          transactions,
          budgets,
          goals,
          wallets,
          userName: userProfile.name
        })
      });

      if (!res.ok) throw new Error("API call returned non-200");
      const data = await res.json() as { response: string };
      setAdvisorChat(prev => [...prev, { sender: 'bot', text: data.response }]);
    } catch (err) {
      console.error(err);
      setAdvisorChat(prev => [...prev, { sender: 'bot', text: "أواجه صعوبة مؤقتة في التحليل. ولكن تذكر أن ضبط المصاريف الصغيرة هو سر النجاح المالي!" }]);
    } finally {
      setIsAdvisorLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 text-right rtl">
      {/* Tab Header filters */}
      <div className="flex justify-between items-center bg-white/70 p-4 rounded-2xl border border-emerald-950/5 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-emerald-950 font-sans">التقارير المالية والتحليل</h2>
          <p className="text-[11px] text-gray-500">مراجعة أداء إنفاقك وادخارك والتحليل البياني المتقدم</p>
        </div>
      </div>

      {/* Range filter tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-xl max-w-md mx-auto">
        <button
          onClick={() => setRange('month')}
          className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
            range === 'month' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'
          }`}
        >
          شهر
        </button>
        <button
          onClick={() => setRange('3months')}
          className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
            range === '3months' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'
          }`}
        >
          ٣ أشهر
        </button>
        <button
          onClick={() => setRange('6months')}
          className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
            range === '6months' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'
          }`}
        >
          ٦ أشهر
        </button>
        <button
          onClick={() => setRange('year')}
          className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
            range === 'year' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'
          }`}
        >
          سنة
        </button>
      </div>

      {/* Aggregate Stats Boxes */}
      <div className="grid grid-cols-3 gap-3.5">
        <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-950/5 text-center shadow-sm">
          <span className="text-[9px] text-gray-400 font-bold block">الادخار</span>
          <span className="text-xs font-bold font-sans text-emerald-800 block mt-1">{formatCurrency(savings)}</span>
          <span className="text-[8px] text-emerald-600 font-semibold block mt-1">+15% 📈</span>
        </div>

        <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-950/5 text-center shadow-sm">
          <span className="text-[9px] text-gray-400 font-bold block">المصروفات</span>
          <span className="text-xs font-bold font-sans text-red-600 block mt-1">{formatCurrency(totalExpense)}</span>
          <span className="text-[8px] text-emerald-600 font-semibold block mt-1">-8% 📉</span>
        </div>

        <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-950/5 text-center shadow-sm">
          <span className="text-[9px] text-gray-400 font-bold block">الدخل</span>
          <span className="text-xs font-bold font-sans text-primary block mt-1">{formatCurrency(totalIncome)}</span>
          <span className="text-[8px] text-gray-400 block mt-1">مستقر</span>
        </div>
      </div>

      {/* Net savings speedmeter */}
      <div className="card-premium p-4.5 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-gray-800">نسبة الادخار من الدخل</h3>
          <span className="text-xs font-extrabold text-primary font-sans">{savingsRatio}%</span>
        </div>

        <div className="flex gap-4 items-center">
          {/* Progress gauge */}
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary"
                strokeWidth="4"
                strokeDasharray={`${savingsRatio}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center flex flex-col items-center">
              <span className="text-base font-extrabold text-primary font-sans">{savingsRatio}%</span>
              <span className="text-[8px] text-gray-400">ادخار شهري</span>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">ممتاز:</span>
              <span className="font-bold text-primary font-sans">+50%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">جيد جداً:</span>
              <span className="font-bold text-emerald-700 font-sans">35% - 50%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">جيد:</span>
              <span className="font-bold text-teal-600 font-sans">20% - 35%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">ضعيف:</span>
              <span className="font-bold text-red-600 font-sans">أقل من 10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Recharts Block */}
      <div className="card-premium p-4.5 space-y-4">
        <h3 className="text-xs font-bold text-gray-800">تحليل مقارنة الدخل والمصروفات</h3>
        <div className="w-full h-56 font-sans text-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} ريال`, '']} />
              <Legend />
              <Bar dataKey="دخل" fill="#064e3b" radius={[4, 4, 0, 0]} name="إجمالي الدخل" />
              <Bar dataKey="صرف" fill="#dc2626" radius={[4, 4, 0, 0]} name="إجمالي الصرف" />
              <Bar dataKey="ادخار" fill="#10b981" radius={[4, 4, 0, 0]} name="صافي الادخار" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spending distribution category pie chart */}
      {pieData.length > 0 && (
        <div className="card-premium p-4.5 space-y-4">
          <h3 className="text-xs font-bold text-gray-800">توزيع المصروفات حسب الفئات</h3>
          <div className="w-full h-48 font-sans text-[10px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} ريال`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Table for Pie */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-gray-500 font-medium truncate">{item.name}:</span>
                <span className="font-bold text-primary font-sans">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Wazen AI Advisor Chatbox */}
      <div className="card-premium p-4.5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent" size={18} />
            <h3 className="text-xs font-bold text-emerald-950">مستشار وازن المالي الذكي (AI)</h3>
          </div>
          <span className="text-[9px] bg-accent/20 text-emerald-900 px-2 py-0.5 rounded-full font-bold">نشط بالكامل</span>
        </div>

        {/* Advisor Dialog Box */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-3 space-y-3.5 h-64 overflow-y-auto">
          {advisorChat.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col max-w-[85%] ${
                msg.sender === 'user' ? 'mr-auto items-end' : 'ml-auto items-start'
              }`}
            >
              <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-primary text-white rounded-br-none text-right' 
                  : 'bg-white text-gray-800 rounded-bl-none shadow-sm text-right border border-gray-100 whitespace-pre-line'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isAdvisorLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold p-2">
              <Loader2 size={14} className="animate-spin text-primary" />
              <span>جاري التحليل واستدعاء التوصيات المالية...</span>
            </div>
          )}
        </div>

        {/* Quick Action Button for Full Scan */}
        <button
          onClick={fetchAdvice}
          disabled={isAdvisorLoading}
          className="w-full py-2.5 bg-emerald-950 hover:bg-primary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-sm"
        >
          <Sparkles size={14} className="text-accent" />
          <span>تشغيل التحليل الذكي الشامل لوضعي الحالي</span>
        </button>

        {/* Custom Query Form */}
        <form onSubmit={handleCustomQuery} className="flex gap-2">
          <input
            type="text"
            required
            value={advisorQuery}
            onChange={(e) => setAdvisorQuery(e.target.value)}
            placeholder="اسأل وازن: كيف يمكنني توفير المزيد من الراتب؟"
            className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary text-right"
          />
          <button
            type="submit"
            disabled={isAdvisorLoading}
            className="p-2.5 bg-primary hover:bg-primary-light text-white rounded-xl flex items-center justify-center cursor-pointer disabled:opacity-50 transition-all"
          >
            <Send size={14} className="rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
}
