import React from 'react';
import { Building2, CircleDollarSign } from 'lucide-react';
import { UserRole } from '../../types';
import { Badge } from '../ui/Badge';

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ 
  role, 
  showIcon = true,
  size = 'md'
}) => {
  const roleConfig = {
    entrepreneur: {
      label: 'Entrepreneur',
      icon: <Building2 size={14} />,
      color: 'primary' as const,
    },
    investor: {
      label: 'Investor',
      icon: <CircleDollarSign size={14} />,
      color: 'accent' as const,
    },
  };

  const config = roleConfig[role];

  return (
    <Badge variant={config.color} size={size}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
};
