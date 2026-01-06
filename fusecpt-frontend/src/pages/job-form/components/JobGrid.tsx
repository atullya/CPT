import React from 'react';
import type { Job } from '@/store/jobs/jobsTypes';
import JobGridCard from './JobGridCard';

interface JobGridProps {
  jobs: Job[];
  onDeleteJob?: (job: Job) => void;
  onViewJob?: (job: Job) => void;
  onEditJob?: (job: Job) => void;
}

const JobGrid: React.FC<JobGridProps> = ({ 
  jobs, 
  onDeleteJob,
  onViewJob,
  onEditJob 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobGridCard 
          key={job.id} 
          job={job}
          onDeleteJob={onDeleteJob}
          onViewJob={onViewJob}
          onEditJob={onEditJob}
        />
      ))}
    </div>
  );
};

export default JobGrid;