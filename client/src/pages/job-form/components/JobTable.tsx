import React from "react";
import type { Job } from "@/store/jobs/jobsTypes";
import type { TableSort, SortField } from "../hooks/useJobFilters";
import JobTableRow from "./JobTableRow";
import SortIndicator from "./SortIndicator";

interface JobTableProps {
  jobs: Job[];
  tableSort: TableSort;
  onSort: (field: SortField) => void;

  onViewJob?: (job: Job) => void;
  onEditJob?: (job: Job) => void;
  onDeleteJob?: (job: Job) => void;
}

const JobTable: React.FC<JobTableProps> = ({
  jobs,
  tableSort,
  onSort,
  onViewJob,
  onEditJob,
  onDeleteJob,
}) => {
  const hasJobs = jobs.length > 0;

  const columns = [
    { key: "jobTitle" as SortField, label: "Job Title", sortable: true },
    { key: "clientName" as SortField, label: "Client Name", sortable: true },
    {
      key: "contractType" as SortField,
      label: "Contract Type",
      sortable: false,
    },
    { key: "status" as SortField, label: "Status", sortable: false },
    {
      key: "totalCandidates" as SortField,
      label: "Total Candidates",
      sortable: false,
      center: true,
    },
    {
      key: "activeCandidates" as SortField,
      label: "Active Candidates",
      sortable: false,
      center: true,
    },
    { key: "createdAt" as SortField, label: "Created Date", sortable: true },
    { key: "updatedAt" as SortField, label: "Modified Date", sortable: true },
    {
      key: "lifespanCreated",
      label: "Job Lifespan Since Created",
      sortable: false,
    },
    {
      key: "lifespanModified",
      label: "Job Lifespan Since Modified",
      sortable: false,
    },
    { key: "actions", label: "", sortable: false, center: true },
  ];

  const getTableHeight = () => {
    const headerHeight = 36;
    const rowHeight = 72;
    const borderHeight = 2;
    const maxVisibleRows = 10;
    const scrollbarWidth = 10;

    const totalHeight =
      headerHeight + maxVisibleRows * rowHeight + borderHeight + scrollbarWidth;

    return `${totalHeight}px`;
  };

  return (
    <div
      className="rounded-lg w-full max-w-full"
      style={{
        height: getTableHeight(),
        borderRadius: "8px",
        border: "1px solid #E4E4E7",
        borderTop: "1px solid #E4E4E7",
        opacity: 1,
        overflowX: "auto",
        overflowY: jobs.length > 10 ? "auto" : "hidden",
      }}
    >
      <table className="w-full text-sm text-left">
        <thead
          className="border-b border-gray-200 sticky top-0 z-10"
          style={{ backgroundColor: "#F5F3FF", height: "36px" }}
        >
          <tr>
            {columns.map(({ key, label, sortable, center }) => (
              <th
                key={key}
                className={`px-4 whitespace-nowrap ${sortable
                    ? "cursor-pointer hover:opacity-80 transition-opacity"
                    : "cursor-default"
                  } ${center ? "text-center" : ""} ${key === "actions" ? "sticky right-0 z-10" : ""
                  }`}
                onClick={sortable ? () => onSort(key as SortField) : undefined}
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "22px",
                  letterSpacing: "0px",
                  color: "#18181B",
                  backgroundColor: key === "actions" ? "#F5F3FF" : "inherit",
                  width: key === "actions" ? "52px" : "auto",
                }}
              >
                <div
                  className={`flex items-center ${center ? "justify-center" : ""
                    }`}
                >
                  {label}
                  {sortable && (
                    <SortIndicator
                      field={key}
                      tableSort={tableSort}
                      hasJobs={hasJobs}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <JobTableRow
              key={job.id}
              job={job}
              onViewJob={onViewJob}
              onEditJob={onEditJob}
              onDeleteJob={onDeleteJob}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
