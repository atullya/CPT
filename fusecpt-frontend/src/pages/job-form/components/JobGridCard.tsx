import React from 'react';
import type { Job } from '@/store/jobs/jobsTypes';
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import ClientIcon from './ClientIcon';
import { calculateDaysSince, formatDate, getStatusBadgeVariant, getStatusDisplayText } from '../utils/jobUtils';
import ThreeDotMenu from './ThreeDotMenu';

interface JobGridCardProps {
  job: Job;
  onViewJob?: (job: Job) => void;
  onEditJob?: (job: Job) => void;
  onDeleteJob?: (job: Job) => void;
}

const JobGridCard: React.FC<JobGridCardProps> = ({
  job,
  onViewJob,
  onEditJob,
  onDeleteJob
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow border border-gray-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{job.jobTitle || 'N/A'}</h3>
            <div className="flex items-center gap-2 mb-2">
              <ClientIcon size="sm" logoUrl={job.clientLogo} />
              <span className="text-sm text-gray-600">{job.clientName || 'N/A'}</span>
            </div>
          </div>
          <ThreeDotMenu
            job={job}
            onViewJob={onViewJob}
            onEditJob={onEditJob}
            onDeleteJob={onDeleteJob}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Contract Type</span>
            <span className="text-gray-900">{job.contractType || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <Badge
              variant="secondary"
              className={`text-xs ${getStatusBadgeVariant(job.status)}`}
            >
              {getStatusDisplayText(job.status)}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Candidates</span>
            <span className="text-gray-900">
              {job.activeCandidates || 0}/{job.totalCandidates || 0} active
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Created</span>
            <span className="text-gray-900">{formatDate(job.createdAt)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Lifespan</span>
            <span className="text-gray-900">{calculateDaysSince(job.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobGridCard;
