import React, { useState } from "react";
import {
  EllipsisVertical,
  BriefcaseBusiness,
  Clock3,
  Users,
  Columns3,
  Building,
  Pencil,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import type { Job } from "@/store/jobs/jobsTypes";

interface JobHeaderProps {
  job: Job;
  activeTab: "overview" | "pipeline";
  onTabChange: (tab: "overview" | "pipeline") => void;
  totalCandidates?: number;
  onEdit: () => void;
  onDelete: () => void;
}

const JobHeader: React.FC<JobHeaderProps> = ({
  job,
  activeTab,
  onTabChange,
  totalCandidates,
  onEdit,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="w-full h-[151px] flex flex-col gap-2 shrink-0">

      <div className="w-full flex justify-between items-center ">
        <div className="flex items-center gap-3">
          {job?.clientLogo && !imageError ? (
            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
              <img
                src={job.clientLogo}
                alt="Client logo"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
              <Building className="w-4 h-4 text-gray-600" />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-semibold text-[#18181B]">
                {job?.jobTitle || "Untitled Job"}
              </span>

              {(() => {
                const status = job?.status || "Open";
                const normalizedStatus = status.toLowerCase().replace(/[-\s]/g, "");

                let label = "Open";
                let className = "bg-[#E0F2FE] text-[#0284C7]";

                if (normalizedStatus === "onhold") {
                  label = "On Hold";
                  className = "bg-[#F1F5F9] text-[#475569]";
                } else if (normalizedStatus === "closedwon") {
                  label = "Closed Won";
                  className = "bg-[#DCFCE7] text-[#166534]";
                } else if (normalizedStatus === "closedlost") {
                  label = "Closed Lost";
                  className = "bg-[#FEE2E2] text-[#991B1B]";
                }

                return (
                  <span className={`px-2 h-6 rounded-lg text-[12px] font-semibold flex items-center justify-center ${className}`}>
                    {label}
                  </span>
                );
              })()}
            </div>

            <div className="flex items-center gap-3 text-sm text-[#71717A]">

              <div className="flex items-center gap-1">
                <BriefcaseBusiness className="w-4 h-4" />
                <span>{job?.clientName || "Unknown Client"}</span>
              </div>

              <span>·</span>

              <div className="flex items-center gap-1">
                <Clock3 className="w-4 h-4" />
                <span>{job?.contractType || "N/A"}</span>
              </div>

              <span>·</span>

              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{totalCandidates !== undefined ? totalCandidates : (job?.totalCandidates || 0)} candidates</span>
              </div>

            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg border border-zinc-200 p-0.5 bg-white transition-colors outline-none cursor-pointer data-[state=open]:bg-[#FFFFFF1A] data-[state=open]:border-[#E4E4E7]">
              <EllipsisVertical className="w-5 h-5 text-zinc-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[128px] p-[5px] flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white shadow-sm"
          >
            <DropdownMenuItem
              onClick={onEdit}
              className="w-[118px] h-[36px] px-2 py-2 flex items-center gap-2 cursor-pointer hover:bg-zinc-100 focus:bg-zinc-100 data-[highlighted]:bg-zinc-100 rounded-md outline-none"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <Pencil className="w-5 h-5 text-zinc-950" />
              </div>
              <span className="text-[14px] font-medium text-zinc-950 leading-tight">
                Edit
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="w-[118px] h-[36px] px-2 py-2 flex items-center gap-2 cursor-pointer hover:bg-red-50 focus:bg-red-50 data-[highlighted]:bg-red-50 rounded-md outline-none"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <Trash className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-[14px] font-medium text-red-600 leading-tight">
                Delete
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full flex items-center gap-4 mt-2">
        <div className="w-[368px] h-9 bg-[#F4F4F5] rounded-lg p-[3px] flex gap-2">

          <button
            onClick={() => onTabChange("overview")}
            className={`w-[130px] h-[30px] flex items-center gap-1.5 px-1 rounded-lg transition-all cursor-pointer ${activeTab === "overview"
              ? "bg-white shadow-sm border-b border-gray-200"
              : "text-[#18181B] hover:bg-gray-200/50"
              }`}
          >
            <BriefcaseBusiness className="w-4 h-4" />
            <span className="text-[14px] font-semibold">Job Overview</span>
          </button>

          <button
            onClick={() => onTabChange("pipeline")}
            className={`w-[232px] h-[30px] flex items-center gap-1.5 px-1 rounded-lg transition-all cursor-pointer ${activeTab === "pipeline"
              ? "bg-white shadow-sm border-b border-gray-200"
              : "text-[#18181B] hover:bg-gray-200/50"
              }`}
          >
            <Columns3 className="w-4 h-4" />
            <span className="text-[14px] font-semibold">
              Candidate Interview Pipeline
            </span>
          </button>

        </div>
      </div>

    </div>
  );
};

export default JobHeader; 