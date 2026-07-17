/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Shield, BookOpen, TrendingUp } from "lucide-react";

interface SplashProps {
  onStart: () => void;
  onLoginClick: () => void;
}

export default function Splash({ onStart, onLoginClick }: SplashProps) {
  return (
    <div className="min-h-screen bg-islamic-pattern flex flex-col justify-between p-6 overflow-hidden rtl select-none">
      {/* Top Header - Vision 2030 Representation */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-1.5 bg-emerald-950/5 px-3 py-1.5 rounded-full border border-emerald-950/10">
          <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-semibold text-emerald-800 font-sans tracking-wide">رؤية VISION 2030</span>
        </div>
        <span className="text-[10px] text-gray-500 font-medium">المنصة الوطنية للوعي المالي</span>
      </div>

      {/* Main Logo & Welcome Text */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-28 h-28 bg-white rounded-[28px] flex items-center justify-center shadow-xl shadow-emerald-950/10 mb-6 relative border border-emerald-950/5 p-4"
        >
          {/* High-Fidelity Custom Brand Logo Image */}
          <img
            src="/wazen-logo.png"
            alt="شعار وازن"
            className="w-22 h-22 object-contain"
            referrerPolicy="no-referrer"
          />
          
          {/* Modern Checkmark Badge */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-600 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow shadow-emerald-950/20">
            ✓
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-black text-primary tracking-tight mb-2"
        >
          وازن
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg text-emerald-800 font-semibold mb-4 max-w-sm px-4 leading-relaxed"
        >
          ابدأ رحلتك نحو وعي مالي أذكى
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xs text-gray-500 max-w-xs leading-relaxed mb-8 px-2"
        >
          منصة مالية وطنية لمساعدتك على تنظيم أموالك، تنظيم ميزانيتك، واتخاذ قرارات مالية أفضل لمستقبل مستقر.
        </motion.p>
      </div>

      {/* Buttons Block */}
      <div className="space-y-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/15 transition-all hover:bg-primary-light text-base flex items-center justify-center gap-2 cursor-pointer"
        >
          ابدأ الآن
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onLoginClick}
          className="w-full py-4 bg-white/80 border border-primary/25 text-primary font-bold rounded-2xl hover:bg-emerald-50 transition-all text-base flex items-center justify-center gap-2 cursor-pointer"
        >
          تسجيل الدخول
        </motion.button>
      </div>

      {/* Visual Value Cards */}
      <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-emerald-950/5">
        <div className="bg-white/60 p-2.5 rounded-xl border border-emerald-950/5 flex flex-col items-center text-center">
          <div className="p-1.5 bg-emerald-50 rounded-lg mb-1 text-primary">
            <TrendingUp size={16} />
          </div>
          <span className="text-[10px] font-bold text-gray-800 mb-0.5">قرارات أفضل</span>
          <p className="text-[8px] text-gray-400 leading-tight">أدوات تساعدك على اتخاذ قرارات مالية ذكية</p>
        </div>

        <div className="bg-white/60 p-2.5 rounded-xl border border-emerald-950/5 flex flex-col items-center text-center">
          <div className="p-1.5 bg-emerald-50 rounded-lg mb-1 text-primary">
            <BookOpen size={16} />
          </div>
          <span className="text-[10px] font-bold text-gray-800 mb-0.5">تعليم بسيط وعلمي</span>
          <p className="text-[8px] text-gray-400 leading-tight">محتوى مالي مبسط يلائم احتياجاتك اليومية</p>
        </div>

        <div className="bg-white/60 p-2.5 rounded-xl border border-emerald-950/5 flex flex-col items-center text-center">
          <div className="p-1.5 bg-emerald-50 rounded-lg mb-1 text-primary">
            <Shield size={16} />
          </div>
          <span className="text-[10px] font-bold text-gray-800 mb-0.5">آمنة وموثوقة</span>
          <p className="text-[8px] text-gray-400 leading-tight">بياناتك محمية بأعلى معايير الأمان المالي</p>
        </div>
      </div>

      {/* Footer National Text */}
      <div className="text-center pt-4 flex flex-col items-center gap-1">
        <div className="flex items-center gap-1 justify-center">
          {/* Saudi Palm Emblem */}
          <span className="text-emerald-800 text-sm">🌴</span>
          <span className="text-[9px] font-bold text-emerald-800">منصة وطنية صُممت للشباب السعودي</span>
        </div>
        <span className="text-[8px] text-gray-400">جميع الحقوق محفوظة © وازن ٢٠٢٦</span>
      </div>
    </div>
  );
}
