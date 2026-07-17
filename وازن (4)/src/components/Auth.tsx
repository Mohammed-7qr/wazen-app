/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, Key, ShieldCheck, ChevronRight, Copy, Check, Sparkles } from "lucide-react";

interface AuthProps {
  onSuccess: (userData: { name: string; email: string }) => void;
  onBackToSplash: () => void;
}

type AuthMode = "login" | "register" | "forgot" | "otp" | "reset";

export default function Auth({ onSuccess, onBackToSplash }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("demo@wazen.com");
  const [password, setPassword] = useState("Wazen2026");
  const [name, setName] = useState("عبد الرحمن محمد");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }
    setError("");
    onSuccess({ name: name || "عبد الرحمن محمد", email });
  };

  const copyToClipboard = (text: string, type: "email" | "password") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  const handleAutoFillAndLogin = () => {
    setEmail("demo@wazen.com");
    setPassword("Wazen2026");
    setError("");
    // Trigger successful login with demo details
    onSuccess({ name: "عبد الرحمن محمد", email: "demo@wazen.com" });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }
    setError("");
    setSuccessMsg("تم إنشاء الحساب بنجاح! الرجاء تفعيل الحساب برمز التحقق.");
    setMode("otp");
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("الرجاء كتابة البريد الإلكتروني الخاص بك");
      return;
    }
    setError("");
    setSuccessMsg("تم إرسال رمز التحقق إلى بريدك الإلكتروني.");
    setMode("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(digit => !digit)) {
      setError("الرجاء إدخال رمز التحقق الكامل المكون من 4 أرقام");
      return;
    }
    setError("");
    setSuccessMsg("تم تفعيل حسابك بنجاح! قم بتعيين كلمة المرور الجديدة.");
    setMode("reset");
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    onSuccess({ name: name || "عبد الرحمن محمد", email });
  };

  const handleGoogleLogin = () => {
    // Simulated Google login
    onSuccess({ name: "عبد الرحمن محمد", email: "abdo@exmple.com" });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next field
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-islamic-pattern flex flex-col justify-between p-6 overflow-hidden rtl">
      {/* Header Bar */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={mode === "login" ? onBackToSplash : () => setMode("login")}
          className="p-2.5 bg-white/90 rounded-xl border border-emerald-950/5 text-gray-700 shadow-sm hover:bg-gray-50 flex items-center justify-center cursor-pointer"
        >
          <ChevronRight size={18} className="rtl:rotate-0" />
        </button>
        
        {/* المكان الصحيح لإضافة الشعار */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary text-lg">وازن</span>
          <img 
            src="/wazen-logo.png" 
            alt="شعار وازن" 
            className="w-8 h-8 object-contain"
          />
        </div>
        
        <div className="w-9 h-9"></div> {/* spacer */}
      </div>

      {/* Main Form Box */}
      <div className="flex-1 flex flex-col justify-center my-6 max-w-sm mx-auto w-full">
        <AnimatePresence mode="wait">
          {mode === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-primary mb-2">تسجيل الدخول</h2>
                <p className="text-xs text-gray-500">أهلاً بك مجدداً في منصة وازن، الرجاء ملء الحقول</p>
              </div>

              {/* Demo Credentials Panel */}
              <div className="bg-emerald-50/80 border border-emerald-900/10 p-4 rounded-2xl mb-5 text-right space-y-3 shadow-sm">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                  <Sparkles size={14} className="text-emerald-600 animate-pulse" />
                  <span>بيانات الدخول التجريبية (اضغط للنسخ):</span>
                </div>
                
                <div className="space-y-2 text-[11px]">
                  {/* Email row */}
                  <div className="flex items-center justify-between bg-white/80 px-3 py-2 rounded-xl border border-emerald-950/5">
                    <span className="text-emerald-950 font-bold select-all font-sans">demo@wazen.com</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("demo@wazen.com", "email")}
                      className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold transition-all cursor-pointer"
                    >
                      {copiedEmail ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      <span>{copiedEmail ? "تم النسخ!" : "نسخ الإيميل"}</span>
                    </button>
                  </div>

                  {/* Password row */}
                  <div className="flex items-center justify-between bg-white/80 px-3 py-2 rounded-xl border border-emerald-950/5">
                    <span className="text-emerald-950 font-bold select-all font-sans">Wazen2026</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("Wazen2026", "password")}
                      className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold transition-all cursor-pointer"
                    >
                      {copiedPassword ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      <span>{copiedPassword ? "تم النسخ!" : "نسخ الرمز"}</span>
                    </button>
                  </div>
                </div>

                {/* Auto fill CTA */}
                <button
                  type="button"
                  onClick={handleAutoFillAndLogin}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-emerald-700/10 cursor-pointer"
                >
                  <Key size={13} />
                  <span>تعبئة تلقائية ودخول مباشر سريع ⚡</span>
                </button>
              </div>

              {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs mb-4 font-semibold text-center">{error}</div>}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">البريد الإلكتروني</label>
                  <div className="relative">
                    <span className="absolute right-3.5 top-3 text-gray-400"><Mail size={18} /></span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-4 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-gray-600">كلمة المرور</label>
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs font-semibold text-accent hover:underline cursor-pointer"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute right-3.5 top-3 text-gray-400"><Lock size={18} /></span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Wazen2026"
                      className="w-full pl-4 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light transition-all text-sm cursor-pointer mt-2"
                >
                  تسجيل الدخول
                </button>
              </form>

              <div className="relative my-6 text-center">
                <span className="absolute left-0 top-1/2 w-full h-[1px] bg-gray-200 -z-10"></span>
                <span className="bg-background-soft px-3 text-xs text-gray-400">أو عن طريق</span>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <svg className="w-5 h-5 ml-1" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.68 1.39 7.56l3.85 2.99C6.16 7.22 8.87 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.58v2.98h3.9c2.28-2.1 3.55-5.19 3.55-8.71z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.24 14.47A7.16 7.16 0 0 1 4.85 12c0-.85.15-1.68.4-2.47L1.39 6.54A11.96 11.96 0 0 0 0 12c0 1.95.47 3.79 1.39 5.46l3.85-2.99z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.9-2.98c-1.08.72-2.48 1.15-4.06 1.15-3.13 0-5.84-2.18-6.76-5.51l-3.85 2.99C3.37 20.32 7.35 23 12 23z"
                  />
                </svg>
                الدخول عبر حساب جوجل
              </button>

              <div className="text-center mt-6">
                <span className="text-xs text-gray-500">ليس لديك حساب مسبق؟</span>{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-xs font-bold text-accent hover:underline cursor-pointer"
                >
                  سجل الآن مجاناً
                </button>
              </div>
            </motion.div>
          )}

          {mode === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-primary mb-2">حساب جديد</h2>
                <p className="text-xs text-gray-500">ابدأ تخطيطك المالي اليوم واحصل على ٢٠٠ نقطة ترحيبية</p>
              </div>

              {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs mb-4 font-semibold text-center">{error}</div>}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">الاسم الكامل</label>
                  <div className="relative">
                    <span className="absolute right-3.5 top-3 text-gray-400"><User size={18} /></span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="عبد الرحمن محمد"
                      className="w-full pl-4 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-right"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">البريد الإلكتروني</label>
                  <div className="relative">
                    <span className="absolute right-3.5 top-3 text-gray-400"><Mail size={18} /></span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="abdo@example.com"
                      className="w-full pl-4 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">كلمة المرور</label>
                  <div className="relative">
                    <span className="absolute right-3.5 top-3 text-gray-400"><Lock size={18} /></span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-4 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light transition-all text-sm cursor-pointer"
                >
                  إنشاء حساب تفعيلي
                </button>
              </form>

              <div className="text-center mt-6">
                <span className="text-xs text-gray-500">لديك حساب بالفعل؟</span>{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-xs font-bold text-accent hover:underline cursor-pointer"
                >
                  سجل دخولك
                </button>
              </div>
            </motion.div>
          )}

          {mode === "forgot" && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-primary mb-2">استعادة الحساب</h2>
                <p className="text-xs text-gray-500">سوف نرسل لك رمز تحقق (OTP) لتتمكن من إعادة تعيين كلمة المرور</p>
              </div>

              {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs mb-4 font-semibold text-center">{error}</div>}

              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">البريد الإلكتروني</label>
                  <div className="relative">
                    <span className="absolute right-3.5 top-3 text-gray-400"><Mail size={18} /></span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-4 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light transition-all text-sm cursor-pointer"
                >
                  إرسال الرمز
                </button>
              </form>
            </motion.div>
          )}

          {mode === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-primary mb-2 font-sans">تفعيل الحساب (OTP)</h2>
                <p className="text-xs text-gray-500">تم إرسال رمز تفعيل مكون من 4 أرقام لبريدك الإلكتروني</p>
              </div>

              {successMsg && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs mb-4 font-semibold text-center">{successMsg}</div>}
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs mb-4 font-semibold text-center">{error}</div>}

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex justify-center gap-3 dir-ltr">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-14 h-14 bg-white border-2 border-gray-200 rounded-2xl text-center text-xl font-bold text-primary focus:outline-none focus:border-primary transition-all"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light transition-all text-sm cursor-pointer"
                >
                  التحقق والتأكيد
                </button>
              </form>

              <div className="text-center mt-6">
                <span className="text-xs text-gray-400">لم يصلك الرمز؟</span>{" "}
                <button
                  type="button"
                  onClick={() => setSuccessMsg("تم إعادة إرسال الرمز بنجاح.")}
                  className="text-xs font-bold text-accent hover:underline cursor-pointer"
                >
                  إعادة إرسال رمز التحقق
                </button>
              </div>
            </motion.div>
          )}

          {mode === "reset" && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-primary mb-2">كلمة مرور جديدة</h2>
                <p className="text-xs text-gray-500">قم بتعيين كلمة مرور قوية وجديدة لحماية حسابك المالي</p>
              </div>

              {successMsg && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs mb-4 font-semibold text-center">{successMsg}</div>}
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs mb-4 font-semibold text-center">{error}</div>}

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">كلمة المرور الجديدة</label>
                  <div className="relative">
                    <span className="absolute right-3.5 top-3 text-gray-400"><Lock size={18} /></span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-4 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">تأكيد كلمة المرور الجديدة</label>
                  <div className="relative">
                    <span className="absolute right-3.5 top-3 text-gray-400"><ShieldCheck size={18} /></span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-4 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/10 hover:bg-primary-light transition-all text-sm cursor-pointer"
                >
                  تعيين ودخول تلقائي
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Text */}
      <div className="text-center pt-4 border-t border-emerald-950/5 text-[10px] text-gray-400">
        بالتسجيل والمتابعة أنت توافق على اتفاقية استخدام منصة وازن وسياسة حماية البيانات
      </div>
    </div>
  );
}