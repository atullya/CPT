"use client";

import React, { useMemo } from "react";
import {
  MapPin,
  Clock3,
  CloudSun,
  Hourglass,
  PencilLine,
  Link2,
} from "lucide-react";
import type { Job } from "@/store/jobs/jobsTypes";
import { Card } from "@/components/ui/Card";
import { useGetJobByIdQuery } from "@/store/jobs/jobsApi";
import { ActivityItemDisplay } from "./ActivityItem";
import { formatDate, getDaysSince } from "../../utils/jobUtils";
import { processJobHistory, type ActivityItem } from "../../utils/activityUtils";

interface TimelineCardProps {
  value: string;
  label: React.ReactNode;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ value, label }) => (
  <div className="w-[187px] h-full flex flex-col items-center justify-center gap-2">
    <span className="text-[16px] font-semibold text-[#18181B] text-center leading-6">
      {value}
    </span>
    <span className="text-[14px] text-[#71717A] text-center leading-[22px]">
      {label}
    </span>
  </div>
);

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-1 w-[224px] shrink-0">
      <Icon className="w-4 h-4 text-[#71717A]" />
      <span className="text-[14px] text-[#71717A] leading-[22px]">{label}</span>
    </div>
    <span className="text-[14px] font-semibold text-[#18181B] truncate max-w-[500px] leading-[22px]">
      {value || "N/A"}
    </span>
  </div>
);

interface JobOverviewProps {
  job?: Job;
}

const JobOverview: React.FC<JobOverviewProps> = ({ job: initialJob }) => {
  const jobId = initialJob?.id || (initialJob as any)?._id;

  const {
    data: fetchedJob,
    isLoading,
    error,
  } = useGetJobByIdQuery(jobId as string, { skip: !jobId });

  const job = (fetchedJob as Job | undefined) || initialJob;
  const history = (fetchedJob?.history as any[]) || [];

  const loading = isLoading && !job;

  const activities = useMemo(() => {
    if (!job || !history.length) return [];
    return processJobHistory(job, history);
  }, [job, history]);

  if (!jobId) return <div className="p-4">No job id provided.</div>;
  if (loading) return <div className="p-4">Loading job…</div>;
  if (error) return <div className="p-4 text-red-500">Error loading job.</div>;
  if (!job) return <div className="p-4">Job not found.</div>;

  return (
    <div className="w-full flex-1 min-h-0 flex border border-zinc-200 rounded bg-white">
      {/* LEFT */}
      <div className="w-[796px] h-full flex flex-col gap-2 px-6 pb-6 pt-2 shrink-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-semibold text-[#18181B] leading-6">
            Timeline
          </h3>
          <div className="flex w-[748px] h-[108px] bg-[#FAFAFA] rounded-lg overflow-hidden">
            <TimelineCard
              value={formatDate(job?.createdAt)}
              label="Created Date"
            />
            <TimelineCard
              value={formatDate(job?.updatedAt)}
              label="Modified Date"
            />
            <TimelineCard
              value={getDaysSince(job?.createdAt)}
              label={
                <>
                  Job Lifespan <br /> Since Created
                </>
              }
            />
            <TimelineCard
              value={getDaysSince(job?.updatedAt)}
              label={
                <>
                  Job Lifespan <br /> Since Modified
                </>
              }
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-[16px] font-semibold text-[#18181B] leading-6">
            Basic Information
          </h3>
          <Card className="w-full h-[228px] p-6 rounded-lg bg-white shadow-none flex flex-col justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 w-[224px] shrink-0">
                <Link2 className="w-4 h-4 text-[#71717A]" />
                <span className="text-[14px] text-[#71717A] leading-[22px]">
                  Job Description URL
                </span>
              </div>
              <a
                href={job?.jobDescription || "#"}
                className="text-[14px] font-semibold text-[#6D28D9] truncate hover:underline max-w-[500px] leading-[22px]"
                target="_blank"
                rel="noreferrer"
              >
                {job?.jobDescription || "No URL provided"}
              </a>
            </div>

            <InfoRow
              icon={MapPin}
              label="Region"
              value={
                job?.region && job.region.length > 0
                  ? job.region.join(", ")
                  : job?.searchRegion
              }
            />
            <InfoRow
              icon={Clock3}
              label="Client Timezone"
              value={job?.clientTimezone}
            />
            <InfoRow
              icon={CloudSun}
              label="Overlap Requirement"
              value={job?.overlapRequirement}
            />
            <InfoRow
              icon={Hourglass}
              label="Minimum Years of Experience"
              value={
                job?.minimumExperience
                  ? `${job.minimumExperience} Years`
                  : undefined
              }
            />
            <InfoRow icon={PencilLine} label="Remarks" value={job?.remarks} />
          </Card>
        </div>
      </div>

      <div className="w-[396px] border-l border-zinc-200 bg-white flex flex-col shrink-0 h-full overflow-hidden">
        <div className="px-6 pb-6 pt-2 flex flex-col gap-2 shrink-0">
          <h3 className="text-[14px] font-semibold text-[#18181B] leading-[22px]">
            Activity History
          </h3>
        </div>

        <div className="flex-1 px-6 pb-6 overflow-y-scroll scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex flex-col gap-2">
            {activities.map((activity: ActivityItem, index: number) => (
              <ActivityItemDisplay
                key={activity.id + index}
                activity={activity}
                isLast={index === activities.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOverview;
