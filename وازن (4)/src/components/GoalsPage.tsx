/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Check, Trash2, Edit3, Target, Calendar, HelpCircle, CheckSquare, Square } from "lucide-react";
import { Goal, Milestone } from "../types";

interface GoalsPageProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, "id">) => void;
  onEditGoal: (id: string, updated: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
}

const CATEGORY_LABELS = {
  savings: "حصالة ادخار",
  debt: "سداد ديون",
  emergency: "صندوق طوارئ",
  investment: "محفظة استثمارية"
};

export default function GoalsPage({ goals, onAddGoal, onEditGoal, onDeleteGoal }: GoalsPageProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'savings' | 'debt' | 'emergency' | 'investment'>('savings');
  const [milestonesText, setMilestonesText] = useState(""); // Comma separated list of milestones

  // Quick Deposit simulation
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [activeGoalIdForDeposit, setActiveGoalIdForDeposit] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setTargetAmount("");
    setCurrentAmount("0");
    setDeadline(new Date().toISOString().split('T')[0]);
    setCategory("savings");
    setMilestonesText("فتح حساب إضافي، الإيداع الأول، تفعيل الاستقطاع التلقائي");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (g: Goal) => {
    setEditingId(g.id);
    setTitle(g.title);
    setTargetAmount(g.targetAmount.toString());
    setCurrentAmount(g.currentAmount.toString());
    setDeadline(g.deadline);
    setCategory(g.category);
    setMilestonesText(g.milestones.map(m => m.title).join('، '));
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    const rawMilestones = milestonesText
      .split(/[،,]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const initialMilestones: Milestone[] = editingId 
      ? (goals.find(g => g.id === editingId)?.milestones || [])
      : rawMilestones.map((t, index) => ({
          id: `m-${Date.now()}-${index}`,
          title: t,
          completed: false
        }));

    // If edit, sync milestones that might have been changed in text form
    if (editingId && rawMilestones.length > 0) {
      // Sync names of milestones
      const existing = goals.find(g => g.id === editingId)?.milestones || [];
      const updatedMilestones: Milestone[] = rawMilestones.map((t, index) => {
        const match = existing.find(ex => ex.title === t);
        return {
          id: match?.id || `m-${Date.now()}-${index}`,
          title: t,
          completed: match?.completed || false
        };
      });
      initialMilestones.splice(0, initialMilestones.length, ...updatedMilestones);
    }

    const payload = {
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount || "0"),
      deadline,
      category,
      milestones: initialMilestones
    };

    if (editingId) {
      onEditGoal(editingId, payload);
    } else {
      onAddGoal(payload);
    }
    setIsFormOpen(false);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    // If milestone toggled, optionally award a small +10 xp as a reward
    onEditGoal(goalId, { milestones: updatedMilestones });
  };

  const handleDepositClick = (goalId: string) => {
    setActiveGoalIdForDeposit(goalId);
    setDepositAmount("");
    setIsDepositOpen(true);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGoalIdForDeposit || !depositAmount) return;

    const goal = goals.find(g => g.id === activeGoalIdForDeposit);
    if (!goal) return;

    const newAmt = goal.currentAmount + parseFloat(depositAmount);
    onEditGoal(activeGoalIdForDeposit, { currentAmount: Math.min(goal.targetAmount, newAmt) });
    setIsDepositOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ar-SA') + ' ريال';
  };

  return (
    <div className="space-y-5 pb-24 text-right rtl">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/70 p-4 rounded-2xl border border-emerald-950/5 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-emerald-950">الأهداف والادخارات</h2>
          <p className="text-[11px] text-gray-500">خطط لأحلامك المستقبلية، ادخر لها، وتابع إنجازك خطوة بخطوة</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAdd}
          className="p-3 bg-primary text-white rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
        >
          <Plus size={16} />
          <span>إنشاء هدف</span>
        </motion.button>
      </div>

      {/* List of Goals */}
      <div className="space-y-4">
        {goals.map((g) => {
          const progressPercent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
          const isCompleted = g.currentAmount >= g.targetAmount;
          
          return (
            <div 
              key={g.id} 
              className="bg-white border border-emerald-950/5 p-4 rounded-2xl space-y-3.5 shadow-sm hover:border-emerald-950/10 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-primary flex items-center justify-center">
                    <Target size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">{g.title}</h4>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {CATEGORY_LABELS[g.category]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(g)}
                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg cursor-pointer"
                    title="تعديل الهدف"
                  >
                    <Edit3 size={11} />
                  </button>
                  <button
                    onClick={() => onDeleteGoal(g.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    title="حذف الهدف"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-sans font-medium">
                  <span>تم تجميع: {progressPercent}%</span>
                  <span>المستهدف: {formatCurrency(g.targetAmount)}</span>
                </div>
                
                <div className="w-full bg-gray-50 h-2.5 rounded-full overflow-hidden border border-gray-100 p-[1px]">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-accent' : 'bg-primary'}`}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[10px] text-gray-400 font-sans pt-1">
                  <span>الحالي: {formatCurrency(g.currentAmount)}</span>
                  <span>الموعد المحدد: {g.deadline}</span>
                </div>
              </div>

              {/* Milestones checklist block */}
              {g.milestones && g.milestones.length > 0 && (
                <div className="pt-3 border-t border-gray-50 space-y-2">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">محطات الإنجاز والمهام:</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {g.milestones.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => toggleMilestone(g.id, m.id)}
                        className="flex items-center gap-2 text-[10px] text-gray-600 hover:text-gray-800 transition-colors text-right cursor-pointer"
                      >
                        {m.completed ? (
                          <CheckSquare size={13} className="text-primary flex-shrink-0" />
                        ) : (
                          <Square size={13} className="text-gray-300 flex-shrink-0" />
                        )}
                        <span className={m.completed ? "line-through text-gray-400" : ""}>{m.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick deposit simulator button */}
              {!isCompleted && (
                <div className="pt-1.5 flex justify-end">
                  <button
                    onClick={() => handleDepositClick(g.id)}
                    className="px-3 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-light transition-colors cursor-pointer shadow-sm"
                  >
                    إيداع مبلغ في الحصالة 💰
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-2">
            <HelpCircle size={32} className="mx-auto text-gray-300" />
            <p className="text-xs text-gray-400 font-semibold">لم تقم بإعداد أي هدف ادخاري حتى الآن.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Goal form modal */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black z-40"
            ></motion.div>

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl shadow-xl z-50 overflow-hidden text-right border-t border-emerald-950/10"
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto my-3"></div>
              
              <div className="px-5 pb-8 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-emerald-950">
                    {editingId ? "تعديل بيانات الهدف المالي" : "إنشاء هدف مالي جديد"}
                  </h3>
                  <button onClick={() => setIsFormOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Goal Title */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">اسم الهدف المالي</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: شراء سيارة جديدة، صندوق الطوارئ..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full pl-3 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary text-right"
                    />
                  </div>

                  {/* Goal Category */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">نوع الهدف</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="savings">حصالة ادخار شخصية</option>
                      <option value="emergency">تأسيس صندوق طوارئ آمن</option>
                      <option value="debt">سداد دين أو قسط بنكي</option>
                      <option value="investment">محفظة استثمارية طويلة المدى</option>
                    </select>
                  </div>

                  {/* Amounts */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-500">المبلغ المستهدف (ريال)</label>
                      <input
                        type="number"
                        required
                        placeholder="10000"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-emerald-950 font-bold font-sans text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-500">المبلغ الحالي المتوفر (ريال)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={currentAmount}
                        onChange={(e) => setCurrentAmount(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-emerald-950 font-bold font-sans text-center"
                      />
                    </div>
                  </div>

                  {/* Deadline and milestones */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">تاريخ الإنجاز المتوقع</label>
                    <input
                      type="date"
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-700 focus:outline-none focus:border-primary text-center font-sans"
                    />
                  </div>

                  {/* Milestones input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">المهمات الفرعية والخطوات (افصل بـ فاصلة)</label>
                    <textarea
                      rows={2}
                      placeholder="خطوة ١، خطوة ٢، خطوة ٣..."
                      value={milestonesText}
                      onChange={(e) => setMilestonesText(e.target.value)}
                      className="w-full pl-3 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary text-right"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light transition-all text-sm cursor-pointer mt-3 flex items-center justify-center gap-1.5"
                  >
                    <Check size={16} />
                    <span>حفظ وتفعيل الهدف</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Deposit simulation modal */}
      <AnimatePresence>
        {isDepositOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDepositOpen(false)}
              className="fixed inset-0 bg-black z-40"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 m-auto max-w-sm h-fit bg-white rounded-3xl shadow-xl z-50 overflow-hidden text-right p-6 border border-gray-100"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 mb-4">
                <h3 className="text-sm font-bold text-emerald-950">إيداع مبلغ في الحصالة 💰</h3>
                <button onClick={() => setIsDepositOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500">مبلغ الإيداع (ريال)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    autoFocus
                    placeholder="500"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold font-sans text-emerald-950 focus:outline-none focus:border-primary text-center"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all text-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check size={14} />
                  <span>تأكيد الإيداع الفوري</span>
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
