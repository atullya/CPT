import React from 'react';
import type { Job } from '@/store/jobs/jobsTypes';
import { getStatusDisplayText, getStatusBadgeVariant } from '../utils/jobUtils';

interface StatusBadgeProps {
  status: Job['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <div
      className={`inline-flex items-center justify-center h-6 px-2.5 rounded-lg whitespace-nowrap ${getStatusBadgeVariant(status)}`}
    >
      <span
        className="font-plus-jakarta font-semibold text-[11px] leading-[18px] tracking-normal"
      >
        {getStatusDisplayText(status)}
      </span>
    </div>
  );
};

export default StatusBadge;