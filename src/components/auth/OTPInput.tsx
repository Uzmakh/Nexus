import React, { useRef, useEffect, useState } from 'react';
import { Shield, RefreshCw } from 'lucide-react';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onResend?: () => void;
  error?: string;
  disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  onResend,
  error,
  disabled = false,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all inputs are filled
    if (newOtp.every((digit) => digit !== '') && newOtp.join('').length === length) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, length).split('');
      const newOtp = [...otp];
      
      digits.forEach((digit, index) => {
        if (index < length) {
          newOtp[index] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex((digit) => digit === '');
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
      
      // If all filled, trigger completion
      if (newOtp.every((digit) => digit !== '') && newOtp.join('').length === length) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const handleResend = () => {
    if (disabled || !onResend) return;
    setOtp(Array(length).fill(''));
    inputRefs.current[0]?.focus();
    onResend();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="p-3 bg-primary-50 rounded-full">
          <Shield size={24} className="text-primary-600" />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">
          Two-Factor Authentication
        </h3>
        <p className="text-sm text-gray-600 text-center">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`
              w-12 h-12 text-center text-lg font-semibold
              border-2 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
              transition-all duration-200
              ${error 
                ? 'border-error-500 bg-error-50' 
                : digit 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 bg-white'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-400'}
            `}
          />
        ))}
      </div>

      {error && (
        <div className="text-center">
          <p className="text-sm text-error-600">{error}</p>
        </div>
      )}

      {onResend && (
        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={disabled}
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} className="mr-1" />
            Resend code
          </button>
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Didn't receive the code? Check your spam folder or{' '}
          {onResend && (
            <button
              type="button"
              onClick={handleResend}
              disabled={disabled}
              className="text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
            >
              resend
            </button>
          )}
        </p>
      </div>
    </div>
  );
};
