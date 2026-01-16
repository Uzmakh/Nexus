import React from 'react';
import { Transaction } from '../../types';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, TrendingUp, Clock, CheckCircle, XCircle, Ban } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft size={18} className="text-success-600" />;
      case 'withdraw':
        return <ArrowUpRight size={18} className="text-error-600" />;
      case 'transfer':
        return <ArrowRightLeft size={18} className="text-primary-600" />;
      case 'funding':
        return <TrendingUp size={18} className="text-accent-600" />;
      default:
        return <ArrowRightLeft size={18} />;
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-success-600" />;
      case 'pending':
        return <Clock size={16} className="text-warning-600" />;
      case 'failed':
        return <XCircle size={16} className="text-error-600" />;
      case 'cancelled':
        return <Ban size={16} className="text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const formatAmount = (amount: number, type: Transaction['type']) => {
    const sign = type === 'deposit' ? '+' : '-';
    const color = type === 'deposit' ? 'text-success-600' : 'text-gray-900';
    return (
      <span className={`font-semibold ${color}`}>
        {sign}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
      </CardHeader>
      <CardBody>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <ArrowRightLeft size={24} className="text-gray-500" />
            </div>
            <p className="text-gray-600">No transactions yet</p>
            <p className="text-sm text-gray-500 mt-1">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {transaction.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {transaction.description || `${transaction.type} transaction`}
                      </div>
                      {(transaction.senderName || transaction.receiverName) && (
                        <div className="text-xs text-gray-500 mt-1">
                          {transaction.type === 'transfer' || transaction.type === 'funding' ? (
                            <>
                              {transaction.senderName && <span>From: {transaction.senderName}</span>}
                              {transaction.receiverName && (
                                <span className="ml-2">To: {transaction.receiverName}</span>
                              )}
                            </>
                          ) : null}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {formatAmount(transaction.amount, transaction.type)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(transaction.status)}
                        <Badge variant={getStatusBadgeVariant(transaction.status)} className="ml-2">
                          {transaction.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
