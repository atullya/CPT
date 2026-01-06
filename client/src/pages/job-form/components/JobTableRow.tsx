import React from "react";
import type { Job } from "@/store/jobs/jobsTypes";
import ClientIcon from "./ClientIcon";
import { calculateDaysSince, formatDate } from '../utils/jobUtils';
import ThreeDotMenu from "./ThreeDotMenu";
import StatusBadge from "./StatusBadge";

interface JobTableRowProps {
  job: Job;
  onViewJob?: (job: Job) => void;
  onEditJob?: (job: Job) => void;
  onDeleteJob?: (job: Job) => void;
}

const JobTableRow: React.FC<JobTableRowProps> = ({
  job,
  onViewJob,
  onEditJob,
  onDeleteJob,
}) => {
  const handleRowClick = () => {
    onViewJob?.(job);
  };

  const handleActionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <tr
      className="group bg-white hover:bg-gray-100 transition-colors h-[72px] cursor-pointer"
      onClick={handleRowClick}
    >
      <td className="px-4 py-3 font-medium text-gray-900 border-b border-[#E4E4E7] align-middle w-[246px]">
        <div className="w-[230px] h-[22px] overflow-hidden text-ellipsis whitespace-nowrap font-sans font-normal text-sm leading-[22px] text-[#18181B]">
          {job.jobTitle || "N/A"}
        </div>
      </td>
      <td className="px-4 py-3 border-b border-[#E4E4E7] align-middle w-[246px]">
        <div className="flex items-center gap-2 h-full">
          <div className="w-8 h-8 flex items-center justify-center">
            <ClientIcon
              size="md"
              logoUrl={job.clientLogo}
              clientName={job.clientName}
            />
          </div>
          <span className="w-[129px] h-[22px] overflow-hidden text-ellipsis whitespace-nowrap font-sans font-normal text-sm leading-[22px] text-[#18181B]">
            {job.clientName || "N/A"}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-gray-700 border-b border-[#E4E4E7] align-middle w-[114px]">
        <div className="w-[98px] h-[22px] overflow-hidden text-ellipsis whitespace-nowrap font-sans font-normal text-sm leading-[22px] text-[#18181B]">
          {job.contractType || "N/A"}
        </div>
      </td>
      <td className="px-4 py-3 border-b border-[#E4E4E7] align-middle w-[110px]">
        <div className="flex items-center">
          <StatusBadge status={job.status} />
        </div>
      </td>
      <td className="px-4 py-3 text-center text-gray-700 border-b border-[#E4E4E7] align-middle w-[130px]">
        <div className="w-[114px] h-[22px] mx-auto font-sans font-normal text-sm leading-[22px] text-[#18181B]">
          {job.totalCandidates || 0}
        </div>
      </td>
      <td className="px-4 py-3 text-center text-gray-700 border-b border-[#E4E4E7] align-middle w-[140px]">
        <div className="w-[124px] h-[22px] mx-auto font-sans font-normal text-sm leading-[22px] text-[#18181B]">
          {job.activeCandidates || 0}
        </div>
      </td>
      <td className="px-4 py-3 text-gray-700 border-b border-[#E4E4E7] align-middle w-[131px]">
        <div className="w-[115px] h-[22px] font-sans font-normal text-sm leading-[22px] text-[#18181B]">
          {formatDate(job.createdAt)}
        </div>
      </td>
      <td className="px-4 py-3 text-gray-700 border-b border-[#E4E4E7] align-middle w-[130px]">
        <div className="w-[114px] h-[22px] font-sans font-normal text-sm leading-[22px] text-[#18181B]">
          {formatDate(job.updatedAt)}
        </div>
      </td>
      <td className="px-4 py-3 text-gray-700 border-b border-[#E4E4E7] align-middle w-[200px]">
        <div className="w-[184px] h-[22px] font-sans font-normal text-sm leading-[22px] text-[#18181B]">
          {calculateDaysSince(job.createdAt)}
        </div>
      </td>
      <td className="px-4 py-3 text-gray-700 border-b border-[#E4E4E7] align-middle w-[200px]">
        <div className="w-[184px] h-[22px] font-sans font-normal text-sm leading-[22px] text-[#18181B]">
          {calculateDaysSince(job.updatedAt)}
        </div>
      </td>
      <td
        className="text-center sticky right-0 z-30 w-[52px] h-[72px] border-l border-b border-[#E4E4E7] px-[2px] align-middle bg-white group-hover:bg-gray-100 transition-colors"
        onClick={handleActionsClick}
      >
        <div
          className="absolute -left-px top-0 bottom-0 w-[10px] pointer-events-none"
          style={{
            boxShadow:
              "-4px 0px 6px -4px #0000001A, -10px 0px 15px -3px #0000001A",
          }}
        />

        <div className="flex items-center justify-center w-full h-full gap-2">
          <ThreeDotMenu
            job={job}
            onViewJob={onViewJob}
            onEditJob={onEditJob}
            onDeleteJob={onDeleteJob}
          />
        </div>
      </td>
    </tr>
  );
};

export default JobTableRow;
