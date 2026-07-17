/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, X, CreditCard, Landmark, Wallet as WalletIcon, Smartphone, 
  ArrowRightLeft, Check, Trash2, Edit3, HelpCircle 
} from "lucide-react";
import { Wallet, WalletType } from "../types";

interface WalletsPageProps {
  wallets: Wallet[];
  onAddWallet: (wallet: Omit<Wallet, "id">) => void;
  onEditWallet: (id: string, updated: Partial<Wallet>) => void;
  onDeleteWallet: (id: string) => void;
  onTransfer: (fromId: string, toId: string, amount: number) => void;
}

const TYPE_LABELS = {
  cash: "نقدي / كاش",
  bank: "حساب بنكي جاري",
  credit: "بطاقة ائتمانية",
  digital: "محفظة رقمية (STC Pay / Urpay)"
};

export default function WalletsPage({ 
  wallets, 
  onAddWallet, 
  onEditWallet, 
  onDeleteWallet,
  onTransfer 
}: WalletsPageProps) {
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields for Wallet CRUD
  const [name, setName] = useState("");
  const [type, setType] = useState<WalletType>("cash");
  const [balance, setBalance] = useState("");

  // Form Fields for Transfer
  const [transferFrom, setTransferFrom] = useState(wallets[0]?.id || "");
  const [transferTo, setTransferTo] = useState(wallets[1]?.id || "");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferError, setTransferError] = useState("");

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setType("cash");
    setBalance("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (w: Wallet) => {
    setEditingId(w.id);
    setName(w.name);
    setType(w.type);
    setBalance(w.balance.toString());
    setIsFormOpen(true);
  };

  const handleOpenTransfer = () => {
    setTransferFrom(wallets[0]?.id || "");
    setTransferTo(wallets[1]?.id || "");
    setTransferAmount("");
    setTransferError("");
    setIsTransferOpen(true);
  };

  const handleSubmitWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !balance) return;

    const payload = {
      name,
      type,
      balance: parseFloat(balance)
    };

    if (editingId) {
      onEditWallet(editingId, payload);
    } else {
      onAddWallet(payload);
    }
    setIsFormOpen(false);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError("");

    if (transferFrom === transferTo) {
      setTransferError("لا يمكن التحويل لنفس المحفظة المستهدفة");
      return;
    }

    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0) return;

    const sourceWallet = wallets.find(w => w.id === transferFrom);
    if (!sourceWallet || sourceWallet.balance < amt) {
      setTransferError("عذراً، الرصيد المتاح غير كافٍ لإجراء هذه العملية");
      return;
    }

    onTransfer(transferFrom, transferTo, amt);
    setIsTransferOpen(false);
  };

  const getIcon = (type: WalletType) => {
    switch (type) {
      case 'cash': return <WalletIcon size={20} />;
      case 'bank': return <Landmark size={20} />;
      case 'credit': return <CreditCard size={20} />;
      case 'digital': return <Smartphone size={20} />;
    }
  };

  const getGradientClass = (type: WalletType) => {
    switch (type) {
      case 'cash': return 'from-emerald-800 to-emerald-950 text-white';
      case 'bank': return 'from-teal-800 to-teal-950 text-white';
      case 'credit': return 'from-indigo-800 to-indigo-950 text-white';
      case 'digital': return 'from-primary-light to-primary-dark text-white';
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ar-SA') + ' ريال';
  };

  return (
    <div className="space-y-5 pb-24 text-right rtl">
      {/* Header and buttons */}
      <div className="flex justify-between items-center bg-white/70 p-4 rounded-2xl border border-emerald-950/5 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-emerald-950">المحافظ والحسابات</h2>
          <p className="text-[11px] text-gray-500">تحكم بمدخراتك الموزعة، وحوّل الأرصدة بين حساباتك</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenTransfer}
            className="p-2.5 bg-white border border-primary/20 text-primary rounded-xl flex items-center justify-center gap-1 text-xs font-bold cursor-pointer"
            title="تحويل بين المحافظ"
          >
            <ArrowRightLeft size={14} />
            <span>تحويل رصيد</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenAdd}
            className="p-2.5 bg-primary text-white rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light flex items-center justify-center gap-1 text-xs font-bold cursor-pointer"
          >
            <Plus size={14} />
            <span>إضافة محفظة</span>
          </motion.button>
        </div>
      </div>

      {/* List of wallets as beautiful Cards */}
      <div className="grid grid-cols-1 gap-4">
        {wallets.map((w) => (
          <div 
            key={w.id} 
            className={`p-5 rounded-3xl bg-gradient-to-br ${getGradientClass(w.type)} shadow-md relative overflow-hidden transition-all duration-300 hover:scale-[1.01]`}
          >
            {/* Subtle overlay logo */}
            <div className="absolute top-2 left-4 text-white/5 font-sans font-black text-6xl select-none">
              WAZEN
            </div>

            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-white backdrop-blur-sm">
                  {getIcon(w.type)}
                </div>
                <div>
                  <h4 className="text-sm font-bold">{w.name}</h4>
                  <span className="text-[9px] text-white/75 font-semibold mt-0.5 block">
                    {TYPE_LABELS[w.type]}
                  </span>
                </div>
              </div>

              {/* Edit/Delete controls */}
              <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenEdit(w)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
                >
                  <Edit3 size={12} />
                </button>
                <button
                  onClick={() => onDeleteWallet(w.id)}
                  className="p-1.5 text-white/80 hover:text-red-300 hover:bg-white/10 rounded-lg cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Wallet Balance Display */}
            <div className="mt-6 flex justify-between items-end relative z-10">
              <div>
                <span className="text-[9px] text-white/60 font-semibold uppercase tracking-wider">رصيدك المتاح حالياً</span>
                <h3 className="text-2xl font-extrabold font-sans tracking-tight mt-0.5">
                  {formatCurrency(w.balance)}
                </h3>
              </div>
              <span className="text-[10px] text-accent/90 bg-white/10 border border-white/10 px-2 py-0.5 rounded-full font-bold">
                نشط ✓
              </span>
            </div>
          </div>
        ))}

        {wallets.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-2">
            <HelpCircle size={32} className="mx-auto text-gray-300" />
            <p className="text-xs text-gray-400 font-semibold">لا توجد لديك أي محفظة مضافة حالياً.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Wallet Form Modal */}
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
                    {editingId ? "تعديل بيانات الحساب" : "إضافة محفظة أو حساب جديد"}
                  </h3>
                  <button onClick={() => setIsFormOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmitWallet} className="space-y-4">
                  {/* Wallet Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">اسم المحفظة / الحساب البنكي</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: بطاقة مدى البنك الأهلي، كاش الجيب..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-3 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary text-right"
                    />
                  </div>

                  {/* Wallet Type */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">نوع الحساب</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as WalletType)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="cash">نقدي / كاش يدوي</option>
                      <option value="bank">حساب بنكي جاري</option>
                      <option value="credit">بطاقة ائتمانية (فيزا / ماستركارد)</option>
                      <option value="digital">محفظة رقمية (STC Pay، Urpay، إلخ)</option>
                    </select>
                  </div>

                  {/* Wallet Balance */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">الرصيد المالي الحالي المتوفر</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="مثال: 3250"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold font-sans text-emerald-950 focus:outline-none focus:border-primary text-center"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light transition-all text-sm cursor-pointer mt-3 flex items-center justify-center gap-1.5"
                  >
                    <Check size={16} />
                    <span>حفظ المحفظة المالية</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Transfer simulation modal */}
      <AnimatePresence>
        {isTransferOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTransferOpen(false)}
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
                  <h3 className="text-sm font-bold text-emerald-950">تحويل رصيد مالي</h3>
                  <button onClick={() => setIsTransferOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer">
                    <X size={18} />
                  </button>
                </div>

                {transferError && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold text-center">{transferError}</div>}

                <form onSubmit={handleTransferSubmit} className="space-y-4">
                  {/* From Wallet */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">التحويل من (المصدر)</label>
                    <select
                      value={transferFrom}
                      onChange={(e) => setTransferFrom(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {wallets.map(w => (
                        <option key={w.id} value={w.id}>{w.name} ({formatCurrency(w.balance)})</option>
                      ))}
                    </select>
                  </div>

                  {/* To Wallet */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">التحويل إلى (المستلم)</label>
                    <select
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {wallets.map(w => (
                        <option key={w.id} value={w.id}>{w.name} ({formatCurrency(w.balance)})</option>
                      ))}
                    </select>
                  </div>

                  {/* Transfer Amount */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500">مبلغ التحويل (ريال)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="مثال: 1000"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold font-sans text-emerald-950 focus:outline-none focus:border-primary text-center"
                    />
                  </div>

                  {/* Submit Transfer */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light transition-all text-sm cursor-pointer mt-3 flex items-center justify-center gap-1.5"
                  >
                    <ArrowRightLeft size={16} />
                    <span>تأكيد التحويل المالي الفوري</span>
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
