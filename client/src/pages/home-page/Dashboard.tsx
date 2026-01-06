import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import AppLayout from "@/layouts/AppLayout";
import JobFilters from "@/pages/job-form/components/JobFilters";
import JobTable from "@/pages/job-form/components/JobTable";
import folderIcon from "@/assets/folder_icon.png";
import JobsErrorState from "@/pages/job-form/components/JobsErrorState";
import SuccessAlert from "@/components/ui/SuccessAlert";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { useJobs } from "@/pages/job-form/hooks/useJobs";
import { useJobFilters } from "@/pages/job-form/hooks/useJobFilters";
import useLoader from "@/hooks/useLoader";
import type { Job } from "@/store/jobs/jobsTypes";
import { useGetCandidatesQuery } from "@/store/candidates/candidatesApi";
import type { Candidate } from "@/store/candidates/candidatesTypes";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/Pagination";
import CreateJob from "../job-form/CreateJob";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const { LoadingComponent } = useLoader();

  const {
    searchTerm,
    activeTab,
    tableSort,
    getQueryParams,
    setSearchTerm,
    setActiveTab,
    setTableSort,
    itemsPerPage,
    setCurrentPage,
  } = useJobFilters();

  const { jobs, pagination, error, createJob, updateJob, deleteJob, refetch, isDeleting } =
    useJobs(getQueryParams());
  const { data: candidatesData } = useGetCandidatesQuery();
  const candidates: Candidate[] = candidatesData?.data?.data || [];

  const jobsWithCounts = useMemo(() => {
    return jobs.map((job) => {
      const jobId = job.id || (job as any)._id;
      const jobCandidates = candidates.filter((c) => {
        const cJobId =
          typeof c.job === "string" ? c.job : c.job?._id || c.job?.id;
        return cJobId === jobId;
      });

      const totalCandidates = jobCandidates.length;
      const activeCandidates = jobCandidates.filter(
        (c) => c.status?.toLowerCase() !== "rejected"
      ).length;

      return {
        ...job,
        totalCandidates,
        activeCandidates,
      };
    });
  }, [jobs, candidates]);

  const handleCreateJobSubmit = useCallback(
    async (formData: any) => {
      const result = isEditMode
        ? await updateJob(formData)
        : await createJob(formData);
      if (result.success) {
        setSuccessMessage(
          isEditMode ? "Job updated successfully" : "Job created successfully"
        );
        setShowSuccess(true);
        setIsCreateJobOpen(false);
        setIsEditMode(false);
        setEditJob(null);
        setTimeout(() => setShowSuccess(false), 3000);
      }
      return result;
    },
    [createJob, updateJob, isEditMode]
  );

  const handleDeleteJob = useCallback((job: Job) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  }, []);

  const handleViewJob = useCallback(
    (job: Job) => {
      const searchParams = window.location.search;
      navigate("/candidates", { state: { job, prevParams: searchParams } });
    },
    [navigate]
  );

  const handleEditJob = useCallback((job: Job) => {
    setEditJob(job);
    setIsEditMode(true);
    setIsCreateJobOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedJob) {
      const result = await deleteJob(selectedJob.id);
      if (result.success) {
        if (jobs.length === 1 && pagination.currentPage > 1) {
          setCurrentPage(pagination.currentPage - 1);
        }
        setDeleteDialogOpen(false);
        setSelectedJob(null);
        setShowDeleteSuccess(true);
        setTimeout(() => setShowDeleteSuccess(false), 3000);
      }
    }
  }, [selectedJob, deleteJob, jobs, pagination.currentPage, setCurrentPage]);

  // const handleCancelDelete = useCallback(() => {
  //   setDeleteDialogOpen(false);
  //   setSelectedJob(null);
  // }, []);

  const handleCreateJobClick = useCallback(() => {
    setIsCreateJobOpen(true);
  }, []);

  const handleCreateJobClose = useCallback(() => {
    setIsCreateJobOpen(false);
    setIsEditMode(false);
    setEditJob(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (error) {
    return (
      <AppLayout>
        <JobsErrorState error={error} onRetry={handleRetry} />
      </AppLayout>
    );
  }

  return (
    <div>
      <LoadingComponent message="Loading dashboard...">
        <div className="w-full min-h-screen bg-gray-50 p-4">
          <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="w-full h-16 bg-white border-b border-zinc-200 px-4 md:px-6 flex items-center">
              <div className="w-full">
                <div className="font-plus-jakarta font-semibold text-xl leading-6 text-zinc-900">
                  Dashboard
                </div>
              </div>
            </div>

            {showSuccess && (
              <div className="px-6 pt-6">
                <SuccessAlert
                  show={showSuccess}
                  message={successMessage}
                  onDismiss={() => setShowSuccess(false)}
                  alertType={isEditMode ? "update" : "create"}
                />
              </div>
            )}

            {showDeleteSuccess && (
              <div className="px-6 pt-6">
                <SuccessAlert
                  show={showDeleteSuccess}
                  message={`job deleted successfully`}
                  onDismiss={() => setShowDeleteSuccess(false)}
                  alertType="delete"
                />
              </div>
            )}

            <div className="w-full bg-white p-6 gap-6 flex flex-col">
              <div className="flex flex-col gap-2">
                <h1 className="font-plus-jakarta font-semibold text-[24px] leading-[28px] text-[#18181B]">
                  Welcome to  CPT, {user?.name || "User"}!
                </h1>
                <p className="font-plus-jakarta font-normal text-[16px] leading-[24px] text-[#71717A]">
                  Track your candidates seamlessly across every interview stage.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="font-plus-jakarta font-semibold text-lg leading-7 text-zinc-900">
                  Open Jobs
                </h2>

                <JobFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onCreateJob={handleCreateJobClick}
                />

                <div className="w-full bg-white gap-4 flex flex-col">
                  <div className="flex-1 overflow-x-auto">
                    {jobsWithCounts.length === 0 ? (
                      <EmptyState
                        icon={folderIcon}
                        title={!!searchTerm ? "No Jobs Found" : "No Jobs Yet"}
                        description={
                          !!searchTerm
                            ? "Try adjusting your search terms"
                            : "Create job to view in job listing page."
                        }
                      />
                    ) : (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <JobTable
                          jobs={jobsWithCounts}
                          tableSort={tableSort}
                          onSort={setTableSort}
                          onDeleteJob={handleDeleteJob}
                          onEditJob={handleEditJob}
                          onViewJob={handleViewJob}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {pagination.totalJobs > 0 && (
                  <div>
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalItems={pagination.totalJobs}
                      itemsPerPage={itemsPerPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <CreateJob
            open={isCreateJobOpen}
            onClose={handleCreateJobClose}
            onSubmit={handleCreateJobSubmit}
            editJob={editJob}
            isEditMode={isEditMode}
          />

          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={(open) => !open && setDeleteDialogOpen(false)}
            title="Delete job?"
            description={
              <span>
                This will permanently delete "{selectedJob?.jobTitle}". This
                action cannot be undone.
              </span>
            }
            onConfirm={handleConfirmDelete}
            confirmText="Delete"
            variant="destructive"
            isLoading={isDeleting}
            contentClassName="w-[480px] h-[201px] rounded-lg border border-zinc-200 shadow-lg p-2 flex flex-col items-center justify-center"
            innerClassName="w-[416px] h-[137px] p-0 gap-6 justify-between"
          />
        </div>
      </LoadingComponent>
    </div>
  );
};

export default Dashboard;
