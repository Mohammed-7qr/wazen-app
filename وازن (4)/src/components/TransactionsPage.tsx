/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Filter, Plus, Calendar, FileText, Check, Trash2, Edit3, 
  Paperclip, ArrowDownLeft, ArrowUpRight, HelpCircle, X, ChevronDown, CheckCircle2
} from "lucide-react";
import { Transaction, Wallet } from "../types";

interface TransactionsPageProps {
  transactions: Transaction[];
  wallets: Wallet[];
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  onEditTransaction: (id: string, updated: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
}

const INCOME_CATEGORIES = ["راتب", "عمل مستقل", "استثمار", "تحويل وارد", "هدايا", "أخرى"];
const EXPENSE_CATEGORIES = ["مطاعم ومقاهي", "تسوق ومشتريات", "فواتير كهرباء وإنترنت", "نقل ومواصلات", "صحة وعافية", "ترفيه وألعاب", "تعليم", "سفر", "كمالية"];

export default function TransactionsPage({ 
  transactions, 
  wallets, 
  onAddTransaction, 
  onEditTransaction, 
  onDeleteTransaction 
}: TransactionsPageProps) {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [walletFilter, setWalletFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [walletId, setWalletId] = useState(wallets[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [attachment, setAttachment] = useState("");

  const handleOpenAdd = () => {
    setEditingId(null);
    setAmount("");
    setType("expense");
    setCategory(EXPENSE_CATEGORIES[0]);
    setWalletId(wallets[0]?.id || "");
    setDate(new Date().toISOString().split('T')[0]);
    setNotes("");
    setIsRecurring(false);
    setAttachment("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (t: Transaction) => {
    setEditingId(t.id);
    setAmount(t.amount.toString());
    setType(t.type);
    setCategory(t.category);
    setWalletId(t.walletId);
    setDate(t.date);
    setNotes(t.notes || "");
    setIsRecurring(t.isRecurring);
    setAttachment(t.attachment || "");
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    const payload = {
      type,
      amount: parseFloat(amount),
      category,
      walletId,
      date,
      notes,
      isRecurring,
      attachment: attachment || undefined
    };

    if (editingId) {
      onEditTransaction(editingId, payload);
    } else {
      onAddTransaction(payload);
    }
    setIsFormOpen(false);
  };

  const handleAttachmentUploadSimulate = () => {
    // Simulating attachment upload by assigning a random dummy file name
    const docNames = ["فاتورة_ضريبة.pdf", "سند_قبض.jpg", "تذكرة_مشتريات.png"];
    const randomName = docNames[Math.floor(Math.random() * docNames.length)];
    setAttachment(randomName);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesWallet = walletFilter === 'all' || t.walletId === walletFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesType && matchesWallet && matchesCategory;
  });

  return (
    <div className="space-y-5 pb-24 text-right rtl">
      {/* Header and Add Button */}
      <div className="flex justify-between items-center bg-white/70 p-4 rounded-2xl border border-emerald-950/5 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-emerald-950">المعاملات المالية</h2>
          <p className="text-[11px] text-gray-500">سجل وراقب جميع حركاتك المالية بكل سهولة</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAdd}
          className="p-3 bg-primary text-white rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
        >
          <Plus size={16} />
          <span>إضافة معاملة</span>
        </motion.button>
      </div>

      {/* Search & Filters block */}
      <div className="bg-white/80 border border-emerald-950/5 p-4 rounded-2xl space-y-3.5 shadow-sm">
        {/* Search Input */}
        <div className="relative">
          <span className="absolute right-3.5 top-3 text-gray-400"><Search size={16} /></span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن معاملة، فئة، أو ملاحظة..."
            className="w-full pl-4 pr-11 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-right"
          />
        </div>

        {/* Filter Quick Tags (Type Filter) */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setTypeFilter('all')}
            className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              typeFilter === 'all' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setTypeFilter('income')}
            className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              typeFilter === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            الدخل
          </button>
          <button
            onClick={() => setTypeFilter('expense')}
            className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              typeFilter === 'expense' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            المصروفات
          </button>
        </div>

        {/* Select Dropdowns for Wallet and Category */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500">فرز المحفظة</label>
            <select
              value={walletFilter}
              onChange={(e) => setWalletFilter(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">كل المحافظ</option>
              {wallets.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500">فرز الفئة</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">كل الفئات</option>
              {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        <AnimatePresence initial={false}>
          {filteredTransactions.map((t) => {
            const isIncome = t.type === 'income';
            const matchedWalletName = wallets.find(w => w.id === t.walletId)?.name || "محفظة نقدية";
            
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-emerald-950/5 p-3.5 rounded-2xl flex flex-col gap-2.5 shadow-sm hover:border-emerald-900/10 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${
                      isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50/60 text-red-600'
                    }`}>
                      {isIncome ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">{t.category}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] text-gray-400 font-sans">{t.date}</span>
                        <span className="text-[9px] text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded-full font-bold">
                          {matchedWalletName}
                        </span>
                        {t.isRecurring && (
                          <span className="text-[8px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.2 rounded-full font-bold">
                            تكرار دوري
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Amount & Actions */}
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold font-sans ${isIncome ? 'text-emerald-700' : 'text-red-600'}`}>
                      {isIncome ? '+' : '-'}{t.amount.toLocaleString('ar-SA')} ر.س
                    </span>
                    <div className="flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEdit(t)}
                        className="p-1 text-gray-500 hover:text-primary rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                        title="تعديل"
                      >
                        <Edit3 size={11} />
                      </button>
                      <button 
                        onClick={() => onDeleteTransaction(t.id)}
                        className="p-1 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Details (Notes & Attachment) */}
                {(t.notes || t.attachment) && (
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2 items-center justify-between">
                    {t.notes && (
                      <p className="text-[10px] text-gray-500 leading-normal flex-1 text-right">
                        💡 {t.notes}
                      </p>
                    )}
                    {t.attachment && (
                      <div className="flex items-center gap-1 bg-yellow-50/50 border border-yellow-100 px-2 py-0.5 rounded-lg text-[9px] font-semibold text-yellow-800">
                        <Paperclip size={10} />
                        <span>{t.attachment}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
          {filteredTransactions.length === 0 && (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-2">
              <HelpCircle size={32} className="mx-auto text-gray-300" />
              <p className="text-xs text-gray-400 font-semibold">لا توجد أي معاملات تطابق معايير البحث والفرز.</p>
            </div>
          )}
        </AnimatePresence>
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
                    {editingId ? "تعديل المعاملة المالية" : "إضافة معاملة جديدة"}
                  </h3>
                  <button 
                    onClick={() => setIsFormOpen(false)} 
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Transaction Type Segment Controller */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setType("expense");
                        setCategory(EXPENSE_CATEGORIES[0]);
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        type === 'expense' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      صرف / مصروفات
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setType("income");
                        setCategory(INCOME_CATEGORIES[0]);
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        type === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      دخل / إيداع
                    </button>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">القيمة بالريال السعودي</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold font-sans text-emerald-950 focus:outline-none focus:border-primary text-center"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">الفئة</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {type === "expense" 
                        ? EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
                        : INCOME_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
                      }
                    </select>
                  </div>

                  {/* Wallet Selection & Date */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-500">المحفظة / الحساب</label>
                      <select
                        value={walletId}
                        onChange={(e) => setWalletId(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
                      >
                        {wallets.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-500">تاريخ المعاملة</label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-700 focus:outline-none focus:border-primary text-center font-sans"
                      />
                    </div>
                  </div>

                  {/* Notes Field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">ملاحظات إضافية (اختياري)</label>
                    <input
                      type="text"
                      placeholder="مثال: الغداء مع زملاء العمل في المطعم..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full pl-3 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-right"
                    />
                  </div>

                  {/* Toggle switches for Recurring & Attachment upload */}
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-emerald-950">معاملة متكررة دورياً؟</span>
                      <span className="text-[9px] text-gray-400">مثال: الراتب الشهري أو اشتراك الكهرباء</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsRecurring(!isRecurring)}
                      className={`w-10 h-5 rounded-full p-[2px] transition-all cursor-pointer ${
                        isRecurring ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all transform ${
                        isRecurring ? 'translate-x-0' : 'translate-x-5'
                      }`}></div>
                    </button>
                  </div>

                  {/* Attachment Section */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 block">إرفاق إيصال الدفع أو الفاتورة</label>
                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        onClick={handleAttachmentUploadSimulate}
                        className="px-3.5 py-2.5 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-xs font-bold hover:bg-yellow-100/75 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Paperclip size={14} />
                        <span>تحميل مستند (محاكاة)</span>
                      </button>
                      {attachment && (
                        <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100 animate-pulse">
                          ✓ {attachment}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Confirm and Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light transition-all text-sm cursor-pointer mt-3 flex items-center justify-center gap-1.5"
                  >
                    <Check size={16} />
                    <span>حفظ التعديلات والمعاملة</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
