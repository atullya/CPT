import React from 'react';
import { Button } from "@/components/ui/Button";
//import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LayoutGrid, LayoutList, ChevronDown } from 'lucide-react';
import type { ViewMode } from '../hooks/useJobFilters';

interface JobViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const JobViewToggle: React.FC<JobViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-lg  bg-white p-1">
        <button
          className={`p-1.5 rounded transition-colors ${view === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          onClick={() => onViewChange('grid')}
        >
          <LayoutGrid className="w-4 h-4 text-gray-600" />
        </button>
        <button
          className={`p-1.5 rounded transition-colors ${view === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          onClick={() => onViewChange('list')}
        >
          <LayoutList className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center gap-2 bg-[#ffffff]">
        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">Sort by:</span>
        <Button
          variant="outline"
          disabled
          className="h-9 px-3 flex items-center gap-2 border border-gray-300 rounded-lg bg-[#ffffff] hover:bg-[#ffffff]"
        >
          <span className="text-sm font-semibold text-gray-[#18181B]">Last Modified</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default JobViewToggle;
