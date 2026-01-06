import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { TableSort } from '../hooks/useJobFilters';

interface SortIndicatorProps {
  field: string;
  tableSort: TableSort;
  hasJobs: boolean;
}

const SortIndicator: React.FC<SortIndicatorProps> = ({ field, tableSort, hasJobs }) => {
  if (!hasJobs) {
    return <ArrowUpDown className="w-3 h-3 text-gray-400 ml-1" />;
  }

  if (tableSort.field !== field) {
    return <ArrowDown className="w-3 h-3 text-gray-400 ml-1" />;
  }

  return tableSort.direction === 'asc' ? (
    <ArrowUp className="w-3 h-3 text-gray-600 ml-1" />
  ) : (
    <ArrowDown className="w-3 h-3 text-gray-600 ml-1" />
  );
};

export default SortIndicator;