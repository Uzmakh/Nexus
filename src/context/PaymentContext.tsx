import React, { createContext, useState, useContext, useEffect } from 'react';
import { PaymentContextType, Transaction, Wallet, TransactionType, TransactionStatus } from '../types';
import { useAuth } from './AuthContext';
import { findUserById } from '../data/users';
import toast from 'react-hot-toast';

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const WALLET_STORAGE_KEY = 'nexus_wallet';
const TRANSACTIONS_STORAGE_KEY = 'nexus_transactions';

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize wallet and transactions from localStorage
  useEffect(() => {
    if (user) {
      const storedWallet = localStorage.getItem(`${WALLET_STORAGE_KEY}_${user.id}`);
      const storedTransactions = localStorage.getItem(`${TRANSACTIONS_STORAGE_KEY}_${user.id}`);

      if (storedWallet) {
        setWallet(JSON.parse(storedWallet));
      } else {
        // Initialize wallet with default balance
        const defaultWallet: Wallet = {
          userId: user.id,
          balance: user.role === 'investor' ? 50000 : 1000,
          currency: 'USD',
          updatedAt: new Date().toISOString(),
        };
        setWallet(defaultWallet);
        localStorage.setItem(`${WALLET_STORAGE_KEY}_${user.id}`, JSON.stringify(defaultWallet));
      }

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        // Initialize with some sample transactions
        const sampleTransactions: Transaction[] = [
          {
            id: 'tx1',
            userId: user.id,
            type: 'deposit',
            amount: user.role === 'investor' ? 50000 : 1000,
            status: 'completed',
            description: 'Initial balance',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setTransactions(sampleTransactions);
        localStorage.setItem(`${TRANSACTIONS_STORAGE_KEY}_${user.id}`, JSON.stringify(sampleTransactions));
      }
    }
    setIsLoading(false);
  }, [user]);

  const saveWallet = (updatedWallet: Wallet) => {
    setWallet(updatedWallet);
    localStorage.setItem(`${WALLET_STORAGE_KEY}_${updatedWallet.userId}`, JSON.stringify(updatedWallet));
  };

  const saveTransactions = (updatedTransactions: Transaction[]) => {
    setTransactions(updatedTransactions);
    if (user) {
      localStorage.setItem(`${TRANSACTIONS_STORAGE_KEY}_${user.id}`, JSON.stringify(updatedTransactions));
    }
  };

  const createTransaction = (
    type: TransactionType,
    amount: number,
    status: TransactionStatus,
    senderId?: string,
    receiverId?: string,
    description?: string
  ): Transaction => {
    const sender = senderId ? findUserById(senderId) : null;
    const receiver = receiverId ? findUserById(receiverId) : null;

    return {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user?.id || '',
      type,
      amount,
      senderId,
      receiverId,
      senderName: sender?.name,
      receiverName: receiver?.name,
      status,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const deposit = async (amount: number): Promise<void> => {
    if (!user || !wallet) return;

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const transaction = createTransaction('deposit', amount, 'completed', undefined, undefined, 'Deposit to wallet');
      const updatedTransactions = [transaction, ...transactions];
      saveTransactions(updatedTransactions);

      const updatedWallet: Wallet = {
        ...wallet,
        balance: wallet.balance + amount,
        updatedAt: new Date().toISOString(),
      };
      saveWallet(updatedWallet);

      toast.success(`Successfully deposited $${amount.toLocaleString()}`);
    } catch (error) {
      toast.error('Deposit failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const withdraw = async (amount: number): Promise<void> => {
    if (!user || !wallet) return;

    setIsLoading(true);
    try {
      if (wallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const transaction = createTransaction('withdraw', amount, 'completed', undefined, undefined, 'Withdrawal from wallet');
      const updatedTransactions = [transaction, ...transactions];
      saveTransactions(updatedTransactions);

      const updatedWallet: Wallet = {
        ...wallet,
        balance: wallet.balance - amount,
        updatedAt: new Date().toISOString(),
      };
      saveWallet(updatedWallet);

      toast.success(`Successfully withdrew $${amount.toLocaleString()}`);
    } catch (error) {
      toast.error((error as Error).message || 'Withdrawal failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const transfer = async (receiverId: string, amount: number, description?: string): Promise<void> => {
    if (!user || !wallet) return;

    setIsLoading(true);
    try {
      if (wallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const receiver = findUserById(receiverId);
      if (!receiver) {
        throw new Error('Receiver not found');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const transaction = createTransaction(
        'transfer',
        amount,
        'completed',
        user.id,
        receiverId,
        description || `Transfer to ${receiver.name}`
      );
      const updatedTransactions = [transaction, ...transactions];
      saveTransactions(updatedTransactions);

      const updatedWallet: Wallet = {
        ...wallet,
        balance: wallet.balance - amount,
        updatedAt: new Date().toISOString(),
      };
      saveWallet(updatedWallet);

      toast.success(`Successfully transferred $${amount.toLocaleString()} to ${receiver.name}`);
    } catch (error) {
      toast.error((error as Error).message || 'Transfer failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fundDeal = async (entrepreneurId: string, amount: number, description?: string): Promise<void> => {
    if (!user || !wallet) return;

    if (user.role !== 'investor') {
      throw new Error('Only investors can fund deals');
    }

    setIsLoading(true);
    try {
      if (wallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const entrepreneur = findUserById(entrepreneurId);
      if (!entrepreneur) {
        throw new Error('Entrepreneur not found');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const transaction = createTransaction(
        'funding',
        amount,
        'completed',
        user.id,
        entrepreneurId,
        description || `Funding deal with ${entrepreneur.name}`
      );
      const updatedTransactions = [transaction, ...transactions];
      saveTransactions(updatedTransactions);

      const updatedWallet: Wallet = {
        ...wallet,
        balance: wallet.balance - amount,
        updatedAt: new Date().toISOString(),
      };
      saveWallet(updatedWallet);

      toast.success(`Successfully funded $${amount.toLocaleString()} to ${entrepreneur.name}`);
    } catch (error) {
      toast.error((error as Error).message || 'Funding failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactions = (): Transaction[] => {
    return transactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const value: PaymentContextType = {
    wallet,
    transactions,
    deposit,
    withdraw,
    transfer,
    fundDeal,
    getTransactions,
    isLoading,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
