import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { usePayment } from '../../context/PaymentContext';
import { useAuth } from '../../context/AuthContext';
import { Entrepreneur } from '../../types';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FundingDealProps {
  entrepreneur: Entrepreneur;
  onSuccess?: () => void;
}

export const FundingDeal: React.FC<FundingDealProps> = ({ entrepreneur, onSuccess }) => {
  const { user } = useAuth();
  const { wallet, fundDeal, isLoading } = usePayment();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.role !== 'investor') {
      toast.error('Only investors can fund deals');
      return;
    }

    const fundingAmount = parseFloat(amount);
    
    if (isNaN(fundingAmount) || fundingAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (wallet && wallet.balance < fundingAmount) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      await fundDeal(entrepreneur.id, fundingAmount, description || undefined);
      setAmount('');
      setDescription('');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is already handled in the context
    }
  };

  const suggestedAmounts = [1000, 5000, 10000, 25000];

  return (
    <Card className="border-2 border-primary-200">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="flex items-center">
          <div className="p-2 bg-primary-100 rounded-lg mr-3">
            <TrendingUp size={20} className="text-primary-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Fund Deal</h3>
            <p className="text-sm text-gray-600">Invest in {entrepreneur.startupName}</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {wallet && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Available Balance:</span>
              <span className="text-lg font-semibold text-gray-900">
                ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Funding Amount
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
              {suggestedAmounts.map((suggested) => (
                <button
                  key={suggested}
                  type="button"
                  onClick={() => setAmount(suggested.toString())}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  ${suggested.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note about this investment..."
            />
          </div>

          {wallet && amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > wallet.balance && (
            <div className="flex items-start p-3 bg-error-50 border border-error-200 rounded-lg">
              <AlertCircle size={18} className="text-error-600 mr-2 mt-0.5" />
              <div className="text-sm text-error-700">
                <p className="font-medium">Insufficient Balance</p>
                <p className="text-xs mt-1">
                  You need ${(parseFloat(amount) - wallet.balance).toLocaleString()} more to complete this transaction.
                </p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
            leftIcon={<TrendingUp size={18} />}
          >
            Fund Deal
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
