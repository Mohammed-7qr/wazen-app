/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WalletType = 'cash' | 'bank' | 'credit' | 'digital';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  walletId: string;
  date: string;
  notes?: string;
  isRecurring: boolean;
  attachment?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  warningThreshold: number; // e.g. 80 for 80%
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'savings' | 'debt' | 'emergency' | 'investment';
  milestones: Milestone[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number; // Current progress value
  target: number; // Target progress value
  deadline: string;
  rewardXp: number;
  status: 'active' | 'completed';
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  xpValue: number;
  badge: string; // Emoji or icon name
  unlockedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'alert' | 'reminder' | 'achievement' | 'challenge' | 'general';
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  budgetStreak: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  currency: string;
  timezone: string;
  dateFormat: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}
