/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, ArrowRightLeft, PieChart, Target, User, Sparkles, Plus, X, 
  Menu, LogIn, Bell, HelpCircle, AlertCircle, Info, Landmark, CreditCard, ChevronLeft, Check, BookOpen,
  Trophy
} from "lucide-react";

// Imports from our modular components
import Splash from "./components/Splash";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import TransactionsPage from "./components/TransactionsPage";
import BudgetPage from "./components/BudgetPage";
import ReportsPage from "./components/ReportsPage";
import GoalsPage from "./components/GoalsPage";
import ChallengesPage from "./components/ChallengesPage";
import WalletsPage from "./components/WalletsPage";
import ProfilePage from "./components/ProfilePage";
import LearnPage from "./components/LearnPage";
import { CelebrationEffect } from "./components/CelebrationEffect";

import { Wallet, Transaction, Budget, Goal, Challenge, Achievement, UserProfile, AppSettings } from "./types";

// Default Pre-seeded Rich Arabic Data
const DEFAULT_WALLETS: Wallet[] = [
  { id: "w-1", name: "الحساب البنكي الرئيسي", type: "bank", balance: 1800 },
  { id: "w-2", name: "محفظة STC Pay الرقمية", type: "digital", balance: 1450 },
  { id: "w-3", name: "نقدي / كاش الجيب", type: "cash", balance: 0 }
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  // July 2025
  { id: "t-1", type: "income", amount: 9000, category: "راتب", walletId: "w-1", date: "2025-07-10", notes: "راتب شهر يوليو الأساسي لعام ٢٠٢٥", isRecurring: true },
  { id: "t-2", type: "expense", amount: 1250, category: "تسوق ومشتريات", walletId: "w-1", date: "2025-07-15", notes: "مقاضي ومستلزمات منزلية شهريّة", isRecurring: false },
  { id: "t-3", type: "expense", amount: 380, category: "مطاعم ومقاهي", walletId: "w-2", date: "2025-07-22", notes: "عشاء مع العائلة في نهاية الأسبوع", isRecurring: false },

  // August 2025
  { id: "t-4", type: "income", amount: 9000, category: "راتب", walletId: "w-1", date: "2025-08-01", notes: "راتب شهر أغسطس الأساسي لعام ٢٠٢٥", isRecurring: true },
  { id: "t-5", type: "expense", amount: 1400, category: "تسوق ومشتريات", walletId: "w-1", date: "2025-08-12", notes: "شراء أغذية ومستلزمات السوبرماركت", isRecurring: false },
  { id: "t-6", type: "expense", amount: 500, category: "نقل ومواصلات", walletId: "w-1", date: "2025-08-25", notes: "تعبئة وقود وتنقّل وصيانة دورية", isRecurring: false },

  // September 2025
  { id: "t-7", type: "income", amount: 9000, category: "راتب", walletId: "w-1", date: "2025-09-01", notes: "راتب شهر سبتمبر الأساسي لعام ٢٠٢٥", isRecurring: true },
  { id: "t-8", type: "expense", amount: 1100, category: "تسوق ومشتريات", walletId: "w-1", date: "2025-09-10", notes: "فاتورة مستلزمات المنزل والمطبخ", isRecurring: false },
  { id: "t-9", type: "expense", amount: 300, category: "فواتير وخدمات", walletId: "w-1", date: "2025-09-18", notes: "سداد فاتورة الهاتف المحمول والإنترنت", isRecurring: false },

  // October 2025
  { id: "t-10", type: "income", amount: 9500, category: "راتب", walletId: "w-1", date: "2025-10-01", notes: "راتب شهر أكتوبر الأساسي مع علاوة", isRecurring: true },
  { id: "t-11", type: "expense", amount: 1600, category: "تسوق ومشتريات", walletId: "w-1", date: "2025-10-15", notes: "سوبرماركت ومستلزمات أسبوعية", isRecurring: false },
  { id: "t-12", type: "expense", amount: 450, category: "مطاعم ومقاهي", walletId: "w-2", date: "2025-10-22", notes: "وجبات عائلية وتوصيل", isRecurring: false },

  // November 2025
  { id: "t-13", type: "income", amount: 9500, category: "راتب", walletId: "w-1", date: "2025-11-01", notes: "راتب شهر نوفمبر الأساسي لعام ٢٠٢٥", isRecurring: true },
  { id: "t-14", type: "expense", amount: 1300, category: "تسوق ومشتريات", walletId: "w-1", date: "2025-11-12", notes: "مقاضي البقالة الكبيرة للمطبخ", isRecurring: false },
  { id: "t-15", type: "expense", amount: 280, category: "نقل ومواصلات", walletId: "w-2", date: "2025-11-24", notes: "وقود سيارة للعمل", isRecurring: false },

  // December 2025
  { id: "t-16", type: "income", amount: 9500, category: "راتب", walletId: "w-1", date: "2025-12-01", notes: "راتب شهر ديسمبر الأساسي لعام ٢٠٢٥", isRecurring: true },
  { id: "t-17", type: "expense", amount: 2100, category: "تسوق ومشتريات", walletId: "w-1", date: "2025-12-14", notes: "شراء أدوات منزلية وملابس الشتاء", isRecurring: false },
  { id: "t-18", type: "expense", amount: 350, category: "مطاعم ومقاهي", walletId: "w-2", date: "2025-12-25", notes: "قهوة ومطاعم في العطلة", isRecurring: false },

  // January 2026
  { id: "t-19", type: "income", amount: 10000, category: "راتب", walletId: "w-1", date: "2026-01-01", notes: "راتب شهر يناير الأساسي لعام ٢٠٢٦", isRecurring: true },
  { id: "t-20", type: "expense", amount: 1200, category: "تسوق ومشتريات", walletId: "w-1", date: "2026-01-10", notes: "مقاضي سوبرماركت بداية العام", isRecurring: false },
  { id: "t-21", type: "expense", amount: 1150, category: "فواتير وخدمات", walletId: "w-1", date: "2026-01-20", notes: "سداد تأمين السيارة السنوي", isRecurring: false },

  // February 2026
  { id: "t-22", type: "income", amount: 10000, category: "راتب", walletId: "w-1", date: "2026-02-01", notes: "راتب شهر فبراير الأساسي لعام ٢٠٢٦", isRecurring: true },
  { id: "t-23", type: "expense", amount: 1450, category: "تسوق ومشتريات", walletId: "w-1", date: "2026-02-12", notes: "أغراض البقالة والمنزل", isRecurring: false },
  { id: "t-24", type: "expense", amount: 400, category: "نقل ومواصلات", walletId: "w-2", date: "2026-02-22", notes: "صيانة دورية خفيفة وبنزين", isRecurring: false },

  // March 2026
  { id: "t-25", type: "income", amount: 10000, category: "راتب", walletId: "w-1", date: "2026-03-01", notes: "راتب شهر مارس الأساسي لعام ٢٠٢٦", isRecurring: true },
  { id: "t-26", type: "expense", amount: 2200, category: "تسوق ومشتريات", walletId: "w-1", date: "2026-03-11", notes: "مقاضي شهر رمضان المبارك كاملة", isRecurring: false },
  { id: "t-27", type: "expense", amount: 320, category: "مطاعم ومقاهي", walletId: "w-2", date: "2026-03-25", notes: "وجبات إفطار وسحور خارجية", isRecurring: false },

  // April 2026
  { id: "t-28", type: "income", amount: 10500, category: "راتب", walletId: "w-1", date: "2026-04-01", notes: "راتب شهر أبريل ومكافأة الأداء المتميز", isRecurring: true },
  { id: "t-29", type: "expense", amount: 2500, category: "تسوق ومشتريات", walletId: "w-1", date: "2026-04-09", notes: "ملابس ومستلزمات عيد الفطر السعيد", isRecurring: false },
  { id: "t-30", type: "expense", amount: 600, category: "مطاعم ومقاهي", walletId: "w-2", date: "2026-04-20", notes: "احتفالات ووجبات عيد الفطر مع الأقارب", isRecurring: false },

  // May 2026
  { id: "t-31", type: "income", amount: 10000, category: "راتب", walletId: "w-1", date: "2026-05-01", notes: "راتب شهر مايو الأساسي لعام ٢٠٢٦", isRecurring: true },
  { id: "t-32", type: "expense", amount: 1350, category: "تسوق ومشتريات", walletId: "w-1", date: "2026-05-14", notes: "مقاضي التموين الشهرية للمنزل", isRecurring: false },
  { id: "t-33", type: "expense", amount: 420, category: "فواتير وخدمات", walletId: "w-1", date: "2026-05-24", notes: "فاتورة الكهرباء والخدمات لارتفاع الصيف", isRecurring: false },

  // June 2026
  { id: "t-34", type: "income", amount: 10000, category: "راتب", walletId: "w-1", date: "2026-06-01", notes: "راتب شهر يونيو الأساسي لعام ٢٠٢٦", isRecurring: true },
  { id: "t-35", type: "expense", amount: 3100, category: "تسوق ومشتريات", walletId: "w-1", date: "2026-06-12", notes: "حجز طيران وفندق لإجازة الصيف العائلية", isRecurring: false },
  { id: "t-36", type: "expense", amount: 500, category: "نقل ومواصلات", walletId: "w-2", date: "2026-06-25", notes: "بنزين وتجهيز السيارة للسفر البري", isRecurring: false },

  // July 2026
  { id: "t-37", type: "income", amount: 10000, category: "راتب", walletId: "w-1", date: "2026-07-01", notes: "راتب شهر يوليو الأساسي لعام ٢٠٢٦", isRecurring: true },
  { id: "t-38", type: "expense", amount: 2450, category: "تسوق ومشتريات", walletId: "w-1", date: "2026-07-10", notes: "سوبر ماركت ومقاضي المنزل الأساسية لشهر يوليو", isRecurring: false },
  { id: "t-39", type: "expense", amount: 85, category: "مطاعم ومقاهي", walletId: "w-2", date: "2026-07-15", notes: "قهوة مختصة وغداء مع الأصدقاء", isRecurring: false }
];

