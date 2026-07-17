/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, HelpCircle, Check, Trash2, Edit3, AlertTriangle, Info, Sparkles, PiggyBank, Percent, Zap, Award } from "lucide-react";
import { Budget } from "../types";

interface BudgetPageProps {
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, "id">) => void;
  onEditBudget: (id: string, updated: Partial<Budget>) => void;
  onDeleteBudget: (id: string) => void;
  onBulkAddBudgets?: (newBudgets: Omit<Budget, "id">[]) => void;
  totalIncome: number;
}

const CATEGORY_PRESETS = [
  "مطاعم ومقاهي", "تسوق ومشتريات", "فواتير كهرباء وإنترنت", 
  "نقل ومواصلات", "ترفيه وألعاب", "سفر", "صحة وعافية", "أخرى"
];

export default function BudgetPage({ 
  budgets, 
  onAddBudget, 
  onEditBudget, 
  onDeleteBudget,
  onBulkAddBudgets,
  totalIncome 
}: BudgetPageProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState(CATEGORY_PRESETS[0]);
  const [limit, setLimit] = useState("");
  const [warningThreshold, setWarningThreshold] = useState("80");

  // Auto Budget states
  const [isAutoBudgetOpen, setIsAutoBudgetOpen] = useState(false);
  const [customIncome, setCustomIncome] = useState("10000");
  const [selectedRule, setSelectedRule] = useState<"503020" | "602020" | "702010">("503020");
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const getRuleDetails = (rule: "503020" | "602020" | "702010", incomeVal: number) => {
    let needsPct = 50;
    let wantsPct = 30;
    let savingsPct = 20;

    if (rule === "602020") {
      needsPct = 60;
      wantsPct = 20;
      savingsPct = 20;
    } else if (rule === "702010") {
      needsPct = 70;
      wantsPct = 20;
      savingsPct = 10;
    }

    const totalNeeds = (incomeVal * needsPct) / 100;
    const totalWants = (incomeVal * wantsPct) / 100;
    const totalSavings = (incomeVal * savingsPct) / 100;

    return {
      needsPct,
      wantsPct,
      savingsPct,
      totalNeeds,
      totalWants,
      totalSavings,
      categories: [
        // Needs (totalNeeds)
        { category: "تسوق ومشتريات", amount: totalNeeds * 0.50, type: "needs", percentOfSection: 50 },
        { category: "فواتير كهرباء وإنترنت", amount: totalNeeds * 0.30, type: "needs", percentOfSection: 30 },
        { category: "نقل ومواصلات", amount: totalNeeds * 0.20, type: "needs", percentOfSection: 20 },
        // Wants (totalWants)
        { category: "مطاعم ومقاهي", amount: totalWants * 0.50, type: "wants", percentOfSection: 50 },
        { category: "ترفيه وألعاب", amount: totalWants * 0.33, type: "wants", percentOfSection: 33 },
        { category: "سفر", amount: totalWants * 0.17, type: "wants", percentOfSection: 17 },
        // Savings (totalSavings)
        { category: "صحة وعافية", amount: totalSavings * 0.50, type: "savings", percentOfSection: 50 },
        { category: "أخرى", amount: totalSavings * 0.50, type: "savings", percentOfSection: 50 },
      ]
    };
  };

  const handleApplyAutoBudget = (details: any) => {
    if (!onBulkAddBudgets) return;

    const budgetPayloads = details.categories.map((cat: any) => ({
      category: cat.category,
      limit: Math.round(cat.amount),
      warningThreshold: 80
    }));

    onBulkAddBudgets(budgetPayloads);
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setIsAutoBudgetOpen(false);
    }, 2000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setCategory(CATEGORY_PRESETS[0]);
    setLimit("");
    setWarningThreshold("80");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (b: Budget) => {
    setEditingId(b.id);
    setCategory(b.category);
    setLimit(b.limit.toString());
    setWarningThreshold(b.warningThreshold.toString());
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limit || parseFloat(limit) <= 0) return;

    const payload = {
      category,
      limit: parseFloat(limit),
      spent: editingId ? (budgets.find(b => b.id === editingId)?.spent || 0) : 0,
      warningThreshold: parseInt(warningThreshold)
    };

    if (editingId) {
      onEditBudget(editingId, payload);
    } else {
      onAddBudget(payload);
    }
    setIsFormOpen(false);
  };

  // Aggregate stats
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudgetLimit > totalBudgetSpent ? (totalBudgetLimit - totalBudgetSpent) : 0;
  
  // Format numbers
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ar-SA') + ' ريال';
  };

  return (
    <div className="space-y-5 pb-24 text-right rtl">
      {/* Header and Add Button */}
      <div className="flex justify-between items-center bg-white/70 p-4 rounded-2xl border border-emerald-950/5 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-emerald-950">الميزانيات الشهرية</h2>
          <p className="text-[11px] text-gray-500">حدد أسقفاً لإنفاقك لتتفادى السحب الزائد وتدخر بذكاء</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAutoBudgetOpen(true)}
            className="p-2.5 bg-emerald-50 border border-emerald-900/10 text-emerald-800 rounded-xl hover:bg-emerald-100/80 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <Sparkles size={14} className="text-emerald-600 animate-pulse" />
            <span>تخطيط تلقائي ذكي 🪄</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenAdd}
            className="p-2.5 bg-primary text-white rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <Plus size={14} />
            <span>تحديد يدوي</span>
          </motion.button>
        </div>
      </div>

      {/* Aggregate Overview Card */}
      <div className="card-premium p-4.5 space-y-4">
        <h3 className="text-xs font-bold text-gray-400">ملخص الميزانيات النشطة</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-center">
            <span className="text-[9px] text-gray-400 font-bold block">إجمالي المحدد</span>
            <span className="text-xs font-bold font-sans text-primary-light mt-0.5 block">{formatCurrency(totalBudgetLimit)}</span>
          </div>
          <div className="p-2.5 bg-red-50/50 border border-red-50/20 rounded-xl text-center">
            <span className="text-[9px] text-gray-400 font-bold block">المصروف الفعلي</span>
            <span className="text-xs font-bold font-sans text-red-700 mt-0.5 block">{formatCurrency(totalBudgetSpent)}</span>
          </div>
          <div className="p-2.5 bg-emerald-50/50 border border-emerald-50/20 rounded-xl text-center">
            <span className="text-[9px] text-gray-400 font-bold block">المتبقي للصرف</span>
            <span className="text-xs font-bold font-sans text-emerald-800 mt-0.5 block">{formatCurrency(totalRemaining)}</span>
          </div>
        </div>

        {/* Global Progress */}
        {totalBudgetLimit > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <div className="flex justify-between text-[10px] text-gray-500 font-sans font-medium">
              <span>نسبة الصرف من الميزانيات: {Math.round((totalBudgetSpent / totalBudgetLimit) * 100)}%</span>
              <span>المتاح: {formatCurrency(totalRemaining)}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  (totalBudgetSpent / totalBudgetLimit) >= 0.9 ? 'bg-red-600' : 'bg-primary'
                }`}
                style={{ width: `${Math.min(100, (totalBudgetSpent / totalBudgetLimit) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Warning/Alert message if some budgets are close to limit */}
      {budgets.some(b => (b.spent / b.limit) * 100 >= b.warningThreshold) && (
        <div className="bg-amber-50 border border-amber-200/50 p-3 rounded-2xl flex items-start gap-3 animate-pulse">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-right">
            <span className="text-xs font-bold text-amber-950 block">انتبه! قاربت على تجاوز حد الميزانية</span>
            <p className="text-[10px] text-amber-800 leading-normal mt-0.5">
              هناك ميزانيات مخصصة تجاوزت نسبة {budgets[0]?.warningThreshold}% من سقف الصرف المرسوم لها. يرجى ضبط نفقاتك أو رفع الحد.
            </p>
          </div>
        </div>
      )}

      {/* Individual Budgets Cards List */}
      <div className="space-y-3">
        {budgets.map((b) => {
          const spendPercent = Math.min(100, Math.round((b.spent / b.limit) * 100));
          const remainingAmount = b.limit > b.spent ? (b.limit - b.spent) : 0;
          const hasExceeded = b.spent > b.limit;
          const isApproaching = spendPercent >= b.warningThreshold && !hasExceeded;

          let colorClass = "bg-primary";
          let bgClass = "bg-emerald-50/10";
          let textClass = "text-emerald-800";
          let alertLabel = "";

          if (hasExceeded) {
            colorClass = "bg-red-600";
            bgClass = "bg-red-50/20";
            textClass = "text-red-700";
            alertLabel = "تجاوزت الحد! 🚨";
          } else if (isApproaching) {
            colorClass = "bg-amber-500";
            bgClass = "bg-amber-50/20";
            textClass = "text-amber-800";
            alertLabel = "اقتربت من الحد! ⚠️";
          }

          return (
            <div 
              key={b.id} 
              className={`bg-white border border-emerald-950/5 p-4 rounded-2xl space-y-3.5 shadow-sm transition-all hover:border-emerald-950/10`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-gray-800">{b.category}</h4>
                    {alertLabel && (
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${bgClass} ${textClass}`}>
                        {alertLabel}
                      </span>
                    )}
                  </div>
                  <span className="block text-[10px] text-gray-400 mt-1 font-sans">
                    سقف الميزانية: {formatCurrency(b.limit)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-all cursor-pointer"
                    title="تعديل الميزانية"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    onClick={() => onDeleteBudget(b.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    title="حذف الميزانية"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-sans font-medium">
                  <span>تم صرف: {spendPercent}%</span>
                  <span>المتبقي: {formatCurrency(remainingAmount)}</span>
                </div>
                
                <div className="w-full bg-gray-50 h-2.5 rounded-full overflow-hidden border border-gray-100 p-[1px]">
                  <div 
                    className={`${colorClass} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${spendPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Footer info box */}
              <div className="flex justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-50 font-sans">
                <span>المنفق فعلياً: {formatCurrency(b.spent)}</span>
                <span>تنبيه الاقتراب عند: {b.warningThreshold}%</span>
              </div>
            </div>
          );
        })}

        {budgets.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-2">
            <HelpCircle size={32} className="mx-auto text-gray-300" />
            <p className="text-xs text-gray-400 font-semibold">لم تقم بإعداد أي ميزانية تتبعية حتى الآن.</p>
          </div>
        )}
      </div>

      {/* Slide-Up Bottom Drawer Modal for Add/Edit Form */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black z-40"
            ></motion.div>

            {/* Form Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl shadow-xl z-50 overflow-hidden text-right border-t border-emerald-950/10"
            >
              {/* Top Handle bar */}
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto my-3"></div>
              
              <div className="px-5 pb-8 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-emerald-950">
                    {editingId ? "تعديل الميزانية المحددة" : "تحديد ميزانية لفئة جديدة"}
                  </h3>
                  <button 
                    onClick={() => setIsFormOpen(false)} 
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category Selection */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">اختر الفئة المستهدفة</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {CATEGORY_PRESETS.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Limit Amount */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">الحد الأقصى للصرف الشهري (ريال)</label>
                    <input
                      type="number"
                      required
                      placeholder="مثال: 1500"
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold font-sans text-emerald-950 focus:outline-none focus:border-primary text-center"
                    />
                  </div>

                  {/* Warning Threshold Slider */}
                  <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-emerald-950">نسبة التنبيه قبل التجاوز</span>
                      <span className="font-bold font-sans text-primary-light">{warningThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      step="5"
                      value={warningThreshold}
                      onChange={(e) => setWarningThreshold(e.target.value)}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <p className="text-[9px] text-gray-400 leading-normal">
                      سوف تظهر لك شارة تحذير صفراء على الميزانية فور الصرف الفعلي ما يفوق هذه النسبة لتنبيهك.
                    </p>
                  </div>

                  {/* Confirm and Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light transition-all text-sm cursor-pointer mt-3 flex items-center justify-center gap-1.5"
                  >
                    <Check size={16} />
                    <span>حفظ وتفعيل الميزانية</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}

        {isAutoBudgetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!appliedSuccess) setIsAutoBudgetOpen(false);
              }}
              className="fixed inset-0 bg-black z-40"
            ></motion.div>

            {/* Smart Auto Budget Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl shadow-xl z-50 overflow-hidden text-right border-t border-emerald-950/10 flex flex-col max-h-[85vh]"
            >
              {/* Top Handle bar */}
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto my-3 flex-shrink-0"></div>
              
              <div className="px-5 pb-6 overflow-y-auto space-y-4 flex-1">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 sticky top-0 bg-white z-10">
                  <div className="flex items-center gap-1.5 text-emerald-950">
                    <Sparkles size={16} className="text-emerald-600 animate-pulse" />
                    <h3 className="text-sm font-black">المخطط التلقائي الذكي للميزانيات</h3>
                  </div>
                  <button 
                    disabled={appliedSuccess}
                    onClick={() => setIsAutoBudgetOpen(false)} 
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer disabled:opacity-30"
                  >
                    <X size={18} />
                  </button>
                </div>

                {appliedSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
                      <Check size={36} className="text-emerald-600 animate-bounce" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-emerald-950">تم تفعيل ميزانيتك الذكية! 🎉</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        تم توزيع نفقاتك بنجاح وإنشاء سقوف الميزانيات التلقائية المعتمدة على دخلك.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {/* Fixed Income input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-500 block">أدخل دخلك الشهري الثابت (ريال)</label>
                      <input
                        type="number"
                        required
                        value={customIncome}
                        onChange={(e) => setCustomIncome(e.target.value)}
                        placeholder="مثال: 10000"
                        className="w-full pl-4 pr-4 py-3 bg-emerald-50/20 border border-emerald-900/10 rounded-xl text-lg font-black font-sans text-emerald-950 focus:outline-none focus:border-emerald-600 text-center"
                      />
                      <p className="text-[9.5px] text-gray-400">
                        سنعتمد هذا المبلغ كأساس لتقسيم النفقات وتطبيق القواعد المالية عليه.
                      </p>
                    </div>

                    {/* Rule Selection Segment */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-500 block">اختر قاعدة التقسيم المالي</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRule("503020")}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedRule === "503020"
                              ? "bg-emerald-800 border-emerald-900 text-white font-bold"
                              : "bg-gray-50 border-gray-100 text-gray-600 text-xs hover:bg-gray-100/50"
                          }`}
                        >
                          <span className="block text-[11px] font-sans">50 / 30 / 20</span>
                          <span className="block text-[8.5px] mt-0.5 opacity-90">النموذجية</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedRule("602020")}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedRule === "602020"
                              ? "bg-emerald-800 border-emerald-900 text-white font-bold"
                              : "bg-gray-50 border-gray-100 text-gray-600 text-xs hover:bg-gray-100/50"
                          }`}
                        >
                          <span className="block text-[11px] font-sans">60 / 20 / 20</span>
                          <span className="block text-[8.5px] mt-0.5 opacity-90">المتوازنة</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedRule("702010")}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedRule === "702010"
                              ? "bg-emerald-800 border-emerald-900 text-white font-bold"
                              : "bg-gray-50 border-gray-100 text-gray-600 text-xs hover:bg-gray-100/50"
                          }`}
                        >
                          <span className="block text-[11px] font-sans">70 / 20 / 10</span>
                          <span className="block text-[8.5px] mt-0.5 opacity-90">المحافظة</span>
                        </button>
                      </div>
                    </div>

                    {/* Gauge Visualizer */}
                    {(() => {
                      const incomeVal = parseFloat(customIncome) || 0;
                      const details = getRuleDetails(selectedRule, incomeVal);
                      
                      return (
                        <div className="space-y-3.5">
                          {/* Continuous progress bar */}
                          <div className="space-y-1">
                            <div className="flex h-4 w-full rounded-full overflow-hidden border border-gray-200/50 p-[1px] bg-gray-50 shadow-inner">
                              <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${details.needsPct}%` }} />
                              <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${details.wantsPct}%` }} />
                              <div className="bg-sky-500 h-full transition-all duration-300" style={{ width: `${details.savingsPct}%` }} />
                            </div>
                            
                            {/* Legend */}
                            <div className="flex justify-center gap-4 text-[9.5px] font-bold text-gray-500">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span>
                                <span>الاحتياجات ({details.needsPct}%)</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                                <span>الرغبات ({details.wantsPct}%)</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-sky-500 rounded-full"></span>
                                <span>الادخار ({details.savingsPct}%)</span>
                              </div>
                            </div>
                          </div>

                          {/* Breakdown cards container */}
                          <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
                            {/* Needs Category breakdown */}
                            <div className="p-3 bg-emerald-50/30 border border-emerald-600/10 rounded-2xl space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-black text-emerald-900 flex items-center gap-1">
                                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                                  الاحتياجات والأساسيات ({details.needsPct}%)
                                </span>
                                <span className="font-bold text-emerald-900 font-sans">{formatCurrency(details.totalNeeds)}</span>
                              </div>
                              
                              <div className="space-y-1.5 text-[10.5px] text-gray-600 font-medium pt-1.5 border-t border-emerald-100/50">
                                {details.categories.filter(c => c.type === "needs").map(cat => (
                                  <div key={cat.category} className="flex justify-between">
                                    <span>{cat.category}</span>
                                    <span className="font-sans text-gray-500">{formatCurrency(cat.amount)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Wants Category breakdown */}
                            <div className="p-3 bg-amber-50/20 border border-amber-500/10 rounded-2xl space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-black text-amber-900 flex items-center gap-1">
                                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                  الرغبات والترفيه ({details.wantsPct}%)
                                </span>
                                <span className="font-bold text-amber-900 font-sans">{formatCurrency(details.totalWants)}</span>
                              </div>
                              
                              <div className="space-y-1.5 text-[10.5px] text-gray-600 font-medium pt-1.5 border-t border-amber-100/50">
                                {details.categories.filter(c => c.type === "wants").map(cat => (
                                  <div key={cat.category} className="flex justify-between">
                                    <span>{cat.category}</span>
                                    <span className="font-sans text-gray-500">{formatCurrency(cat.amount)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Savings Category breakdown */}
                            <div className="p-3 bg-sky-50/20 border border-sky-500/10 rounded-2xl space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-black text-sky-900 flex items-center gap-1">
                                  <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                                  الادخار والاستثمار ({details.savingsPct}%)
                                </span>
                                <span className="font-bold text-sky-900 font-sans">{formatCurrency(details.totalSavings)}</span>
                              </div>
                              
                              <div className="space-y-1.5 text-[10.5px] text-gray-600 font-medium pt-1.5 border-t border-sky-100/50">
                                {details.categories.filter(c => c.type === "savings").map(cat => (
                                  <div key={cat.category} className="flex justify-between">
                                    <span>{cat.category === "أخرى" ? "احتياطيات وادخار عام" : cat.category}</span>
                                    <span className="font-sans text-gray-500">{formatCurrency(cat.amount)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Warning / Notes before overwrite */}
                          <div className="bg-amber-50 border border-amber-200/50 p-2.5 rounded-xl text-[9.5px] text-amber-800 leading-relaxed flex items-start gap-1.5">
                            <Info size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong>ملاحظة:</strong> سيقوم النظام تلقائياً بتجاوز قيم الميزانيات السابقة لهذه الفئات المسجلة واعتماد السقوف الجديدة بناءً على التقسيم الذكي الموضح أعلاه.
                            </span>
                          </div>

                          {/* Apply Button */}
                          <button
                            type="button"
                            onClick={() => handleApplyAutoBudget(details)}
                            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-lg shadow-emerald-800/10 flex items-center justify-center gap-1.5 text-xs cursor-pointer transition-all active:scale-98"
                          >
                            <Zap size={14} className="text-amber-300 animate-pulse" />
                            <span>تطبيق وتفعيل المخطط التلقائي ⚡</span>
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
