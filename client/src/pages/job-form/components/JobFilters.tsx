import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, Plus } from "lucide-react";
export type JobStatusTab = "open" | "on-hold" | "closed-won" | "closed-lost";
interface JobFiltersProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  activeTab: JobStatusTab; 
  onTabChange: (tab: JobStatusTab) => void;
  onCreateJob: () => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onCreateJob,
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Debounce search input to avoid too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange]);

  return (
    <div className="flex items-center justify-between w-full">
      <div
        className="w-80 h-9 min-h-9 py-1.5 px-0.5 rounded-lg border border-zinc-200 bg-white"
        style={{ boxShadow: "0px 1px 2px 0px #0000000D" }}
      >
        <div className="w-[296px] h-[21px] flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <Search className="w-4 h-4 text-zinc-500" />
          </div>

          <div className="w-[268px] h-[22px]">
            <Input
              type="text"
              placeholder="Search by job title or client name"
              className="w-full h-full border-0 p-0 bg-transparent font-plus-jakarta text-sm text-zinc-500 focus-visible:ring-0 focus-visible:outline-none shadow-none"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button
        variant="purple"
        className="w-[126.25px] h-[37px] min-h-9 py-1.5 px-1 rounded-lg gap-2 ml-auto"
        onClick={onCreateJob}
      >
        <Plus className="h-4 w-4" /> Create Job
      </Button>
    </div>
  );
};

export default JobFilters;
