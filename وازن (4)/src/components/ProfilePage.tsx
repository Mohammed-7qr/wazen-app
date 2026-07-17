/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Mail, Bell, Shield, Globe, HelpCircle, Info, LogOut, Check, X,
  Download, Upload, RefreshCw, AlertTriangle, Trash2, Camera, Settings2, Moon
} from "lucide-react";

interface ProfilePageProps {
  userProfile: { name: string; email: string; level: number; xp: number; xpToNextLevel: number };
  onUpdateProfile: (name: string, email: string) => void;
  onLogout: () => void;
  onExportData: () => void;
  onImportData: (jsonData: string) => void;
  onResetAllData: () => void;
}

export default function ProfilePage({
  userProfile,
  onUpdateProfile,
  onLogout,
  onExportData,
  onImportData,
  onResetAllData
}: ProfilePageProps) {
  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [currency, setCurrency] = useState("SAR");
  const [language, setLanguage] = useState("ar");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Import file ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name, email);
    setIsEditOpen(false);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        onImportData(result);
        alert("تم استيراد النسخة الاحتياطية واستعادة جميع بياناتك المالية بنجاح! 🎉");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-24 text-right rtl">
      {/* Top Banner & Avatar Header */}
      <div className="card-premium p-6 text-center space-y-4 relative overflow-hidden">
        {/* Subtle Islamic Motif Background overlay */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-5"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-primary border-4 border-emerald-950/5 font-extrabold text-3xl shadow-inner relative">
              {userProfile.name[0]}
            </div>
            <button 
              onClick={() => setIsEditOpen(true)}
              className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full border border-white hover:bg-primary-light cursor-pointer shadow-sm"
              title="تعديل الصورة الشخصية"
            >
              <Camera size={12} />
            </button>
          </div>

          <h3 className="text-base font-black text-emerald-950 mt-3">{userProfile.name}</h3>
          <span className="text-xs text-gray-400 font-sans">{userProfile.email}</span>

          <span className="text-[10px] font-bold text-emerald-950 bg-accent/20 px-3 py-1 rounded-full mt-2 border border-accent/10">
            العضوية الذهبية • مستوى {userProfile.level} 👑
          </span>
        </div>
      </div>

      {/* Menu Options - Matching design perfectly */}
      <div className="bg-white/90 border border-emerald-950/5 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
        {/* Option 1: Personal Info */}
        <button 
          onClick={() => setIsEditOpen(true)}
          className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-right cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-100">
              <User size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-800">المعلومات الشخصية</span>
              <p className="text-[9px] text-gray-400">تحديث اسمك وبريدك الإلكتروني لتأمين حسابك</p>
            </div>
          </div>
          <span className="text-gray-400 text-xs">⟵</span>
        </button>

        {/* Option 2: App configurations */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-right cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-100">
              <Settings2 size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-800">تفضيلات التطبيق والعملة</span>
              <p className="text-[9px] text-gray-400">العملة الافتراضية، المنطقة الزمنية، والمظهر</p>
            </div>
          </div>
          <span className="text-gray-400 text-xs">⟵</span>
        </button>

        {/* Option 3: Notifications Settings toggle */}
        <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-right">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-100">
              <Bell size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-800">إشعارات التذكير الذكية</span>
              <p className="text-[9px] text-gray-400">تنبيهات اقتراب الميزانية والخطط الأسبوعية</p>
            </div>
          </div>
          
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-10 h-5 rounded-full p-[2px] transition-all cursor-pointer ${
              notificationsEnabled ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all transform ${
              notificationsEnabled ? 'translate-x-0' : 'translate-x-5'
            }`}></div>
          </button>
        </div>

        {/* Option 4: Data export backup */}
        <button 
          onClick={onExportData}
          className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-right cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-primary flex items-center justify-center border border-emerald-100">
              <Download size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-950">تصدير وحفظ البيانات 📥</span>
              <p className="text-[9px] text-emerald-800 font-medium">قم بتحميل نسخة احتياطية كاملة لجهازك بصيغة JSON</p>
            </div>
          </div>
          <span className="text-primary text-xs font-bold">تصدير</span>
        </button>

        {/* Option 5: Data import restore */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-right cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-yellow-50 text-yellow-800 flex items-center justify-center border border-yellow-100">
              <Upload size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-yellow-950">استيراد نسخة احتياطية 📤</span>
              <p className="text-[9px] text-yellow-800 font-medium">اختر ملف بيانات وازن لاسترجاع معاملاتك وميزانياتك</p>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".json"
            className="hidden"
          />
          <span className="text-yellow-800 text-xs font-bold">استيراد</span>
        </button>

        {/* Option 6: Help and FAQs */}
        <div className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-right cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-100">
              <HelpCircle size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-800">المساعدة والدعم الفني</span>
              <p className="text-[9px] text-gray-400">إرشادات وأسئلة شائعة حول حماية وإدارة الأصول المالية</p>
            </div>
          </div>
          <span className="text-gray-400 text-xs">؟</span>
        </div>

        {/* Option 7: About application */}
        <div className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-right cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-100">
              <Info size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-800">عن منصة وازن الوطنية</span>
              <p className="text-[9px] text-gray-400">إصدار التطبيق v1.4.2 مرخص كلياً</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-950 font-bold px-2 py-0.5 rounded-full">نسخة ٢٠٢٦</span>
        </div>
      </div>

      {/* Buttons block */}
      <div className="space-y-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full py-4 bg-white/80 border border-red-200 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm hover:bg-red-50/50 cursor-pointer transition-all shadow-sm"
        >
          <LogOut size={16} />
          <span>تسجيل خروج من الحساب</span>
        </motion.button>

        <button 
          onClick={() => setIsDeleteConfirmOpen(true)}
          className="w-full text-center py-2 text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          حذف الحساب المالي نهائياً 🚨
        </button>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="fixed inset-0 bg-black z-40"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 m-auto max-w-sm h-fit bg-white rounded-3xl shadow-xl z-50 overflow-hidden text-right p-6 border border-gray-100"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 mb-4">
                <h3 className="text-sm font-bold text-emerald-950">تحديث بيانات العضو الشخصية</h3>
                <button onClick={() => setIsEditOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-3 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-3 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary text-left"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all text-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check size={14} />
                  <span>تأكيد وحفظ التعديلات الشخصية</span>
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Preferences Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black z-40"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 m-auto max-w-sm h-fit bg-white rounded-3xl shadow-xl z-50 overflow-hidden text-right p-6 border border-gray-100"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 mb-4">
                <h3 className="text-sm font-bold text-emerald-950">تفضيلات وازن</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Currency selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500">العملة الافتراضية</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                  </select>
                </div>

                {/* Language selection */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500">اللغة الافتراضية</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="ar">العربية (Default RTL)</option>
                    <option value="en">English (LTR Preview)</option>
                  </select>
                </div>

                {/* Dark mode toggle mock */}
                <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Moon size={14} className="text-gray-500" />
                    <span className="text-xs font-bold text-gray-800">تفعيل الوضع الداكن</span>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-10 h-5 rounded-full p-[2px] transition-all cursor-pointer ${
                      darkMode ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all transform ${
                      darkMode ? 'translate-x-0' : 'translate-x-5'
                    }`}></div>
                  </button>
                </div>

                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all text-xs cursor-pointer"
                >
                  تأكيد التفضيلات
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Account confirmation alert */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="fixed inset-0 bg-black z-40"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 m-auto max-w-sm h-fit bg-white rounded-3xl shadow-xl z-50 overflow-hidden text-right p-6 border border-red-100"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-950">تأكيد حذف الحساب المالي؟</h3>
                  <p className="text-[11px] text-gray-500 leading-normal mt-1">
                    تحذير: هذا الإجراء لا يمكن التراجع عنه. سيتم مسح كافة سجلات معاملاتك، ميزانياتك، وأرصدة المحافظ والتقدم في التحديات والـ XP نهائياً.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onResetAllData}
                  className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Trash2 size={13} />
                  <span>نعم، امسح كل شيء</span>
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-200 transition-all cursor-pointer text-center"
                >
                  إلغاء التراجع
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
