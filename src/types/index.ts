export type UserRole = 'entrepreneur' | 'investor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  bio: string;
  isOnline?: boolean;
  createdAt: string;
}

export interface Entrepreneur extends User {
  role: 'entrepreneur';
  startupName: string;
  pitchSummary: string;
  fundingNeeded: string;
  industry: string;
  location: string;
  foundedYear: number;
  teamSize: number;
}

export interface Investor extends User {
  role: 'investor';
  investmentInterests: string[];
  investmentStage: string[];
  portfolioCompanies: string[];
  totalInvestments: number;
  minimumInvestment: string;
  maximumInvestment: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface CollaborationRequest {
  id: string;
  investorId: string;
  entrepreneurId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  url: string;
  ownerId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  loginWith2FA: (email: string, password: string, role: UserRole, otp: string) => Promise<void>;
  sendOTP: (email: string, password: string, role: UserRole) => Promise<string>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  date: string; // ISO date string
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
}

export interface MeetingRequest {
  id: string;
  requesterId: string;
  recipientId: string;
  date: string; // ISO date string
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  title: string;
  description?: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  requesterId: string;
  recipientId: string;
  date: string; // ISO date string
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  title: string;
  description?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'deposit' | 'withdraw' | 'transfer' | 'funding';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  senderId?: string;
  receiverId?: string;
  senderName?: string;
  receiverName?: string;
  status: TransactionStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

export interface FundingDeal {
  id: string;
  investorId: string;
  entrepreneurId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  transfer: (receiverId: string, amount: number, description?: string) => Promise<void>;
  fundDeal: (entrepreneurId: string, amount: number, description?: string) => Promise<void>;
  getTransactions: () => Transaction[];
  isLoading: boolean;
}