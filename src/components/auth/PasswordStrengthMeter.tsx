import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password, 
  showRequirements = true 
}) => {
  const calculateStrength = (pwd: string): PasswordStrength => {
    if (pwd.length === 0) return 'weak';
    
    let strength = 0;
    
    // Length check
    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'fair';
    if (strength <= 5) return 'good';
    return 'strong';
  };

  const getRequirements = (pwd: string): PasswordRequirement[] => {
    return [
      {
        label: 'At least 8 characters',
        met: pwd.length >= 8,
      },
      {
        label: 'Contains lowercase letter',
        met: /[a-z]/.test(pwd),
      },
      {
        label: 'Contains uppercase letter',
        met: /[A-Z]/.test(pwd),
      },
      {
        label: 'Contains number',
        met: /[0-9]/.test(pwd),
      },
      {
        label: 'Contains special character',
        met: /[^a-zA-Z0-9]/.test(pwd),
      },
    ];
  };

  const strength = calculateStrength(password);
  const requirements = getRequirements(password);

  const getStrengthColor = (strengthLevel: PasswordStrength) => {
    switch (strengthLevel) {
      case 'weak':
        return 'bg-error-500';
      case 'fair':
        return 'bg-warning-500';
      case 'good':
        return 'bg-blue-500';
      case 'strong':
        return 'bg-success-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthText = (strengthLevel: PasswordStrength) => {
    switch (strengthLevel) {
      case 'weak':
        return 'Weak';
      case 'fair':
        return 'Fair';
      case 'good':
        return 'Good';
      case 'strong':
        return 'Strong';
      default:
        return '';
    }
  };

  const getStrengthWidth = (strengthLevel: PasswordStrength) => {
    switch (strengthLevel) {
      case 'weak':
        return '25%';
      case 'fair':
        return '50%';
      case 'good':
        return '75%';
      case 'strong':
        return '100%';
      default:
        return '0%';
    }
  };

  if (password.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">Password Strength</span>
          <span className={`text-xs font-semibold ${
            strength === 'weak' ? 'text-error-600' :
            strength === 'fair' ? 'text-warning-600' :
            strength === 'good' ? 'text-blue-600' :
            'text-success-600'
          }`}>
            {getStrengthText(strength)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
            style={{ width: getStrengthWidth(strength) }}
          />
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-1.5">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center text-xs">
              {req.met ? (
                <CheckCircle size={14} className="text-success-600 mr-2 flex-shrink-0" />
              ) : (
                <XCircle size={14} className="text-gray-400 mr-2 flex-shrink-0" />
              )}
              <span className={req.met ? 'text-gray-700' : 'text-gray-500'}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
