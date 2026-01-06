import { useGetJobsQuery, useCreateJobMutation, useUpdateJobMutation, useDeleteJobMutation } from '@/store/jobs/jobsApi';
import { useCallback } from 'react';
import type { CreateJobPayload, JobQueryParams } from '@/store/jobs/jobsTypes';

export const useJobs = (queryParams?: JobQueryParams) => {
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useGetJobsQuery(queryParams || {});
  
  const jobs = data?.jobs || [];
  const pagination = {
    totalJobs: data?.totalJobs || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1
  };



  const [createJobMutation, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJobMutation, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJobMutation, { isLoading: isDeleting }] = useDeleteJobMutation();

  const handleCreateJob = useCallback(async (formData: CreateJobPayload) => {
    try {
      await createJobMutation(formData).unwrap();
      return { success: true };
    } catch (error) {
      const errorMessage = (error as any)?.data?.message 
        || (error as any)?.data?.error 
        || (error as any)?.error 
        || 'Failed to create job';
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }, [createJobMutation]);

  const handleUpdateJob = useCallback(async (formData: CreateJobPayload & { id: string }) => {
    try {
      const { id, ...data } = formData;
      await updateJobMutation({ id, data }).unwrap();
      return { success: true };
    } catch (error) {

      
      const errorMessage = (error as any)?.data?.message 
        || (error as any)?.data?.error 
        || (error as any)?.error 
        || 'Failed to update job';
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }, [updateJobMutation]);

  const handleDeleteJob = useCallback(async (jobId: string) => {
    try {
      await deleteJobMutation(jobId).unwrap();
      return { success: true };
    } catch (error) {

      
      const errorMessage = (error as any)?.data?.message 
        || (error as any)?.data?.error 
        || (error as any)?.error 
        || 'Failed to delete job';
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }, [deleteJobMutation]);

  return {
    jobs,
    pagination,
    isLoading,
    error: error ? (error as any)?.data?.message || 'Failed to fetch jobs' : null,
    refetch,
    createJob: handleCreateJob,
    updateJob: handleUpdateJob,
    deleteJob: handleDeleteJob,
    isCreating,
    isUpdating,
    isDeleting,
  };
};