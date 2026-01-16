import React, { useState } from 'react';
import { usePayment } from '../../context/PaymentContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TransactionHistory } from '../../components/payment/TransactionHistory';
import { Wallet, ArrowDownCircle, ArrowUpCircle, ArrowRightLeft, DollarSign, CreditCard, Building2 } from 'lucide-react';
import { entrepreneurs, investors } from '../../data/users';
import toast from 'react-hot-toast';

export const PaymentPage: React.FC = () => {
  const { user } = useAuth();
  const { wallet, deposit, withdraw, transfer, getTransactions, isLoading } = usePayment();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [amount, setAmount] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [description, setDescription] = useState('');

  const transactions = getTransactions();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await deposit(depositAmount);
      setAmount('');
    } catch (error) {
      // Error is already handled in the context
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await withdraw(withdrawAmount);
      setAmount('');
    } catch (error) {
      // Error is already handled in the context
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const transferAmount = parseFloat(amount);
    
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!receiverId) {
      toast.error('Please select a receiver');
      return;
    }

    try {
      await transfer(receiverId, transferAmount, description || undefined);
      setAmount('');
      setReceiverId('');
      setDescription('');
    } catch (error) {
      // Error is already handled in the context
    }
  };

  // Get available users for transfer (excluding current user)
  const availableUsers = user?.role === 'investor' 
    ? entrepreneurs.filter(e => e.id !== user.id)
    : investors.filter(i => i.id !== user.id);

  const quickAmounts = [100, 500, 1000, 5000];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment & Wallet</h1>
        <p className="text-gray-600">Manage your wallet balance and transactions</p>
      </div>

      {/* Wallet Balance Card */}
      {wallet && (
        <Card className="bg-gradient-to-br from-primary-500 to-accent-500 text-white border-0 shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium mb-1">Wallet Balance</p>
                <h2 className="text-4xl font-bold mb-2">
                  ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <p className="text-primary-100 text-sm">{wallet.currency}</p>
              </div>
              <div className="p-4 bg-white/20 rounded-full">
                <Wallet size={32} />
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Payment Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deposit/Withdraw/Transfer Forms */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex space-x-1 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'deposit'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <ArrowDownCircle size={18} className="mr-2" />
                    Deposit
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'withdraw'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <ArrowUpCircle size={18} className="mr-2" />
                    Withdraw
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('transfer')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'transfer'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <ArrowRightLeft size={18} className="mr-2" />
                    Transfer
                  </div>
                </button>
              </div>
            </CardHeader>
            <CardBody>
              {/* Deposit Form */}
              {activeTab === 'deposit' && (
                <form onSubmit={handleDeposit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deposit Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={18} className="text-gray-500" />
                      </div>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="pl-10"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <button
                          key={quickAmount}
                          type="button"
                          onClick={() => setAmount(quickAmount.toString())}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          ${quickAmount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <CreditCard size={18} className="text-blue-600 mr-2 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Simulated Payment</p>
                        <p className="text-xs">This is a mock transaction. No real money will be transferred.</p>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" fullWidth isLoading={isLoading} leftIcon={<ArrowDownCircle size={18} />}>
                    Deposit Funds
                  </Button>
                </form>
              )}

              {/* Withdraw Form */}
              {activeTab === 'withdraw' && (
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Withdrawal Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={18} className="text-gray-500" />
                      </div>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="pl-10"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    {wallet && (
                      <p className="mt-1 text-xs text-gray-500">
                        Available: ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <button
                          key={quickAmount}
                          type="button"
                          onClick={() => setAmount(quickAmount.toString())}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          ${quickAmount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <CreditCard size={18} className="text-blue-600 mr-2 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Simulated Withdrawal</p>
                        <p className="text-xs">This is a mock transaction. No real money will be transferred.</p>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" fullWidth isLoading={isLoading} leftIcon={<ArrowUpCircle size={18} />}>
                    Withdraw Funds
                  </Button>
                </form>
              )}

              {/* Transfer Form */}
              {activeTab === 'transfer' && (
                <form onSubmit={handleTransfer} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transfer To
                    </label>
                    <select
                      value={receiverId}
                      onChange={(e) => setReceiverId(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    >
                      <option value="">Select a user...</option>
                      {availableUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} {user.role === 'entrepreneur' ? `(${(user as any).startupName})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transfer Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={18} className="text-gray-500" />
                      </div>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="pl-10"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    {wallet && (
                      <p className="mt-1 text-xs text-gray-500">
                        Available: ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <Input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a note..."
                    />
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <CreditCard size={18} className="text-blue-600 mr-2 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Simulated Transfer</p>
                        <p className="text-xs">This is a mock transaction. No real money will be transferred.</p>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" fullWidth isLoading={isLoading} leftIcon={<ArrowRightLeft size={18} />}>
                    Transfer Funds
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Info Card */}
        <div>
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Building2 size={20} className="text-primary-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Mock Payment System</h3>
                    <p className="text-xs text-gray-600">
                      All transactions are simulated for demonstration purposes. No real money is involved.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Deposit funds to wallet</li>
                    <li>• Withdraw funds from wallet</li>
                    <li>• Transfer to other users</li>
                    <li>• View transaction history</li>
                    {user?.role === 'investor' && <li>• Fund deals with entrepreneurs</li>}
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <TransactionHistory transactions={transactions} />
    </div>
  );
};