const DEFAULT_BUDGETS: Budget[] = [
  { id: "b-1", category: "مطاعم ومقاهي", limit: 1000, spent: 450, warningThreshold: 80 },
  { id: "b-2", category: "تسوق ومشتريات", limit: 3000, spent: 2450, warningThreshold: 85 },
  { id: "b-3", category: "نقل ومواصلات", limit: 500, spent: 120, warningThreshold: 80 }
];

const DEFAULT_GOALS: Goal[] = [
  { 
    id: "g-1", 
    title: "صندوق الطوارئ العائلي", 
    targetAmount: 10000, 
    currentAmount: 3250, 
    deadline: "2026-12-31", 
    category: "emergency",
    milestones: [
      { id: "gm-1", title: "توفير أول ١,٠٠٠ ريال", completed: true },
      { id: "gm-2", title: "تفعيل الاستقطاع التلقائي", completed: true },
      { id: "gm-3", title: "بلوغ نصف الهدف المالي", completed: false }
    ]
  },
  { 
    id: "g-2", 
    title: "رحلة عمرة وسياحة", 
    targetAmount: 5000, 
    currentAmount: 1800, 
    deadline: "2026-10-15", 
    category: "savings",
    milestones: [
      { id: "gm-4", title: "حجز السكن المبدئي", completed: true },
      { id: "gm-5", title: "ادخار ٢,٥٠٠ ريال", completed: false }
    ]
  }
];

