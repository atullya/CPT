import { type Job } from '@/store/jobs/jobsTypes';
import { calculateDaysSince, formatDate } from '@/utils/dateUtils';

// Re-export date functions for backward compatibility
export { calculateDaysSince, formatDate };

export const getStatusBadgeVariant = (status: Job['status']) => {
  switch (status) {
    case 'Open':
      return 'bg-[#E0F2FE] text-[#0284C7]';
    case 'OnHold':
      return 'bg-[#F1F5F9] text-[#475569]';
    case 'ClosedWon':
      return 'bg-[#DCFCE7] text-[#166534]';
    case 'ClosedLost':
      return 'bg-[#FEE2E2] text-[#991B1B]';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const getStatusDisplayText = (status: Job['status']): string => {
  switch (status) {
    case 'Open': return 'Open';
    case 'OnHold': return 'On Hold';
    case 'ClosedWon': return 'Closed Won';
    case 'ClosedLost': return 'Closed Lost';
    default: return 'Unknown';
  }
};