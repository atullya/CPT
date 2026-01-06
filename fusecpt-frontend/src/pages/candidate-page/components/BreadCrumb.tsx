import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import type { Job } from "@/store/jobs/jobsTypes";

interface BreadcrumbProps {
  job: Job;
  prevParams?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ job, prevParams }) => {
  return (
    <div className="w-full h-16 px-6 flex items-center border-b border-zinc-200 bg-white shrink-0">
      <div className="flex items-center gap-2">
        <Link
          to={`/jobs${prevParams || ""}`}
          className="text-sm text-[#71717A] hover:text-[#6D28D9] transition-colors"
        >
          Job Listing
        </Link>
        <ChevronRight className="w-4 h-4 text-zinc-400" />
        <span className="text-sm text-zinc-900">
          {job?.jobTitle || "Job Details"}
        </span>
      </div>
    </div>
  );
};

export default Breadcrumb;