const DEFAULT_CHALLENGES: Challenge[] = [
  { id: "c-1", title: "تحدي الادخار الذكي", description: "ادخر ٢٠٪ من دخلك المالي هذا الشهر لمدة ٣٠ يوماً متتالية.", progress: 60, target: 100, deadline: "متبقي ١٠ أيام", rewardXp: 150, status: "active", category: "savings" },
  { id: "c-2", title: "تحدي ضبط الميزانية", description: "الالتزام بسقف الميزانية المحددة لمدة ٤ أسابيع متتالية دون تجاوز.", progress: 40, target: 100, deadline: "متبقي ١٨ يوماً", rewardXp: 200, status: "active", category: "budget" },
  { id: "c-3", title: "تحدي تقليل المصاريف", description: "قلل من نفقات المطاعم والمقاهي غير الضرورية لمدة أسبوعين.", progress: 100, target: 100, deadline: "جاهز للاستلام 🎁", rewardXp: 100, status: "active", category: "expense" }
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "a-1", title: "الحصالة الذهبية", description: "جمعت أول ١,٠٠٠ ريال سعودي في حسابك الادخاري المخصص.", unlocked: true, xpValue: 100, badge: "💰" },
  { id: "a-2", title: "حامي الميزانية", description: "أكملت أسبوعاً كاملاً متواصلاً دون تجاوز أي سقف مالي.", unlocked: true, xpValue: 150, badge: "🛡️" },
  { id: "a-3", title: "خبير وازن", description: "حصلت على تقييم مالي متكامل أعلى من ٩٠/١٠٠ من المستشار الذكي.", unlocked: false, xpValue: 300, badge: "🎓" },
  { id: "a-4", title: "صديق المحفظة", description: "قمت بتحويل وتوزيع مالي منضبط بين أكثر من ٣ محافظ نشطة.", unlocked: false, xpValue: 100, badge: "📱" }
];

export const getXpThresholdForLevel = (level: number): number => {
  if (level === 1) return 10;
  if (level === 2) return 50;
  if (level === 3) return 100;
  if (level === 4) return 150;
  return 50;
};

const DEFAULT_PROFILE: UserProfile = {
  name: "عبد الرحمن محمد",
  email: "abdo@exmple.com",
  avatarUrl: "",
  level: 1,
  xp: 0,
  xpToNextLevel: 10,
  budgetStreak: 5
};

export default function App() {
  // Navigation & Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // App core states
  const [wallets, setWallets] = useState<Wallet[]>(DEFAULT_WALLETS);
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(DEFAULT_BUDGETS);
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [challenges, setChallenges] = useState<Challenge[]>(DEFAULT_CHALLENGES);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Level up celebration popup state
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number, newLevel: number } | null>(null);
  const prevLevelRef = React.useRef<number | undefined>(undefined);
  const isLoadedRef = React.useRef<boolean>(false);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    if (!isAuthenticated) {
      prevLevelRef.current = userProfile.level;
      return;
    }
    if (prevLevelRef.current !== undefined && userProfile.level > prevLevelRef.current) {
      setLevelUpData({
        oldLevel: prevLevelRef.current,
        newLevel: userProfile.level
      });
    }
    prevLevelRef.current = userProfile.level;
  }, [userProfile.level, isAuthenticated]);

  // Toast notifications states & effects
  interface ToastMessage {
    id: string;
    category: string;
    percentage: number; // 80 or 90
    spent: number;
    limit: number;
  }

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const prevBudgetsRef = React.useRef<Budget[]>([]);
  const isInitialLoadRef = React.useRef(true);

  const triggerToast = (category: string, percentage: number, spent: number, limit: number) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, category, percentage, spent, limit }]);
    
    // Auto remove after 6 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      prevBudgetsRef.current = budgets;
      return;
    }

    if (isInitialLoadRef.current) {
      prevBudgetsRef.current = budgets;
      isInitialLoadRef.current = false;
      return;
    }

    const prevBudgets = prevBudgetsRef.current;

    budgets.forEach(b => {
      const prevB = prevBudgets.find(pb => pb.id === b.id || pb.category === b.category);
      const ratio = b.limit > 0 ? b.spent / b.limit : 0;
      const prevRatio = prevB ? (prevB.limit > 0 ? prevB.spent / prevB.limit : 0) : 0;

      // Check 90%
      if (ratio >= 0.9) {
        if (!prevB || prevRatio < 0.9) {
          triggerToast(b.category, 90, b.spent, b.limit);
        }
      }
      // Check 80%
      else if (ratio >= 0.8) {
        if (!prevB || prevRatio < 0.8) {
          triggerToast(b.category, 80, b.spent, b.limit);
        }
      }
    });

    prevBudgetsRef.current = budgets;
  }, [budgets, isAuthenticated]);

  // Quick Action Modal states
  const [quickAddType, setQuickAddType] = useState<'income' | 'expense' | null>(null);
  const [quickAmount, setQuickAmount] = useState("");
  const [quickCategory, setQuickCategory] = useState("مطاعم ومقاهي");
  const [quickWalletId, setQuickWalletId] = useState("");
  const [quickNotes, setQuickNotes] = useState("");

  // Load persisted state from local storage on startup
  useEffect(() => {
    const savedState = localStorage.getItem("wazen_financial_state_v1");
    let initialLevel = DEFAULT_PROFILE.level;
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setWallets(parsed.wallets || DEFAULT_WALLETS);
        
        // Ensure that if the user doesn't have 2025-2026 historical data, we load/seed it for them to see reports
        const loadedTransactions = parsed.transactions || DEFAULT_TRANSACTIONS;
        const has2025Data = loadedTransactions.some((t: any) => t.date && t.date.startsWith("2025"));
        if (!has2025Data || loadedTransactions.length < 10) {
          setTransactions(DEFAULT_TRANSACTIONS);
        } else {
          setTransactions(loadedTransactions);
        }

        setBudgets(parsed.budgets || DEFAULT_BUDGETS);
        setGoals(parsed.goals || DEFAULT_GOALS);
        setChallenges(parsed.challenges || DEFAULT_CHALLENGES);
        setAchievements(parsed.achievements || DEFAULT_ACHIEVEMENTS);
        const profile = parsed.userProfile || DEFAULT_PROFILE;
        setUserProfile(profile);
        initialLevel = profile.level;
        setIsAuthenticated(parsed.isAuthenticated || false);
        setShowSplash(parsed.showSplash !== undefined ? parsed.showSplash : true);
      } catch (err) {
        console.error("Stale local storage format, using defaults.", err);
      }
    }
    prevLevelRef.current = initialLevel;
    isLoadedRef.current = true;
  }, []);

  // Sync state to local storage whenever values change
  useEffect(() => {
    const stateToSave = {
      wallets,
      transactions,
      budgets,
      goals,
      challenges,
      achievements,
      userProfile,
      isAuthenticated,
      showSplash
    };
    localStorage.setItem("wazen_financial_state_v1", JSON.stringify(stateToSave));
  }, [wallets, transactions, budgets, goals, challenges, achievements, userProfile, isAuthenticated, showSplash]);

  // Handle Authentication Success
  const handleAuthSuccess = (data: { name: string; email: string }) => {
    setUserProfile(prev => ({
      ...prev,
      name: data.name,
      email: data.email
    }));
    setIsAuthenticated(true);
    setShowSplash(false);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowSplash(true);
  };

  const handleResetAllData = () => {
    setWallets(DEFAULT_WALLETS);
    setTransactions(DEFAULT_TRANSACTIONS);
    setBudgets(DEFAULT_BUDGETS);
    setGoals(DEFAULT_GOALS);
    setChallenges(DEFAULT_CHALLENGES);
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setUserProfile(DEFAULT_PROFILE);
    setIsAuthenticated(false);
    setShowSplash(true);
    localStorage.removeItem("wazen_financial_state_v1");
  };

  // Full Export to JSON Back-up
  const handleExportData = () => {
    const fullBackup = {
      wallets,
      transactions,
      budgets,
      goals,
      challenges,
      achievements,
      userProfile
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Wazen_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Full Import from JSON Restore
  const handleImportData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.wallets && parsed.transactions) {
        setWallets(parsed.wallets);
        setTransactions(parsed.transactions);
        if (parsed.budgets) setBudgets(parsed.budgets);
        if (parsed.goals) setGoals(parsed.goals);
        if (parsed.challenges) setChallenges(parsed.challenges);
        if (parsed.achievements) setAchievements(parsed.achievements);
        if (parsed.userProfile) setUserProfile(parsed.userProfile);
      }
    } catch (e) {
      alert("الملف المرفوع غير صالح للتهيئة أو منسق بشكل خاطئ.");
    }
  };

  // TRANSACTION CRUD Handlers
  const handleAddTransaction = (newT: Omit<Transaction, "id">) => {
    const tId = `t-${Date.now()}`;
    const transaction: Transaction = { id: tId, ...newT };
    setTransactions(prev => [transaction, ...prev]);

    // Apply amount changes on target wallet
    setWallets(prevWallets => prevWallets.map(w => {
      if (w.id === transaction.walletId) {
        const adjustment = transaction.type === 'income' ? transaction.amount : -transaction.amount;
        return { ...w, balance: Math.max(0, w.balance + adjustment) };
      }
      return w;
    }));

    // Update corresponding budget spent amount
    if (transaction.type === 'expense') {
      setBudgets(prevBudgets => prevBudgets.map(b => {
        if (b.category === transaction.category) {
          return { ...b, spent: b.spent + transaction.amount };
        }
        return b;
      }));
    }

    // Award immediate 10 XP points for active entry
    awardXpPoints(10);
  };

  const handleEditTransaction = (id: string, updated: Partial<Transaction>) => {
    const oldT = transactions.find(t => t.id === id);
    if (!oldT) return;

    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));

    // Reverse old wallet adjustment and apply new wallet adjustment
    const walletIdToAdjust = updated.walletId || oldT.walletId;
    const oldAmt = oldT.amount;
    const newAmt = updated.amount !== undefined ? updated.amount : oldAmt;
    const oldType = oldT.type;
    const newType = updated.type || oldType;

    setWallets(prevWallets => prevWallets.map(w => {
      let balance = w.balance;
      // Undo old transaction
      if (w.id === oldT.walletId) {
        balance += oldType === 'income' ? -oldAmt : oldAmt;
      }
      // Apply new transaction
      if (w.id === walletIdToAdjust) {
        balance += newType === 'income' ? newAmt : -newAmt;
      }
      return { ...w, balance: Math.max(0, balance) };
    }));

    // Re-calculate budget spend
    if (oldT.type === 'expense') {
      setBudgets(prev => prev.map(b => {
        if (b.category === oldT.category) {
          return { ...b, spent: Math.max(0, b.spent - oldAmt) };
        }
        return b;
      }));
    }
    if (newType === 'expense') {
      const finalCat = updated.category || oldT.category;
      setBudgets(prev => prev.map(b => {
        if (b.category === finalCat) {
          return { ...b, spent: b.spent + newAmt };
        }
        return b;
      }));
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const target = transactions.find(t => t.id === id);
    if (!target) return;

    setTransactions(prev => prev.filter(t => t.id !== id));

    // Reverse financial adjustments
    setWallets(prev => prev.map(w => {
      if (w.id === target.walletId) {
        const reverseAmt = target.type === 'income' ? -target.amount : target.amount;
        return { ...w, balance: Math.max(0, w.balance + reverseAmt) };
      }
      return w;
    }));

    if (target.type === 'expense') {
      setBudgets(prev => prev.map(b => {
        if (b.category === target.category) {
          return { ...b, spent: Math.max(0, b.spent - target.amount) };
        }
        return b;
      }));
    }
  };

  // BUDGET CRUD Handlers
  const handleAddBudget = (newB: Omit<Budget, "id">) => {
    // Check if category budget already exists
    const exists = budgets.find(b => b.category === newB.category);
    if (exists) {
      handleEditBudget(exists.id, { limit: newB.limit });
      return;
    }

    // Pre-calculate spent from existing transactions of this month
    const currentSpent = transactions
      .filter(t => t.type === 'expense' && t.category === newB.category)
      .reduce((sum, t) => sum + t.amount, 0);

    const budget: Budget = {
      id: `b-${Date.now()}`,
      category: newB.category,
      limit: newB.limit,
      spent: currentSpent,
      warningThreshold: newB.warningThreshold
    };

    setBudgets(prev => [...prev, budget]);
    awardXpPoints(20);
  };

  const handleEditBudget = (id: string, updated: Partial<Budget>) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const handleBulkAddBudgets = (newB: Omit<Budget, "id">[]) => {
    setBudgets(prev => {
      const categoriesToReplace = newB.map(nb => nb.category);
      const filtered = prev.filter(b => !categoriesToReplace.includes(b.category));
      
      const added = newB.map((nb, idx) => {
        const currentSpent = transactions
          .filter(t => t.type === 'expense' && t.category === nb.category)
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          id: `b-${Date.now()}-${idx}`,
          category: nb.category,
          limit: nb.limit,
          spent: currentSpent,
          warningThreshold: nb.warningThreshold
        };
      });
      
      return [...filtered, ...added];
    });
    awardXpPoints(40);
  };

  // GOAL CRUD Handlers
  const handleAddGoal = (newG: Omit<Goal, "id">) => {
    const goal: Goal = {
      id: `g-${Date.now()}`,
      ...newG
    };
    setGoals(prev => [...prev, goal]);
    awardXpPoints(30);
  };

  const handleEditGoal = (id: string, updated: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updated } : g));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // WALLET CRUD Handlers
  const handleAddWallet = (newW: Omit<Wallet, "id">) => {
    const wallet: Wallet = {
      id: `w-${Date.now()}`,
      ...newW
    };
    setWallets(prev => [...prev, wallet]);
    awardXpPoints(15);
  };

  const handleEditWallet = (id: string, updated: Partial<Wallet>) => {
    setWallets(prev => prev.map(w => w.id === id ? { ...w, ...updated } : w));
  };

  const handleDeleteWallet = (id: string) => {
    if (wallets.length <= 1) {
      alert("يجب إبقاء محفظة مالية واحدة على الأقل مسجلة بالتطبيق.");
      return;
    }
    setWallets(prev => prev.filter(w => w.id !== id));
  };

  const handleWalletTransfer = (fromId: string, toId: string, amount: number) => {
    setWallets(prev => prev.map(w => {
      if (w.id === fromId) {
        return { ...w, balance: Math.max(0, w.balance - amount) };
      }
      if (w.id === toId) {
        return { ...w, balance: w.balance + amount };
      }
      return w;
    }));

    // Register dummy transaction of the transfer
    const fromName = wallets.find(w => w.id === fromId)?.name || "محفظة";
    const toName = wallets.find(w => w.id === toId)?.name || "محفظة";

    const tIdOut = `t-${Date.now()}-out`;
    const tIdIn = `t-${Date.now()}-in`;

    const outTrans: Transaction = {
      id: tIdOut,
      type: "expense",
      amount,
      category: "تحويل بين المحافظ",
      walletId: fromId,
      date: new Date().toISOString().split('T')[0],
      notes: `تحويل صادر إلى ${toName}`,
      isRecurring: false
    };

    const inTrans: Transaction = {
      id: tIdIn,
      type: "income",
      amount,
      category: "تحويل بين المحافظ",
      walletId: toId,
      date: new Date().toISOString().split('T')[0],
      notes: `تحويل وارد من ${fromName}`,
      isRecurring: false
    };

    setTransactions(prev => [outTrans, inTrans, ...prev]);
    awardXpPoints(25);
  };

  // Gamified challenges claim handler
  const handleClaimReward = (challengeId: string, xpReward: number) => {
    setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, status: 'completed' } : c));
    awardXpPoints(xpReward);
  };

  // XP progression system
  const awardXpPoints = (points: number) => {
    setUserProfile(prev => {
      let newXp = prev.xp + points;
      let newLevel = prev.level;
      let nextThreshold = getXpThresholdForLevel(newLevel);

      let leveledUp = false;
      while (newXp >= nextThreshold) {
        newXp -= nextThreshold;
        newLevel += 1;
        nextThreshold = getXpThresholdForLevel(newLevel);
        leveledUp = true;
      }

      if (leveledUp) {
        // Unlock an achievement for level up
        setAchievements(prevAch => prevAch.map(a => {
          if (a.id === "a-3") {
            return { ...a, unlocked: true }; // Unlock higher qualification
          }
          return a;
        }));
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        xpToNextLevel: nextThreshold
      };
    });
  };

  // Quick Action Form Submission
  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAmount || parseFloat(quickAmount) <= 0) return;

    handleAddTransaction({
      type: quickAddType || 'expense',
      amount: parseFloat(quickAmount),
      category: quickCategory,
      walletId: quickWalletId || wallets[0].id,
      date: new Date().toISOString().split('T')[0],
      notes: quickNotes,
      isRecurring: false
    });

    setQuickAddType(null);
  };

  const handleOpenQuickAdd = (type: 'income' | 'expense') => {
    setQuickAddType(type);
    setQuickAmount("");
    setQuickCategory(type === 'expense' ? 'مطاعم ومقاهي' : 'راتب');
    setQuickWalletId(wallets[0]?.id || "");
    setQuickNotes("");
  };

  return (
    <div className="min-h-screen bg-islamic-pattern pb-12 select-none rtl font-sans">
      <AnimatePresence mode="wait">
        {/* Step 1: Splash Welcoming Screen */}
        {showSplash && !isAuthenticated && (
          <Splash 
            onStart={() => setShowSplash(false)} 
            onLoginClick={() => setShowSplash(false)} 
          />
        )}

        {/* Step 2: Auth Screens (Login / Register / Recover) */}
        {!showSplash && !isAuthenticated && (
          <Auth 
            onSuccess={handleAuthSuccess} 
            onBackToSplash={() => setShowSplash(true)} 
          />
        )}

        {/* Step 3: Main Layout App */}
        {isAuthenticated && (
          <div className="max-w-md mx-auto bg-background-soft min-h-screen relative flex flex-col justify-between overflow-x-hidden">
            {/* Top Branding Header Applet */}
            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-emerald-950/5 px-4.5 py-3 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center font-bold text-white text-base">
                  و
                </div>
                <div>
                  <h1 className="text-sm font-black text-primary font-sans leading-tight">وازن</h1>
                  <span className="text-[9px] text-gray-400 font-medium tracking-wide">الاستقرار المالي الشخصي</span>
                </div>
              </div>

              {/* Status information */}
              <div className="flex items-center gap-3">
                {/* Active Level Badge */}
                <div 
                  onClick={() => setActiveTab('challenges')}
                  className="flex items-center gap-1 bg-accent/20 px-2 py-1 rounded-full border border-accent/15 cursor-pointer hover:bg-accent/30 transition-all text-[9px] font-bold text-emerald-950"
                >
                  <span>🏆 مستوى {userProfile.level}</span>
                </div>
                
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-950/5 font-sans">
                  {wallets.reduce((sum, w) => sum + w.balance, 0).toLocaleString('ar-SA')} ر.س
                </span>
              </div>
            </header>

            {/* Main scrollable body tab routers */}
            <main className="flex-1 p-4 overflow-y-auto">
              {activeTab === "dashboard" && (
                <Dashboard 
                  wallets={wallets} 
                  transactions={transactions} 
                  challenges={challenges}
                  goals={goals}
                  userProfile={userProfile}
                  onNavigateToTab={setActiveTab}
                  onAddTransactionQuick={handleOpenQuickAdd}
                  onOpenAiAdvisor={() => setActiveTab('reports')}
                />
              )}

              {activeTab === "transactions" && (
                <TransactionsPage 
                  transactions={transactions} 
                  wallets={wallets}
                  onAddTransaction={handleAddTransaction}
                  onEditTransaction={handleEditTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              )}

              {activeTab === "budgets" && (
                <BudgetPage 
                  budgets={budgets}
                  onAddBudget={handleAddBudget}
                  onEditBudget={handleEditBudget}
                  onDeleteBudget={handleDeleteBudget}
                  onBulkAddBudgets={handleBulkAddBudgets}
                  totalIncome={transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0)}
                />
              )}

              {activeTab === "reports" && (
                <ReportsPage 
                  transactions={transactions} 
                  wallets={wallets} 
                  budgets={budgets}
                  goals={goals}
                  userProfile={userProfile}
                />
              )}

              {activeTab === "goals" && (
                <GoalsPage 
                  goals={goals}
                  onAddGoal={handleAddGoal}
                  onEditGoal={handleEditGoal}
                  onDeleteGoal={handleDeleteGoal}
                />
              )}

              {activeTab === "challenges" && (
                <ChallengesPage 
                  challenges={challenges}
                  achievements={achievements}
                  userProfile={userProfile}
                  onClaimReward={handleClaimReward}
                />
              )}

              {activeTab === "wallets" && (
                <WalletsPage 
                  wallets={wallets}
                  onAddWallet={handleAddWallet}
                  onEditWallet={handleEditWallet}
                  onDeleteWallet={handleDeleteWallet}
                  onTransfer={handleWalletTransfer}
                />
              )}

              {activeTab === "learn" && (
                <LearnPage 
                  onAwardXp={awardXpPoints}
                />
              )}

              {activeTab === "profile" && (
                <ProfilePage 
                  userProfile={userProfile}
                  onUpdateProfile={(name, email) => setUserProfile(p => ({ ...p, name, email }))}
                  onLogout={handleLogout}
                  onExportData={handleExportData}
                  onImportData={handleImportData}
                  onResetAllData={handleResetAllData}
                />
              )}
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-emerald-950/5 px-3 py-2.5 flex justify-around items-center shadow-lg z-30">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  activeTab === "dashboard" ? "text-primary scale-105" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Home size={18} className={activeTab === "dashboard" ? "stroke-[2.5px]" : ""} />
                <span className="text-[9px] font-bold">الرئيسية</span>
              </button>

              <button
                onClick={() => setActiveTab("transactions")}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  activeTab === "transactions" ? "text-primary scale-105" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <ArrowRightLeft size={18} className={activeTab === "transactions" ? "stroke-[2.5px]" : ""} />
                <span className="text-[9px] font-bold">المعاملات</span>
              </button>

              {/* Floating Center Action Indicator */}
              <button
                onClick={() => handleOpenQuickAdd('expense')}
                className="w-12 h-12 bg-primary hover:bg-primary-light text-white rounded-2xl flex items-center justify-center shadow-md shadow-primary/25 cursor-pointer transform -translate-y-4 border-2 border-white transition-all active:scale-95"
              >
                <Plus size={22} />
              </button>

              <button
                onClick={() => setActiveTab("reports")}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  activeTab === "reports" ? "text-primary scale-105" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <PieChart size={18} className={activeTab === "reports" ? "stroke-[2.5px]" : ""} />
                <span className="text-[9px] font-bold">التقارير</span>
              </button>

              <button
                onClick={() => setActiveTab("learn")}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  activeTab === "learn" ? "text-primary scale-105" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <BookOpen size={18} className={activeTab === "learn" ? "stroke-[2.5px]" : ""} />
                <span className="text-[9px] font-bold">تعلم</span>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  activeTab === "profile" ? "text-primary scale-105" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <User size={18} className={activeTab === "profile" ? "stroke-[2.5px]" : ""} />
                <span className="text-[9px] font-bold">حسابي</span>
              </button>
            </nav>

            {/* Floating Sidebar Options for Tablets/Desktops in Preview */}
            <div className="absolute left-[-160px] top-24 hidden lg:flex flex-col gap-2.5 bg-white p-4 rounded-3xl border border-gray-100 shadow-xl w-36 text-right">
              <span className="text-[10px] font-bold text-gray-400 border-b border-gray-50 pb-1 block">وصول سريع لمنافذ وازن</span>
              <button onClick={() => setActiveTab('budgets')} className={`text-[11px] py-1 text-right font-bold hover:text-primary ${activeTab === 'budgets' ? 'text-primary' : 'text-gray-500'}`}>الميزانيات</button>
              <button onClick={() => setActiveTab('wallets')} className={`text-[11px] py-1 text-right font-bold hover:text-primary ${activeTab === 'wallets' ? 'text-primary' : 'text-gray-500'}`}>المحافظ</button>
              <button onClick={() => setActiveTab('challenges')} className={`text-[11px] py-1 text-right font-bold hover:text-primary ${activeTab === 'challenges' ? 'text-primary' : 'text-gray-500'}`}>التحديات والـ XP</button>
              <button onClick={() => setActiveTab('goals')} className={`text-[11px] py-1 text-right font-bold hover:text-primary ${activeTab === 'goals' ? 'text-primary' : 'text-gray-500'}`}>الأهداف المالية</button>
              <button onClick={() => setActiveTab('learn')} className={`text-[11px] py-1 text-right font-bold hover:text-primary ${activeTab === 'learn' ? 'text-primary' : 'text-gray-500'}`}>تعلم المالية 📚</button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Center Quick-Add modal */}
      <AnimatePresence>
        {quickAddType && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickAddType(null)}
              className="fixed inset-0 bg-black z-40"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 m-auto max-w-sm h-fit bg-white rounded-3xl shadow-2xl z-50 overflow-hidden text-right p-6 border border-gray-100"
            >
              <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 mb-4">
                <h3 className="text-sm font-bold text-emerald-950">
                  {quickAddType === 'expense' ? "تسجيل مصروف سريع 💸" : "تسجيل إيداع سريع 💰"}
                </h3>
                <button onClick={() => setQuickAddType(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleQuickAddSubmit} className="space-y-4">
                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500">القيمة بالريال السعودي</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    autoFocus
                    placeholder="0.00"
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold font-sans text-emerald-950 focus:outline-none focus:border-primary text-center"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500">الفئة</label>
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {quickAddType === "expense" 
                      ? ["مطاعم ومقاهي", "تسوق ومشتريات", "فواتير كهرباء وإنترنت", "نقل ومواصلات", "ترفيه وألعاب", "أخرى"].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))
                      : ["راتب", "عمل مستقل", "تحويل وارد", "أخرى"].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))
                    }
                  </select>
                </div>

                {/* Wallet select */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500">المحفظة المستخدمة</label>
                  <select
                    value={quickWalletId}
                    onChange={(e) => setQuickWalletId(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {wallets.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                {/* Quick notes */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500">ملاحظات سريعة (اختياري)</label>
                  <input
                    type="text"
                    placeholder="مثال: بقالة اليوم..."
                    value={quickNotes}
                    onChange={(e) => setQuickNotes(e.target.value)}
                    className="w-full pl-3 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary text-right"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all text-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check size={14} />
                  <span>تأكيد وتسجيل الحركة</span>
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Level Up Celebration Popup */}
      <AnimatePresence>
        {levelUpData && (
          <>
            {/* Dark green ambient blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLevelUpData(null)}
              className="fixed inset-0 bg-emerald-950/70 backdrop-blur-md z-[100000] cursor-pointer"
            />
            
            {/* Confetti particles */}
            <CelebrationEffect duration={4500} />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 m-auto max-w-sm bg-white border-2 border-accent/40 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(210,162,76,0.25)] p-6 z-[100001] text-center text-gray-900 flex flex-col gap-5 items-center rtl overflow-hidden"
            >
              {/* Premium shining background aura */}
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-accent/15 to-transparent -z-10 pointer-events-none" />

              {/* Glowing ring and trophy container */}
              <div className="relative mt-2">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl scale-125 animate-pulse" />
                <motion.div 
                  animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1.1, 1] }}
                  transition={{ repeat: Infinity, repeatDelay: 3, duration: 1.5 }}
                  className="w-20 h-20 bg-gradient-to-br from-accent to-amber-500 rounded-3xl flex items-center justify-center text-white border-4 border-white shadow-xl relative"
                >
                  <Trophy size={38} className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] animate-bounce" />
                </motion.div>
                {/* Floating mini stars */}
                <div className="absolute -top-2 -right-2 text-xl animate-bounce" style={{ animationDelay: "200ms" }}>✨</div>
                <div className="absolute -bottom-1 -left-2 text-lg animate-bounce" style={{ animationDelay: "500ms" }}>🌟</div>
              </div>

              {/* Title & Level Indicator */}
              <div className="space-y-1.5 w-full">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  ترقية جديدة ومكافأة متميزة! 👑
                </span>
                <h2 className="text-2xl font-black text-emerald-950 mt-3 leading-tight">
                  مبارك عبدالرحمن!
                </h2>
                <p className="text-sm font-medium text-gray-500">
                  لقد ارتقيت رسمياً إلى <span className="text-emerald-800 font-extrabold font-sans">المستوى {levelUpData.newLevel}</span>
                </p>
              </div>

              {/* Level Benefits / Features unlocked */}
              <div className="w-full bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/40 text-right space-y-2.5">
                <h4 className="text-xs font-black text-emerald-900">المزايا الجديدة المكتسبة:</h4>
                <ul className="text-xs text-emerald-950 space-y-2">
                  <li className="flex items-center gap-2 justify-end">
                    <span>زيادة سعة المحافظ الاستثمارية لمرونة أعلى</span>
                    <span className="text-accent font-bold">✓</span>
                  </li>
                  <li className="flex items-center gap-2 justify-end">
                    <span>مستوى ميزانية أكثر صرامة (+أوسمة شرفية)</span>
                    <span className="text-accent font-bold">✓</span>
                  </li>
                  <li className="flex items-center gap-2 justify-end">
                    <span>علامة العضوية الذهبية مكللة بتاج مستوى {levelUpData.newLevel}</span>
                    <span className="text-accent font-bold">✓</span>
                  </li>
                </ul>
              </div>

              {/* Interactive Encouraging message */}
              <p className="text-xs text-gray-500 leading-relaxed max-w-[90%]">
                انضباطك المالي هو المحرك الحقيقي لوازن. استمر في تسجيل حركاتك اليومية للوصول للمستويات القادمة وتحقيق الاستقلال المالي!
              </p>

              {/* Dismiss / Continue button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLevelUpData(null)}
                className="w-full py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold rounded-2xl text-xs cursor-pointer shadow-lg shadow-emerald-950/15 flex items-center justify-center gap-1.5 border border-emerald-900 mt-1"
              >
                <span>متابعة رحلتي المالية 🚀</span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notifications Layer */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-[360px] px-4 pointer-events-none flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`pointer-events-auto w-full p-4 rounded-2xl border shadow-xl flex flex-col gap-2.5 text-right ${
                toast.percentage === 90 
                  ? "bg-rose-50/95 border-rose-200 text-rose-950 backdrop-blur-md" 
                  : "bg-amber-50/95 border-amber-200 text-amber-950 backdrop-blur-md"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Dismiss button */}
                <button
                  onClick={() => dismissToast(toast.id)}
                  className={`p-1 rounded-lg cursor-pointer transition-colors ${
                    toast.percentage === 90 
                      ? "text-rose-400 hover:text-rose-600 hover:bg-rose-100/50" 
                      : "text-amber-400 hover:text-amber-600 hover:bg-amber-100/50"
                  }`}
                >
                  <X size={14} />
                </button>

                {/* Toast content */}
                <div className="flex-1 flex gap-2.5 items-start justify-end">
                  <div className="text-right">
                    <h4 className="text-xs font-black">
                      {toast.percentage === 90 
                        ? `تنبيه حرج: سقف ميزانية ${toast.category}` 
                        : `تنبيه ميزانية: فئة ${toast.category}`}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                      لقد استهلكت <span className="font-bold font-sans">{toast.percentage}%</span> من حد الميزانية المخصص لهذه الفئة.
                    </p>
                  </div>
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    toast.percentage === 90 ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                  }`}>
                    <AlertCircle size={16} />
                  </div>
                </div>
              </div>

              {/* Progress Indicator and spending numbers */}
              <div className="space-y-1.5 mt-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 font-sans">
                  <span>{(toast.spent).toLocaleString('ar-SA')} ر.س</span>
                  <span>من {(toast.limit).toLocaleString('ar-SA')} ر.س</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      toast.percentage === 90 ? "bg-rose-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(100, (toast.spent / toast.limit) * 100)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
