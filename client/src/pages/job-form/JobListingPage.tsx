"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import CreateJob from "@/pages/job-form/CreateJob";
import Pagination from "@/components/Pagination";
import JobFilters from "./components/JobFilters";
import JobViewToggle from "./components/JobViewToggle";
import JobTable from "./components/JobTable";
import JobGrid from "./components/JobGrid";
import EmptyState from "@/components/ui/EmptyState";
import folderIcon from "@/assets/folder_icon.png";
import JobsErrorState from "./components/JobsErrorState";
import SuccessAlert from "@/components/ui/SuccessAlert";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { useJobs } from "./hooks/useJobs";
import { useJobFilters } from "./hooks/useJobFilters";
import useLoader from "../../hooks/useLoader";
import type { Job } from "@/store/jobs/jobsTypes";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useGetCandidatesQuery } from "@/store/candidates/candidatesApi";
import type { Candidate } from "@/store/candidates/candidatesTypes";

const JobListingPage: React.FC = () => {
  const navigate = useNavigate();

  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alertType, setAlertType] = useState<"create" | "update" | "delete">(
    "create"
  );

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
    view,
    tableSort,
    itemsPerPage,
    getQueryParams,
    setSearchTerm,
    setActiveTab,
    setView,
    setTableSort,
    setCurrentPage,
  } = useJobFilters();

  const {
    jobs,
    pagination,
    error,
    createJob,
    updateJob,
    deleteJob,
    refetch,
    isDeleting,
  } = useJobs(getQueryParams());

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
        setAlertType(isEditMode ? "update" : "create");
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

  const handleCancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setSelectedJob(null);
  }, []);

  const handleCreateJobClick = useCallback(() => {
    setIsCreateJobOpen(true);
  }, []);

  const handleCreateJobClose = useCallback(() => {
    setIsCreateJobOpen(false);
    setIsEditMode(false);
    setEditJob(null);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

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
      <LoadingComponent message="Loading jobs...">
        {/* <div className="bg-gray-50 max-w-5xl w-full h-[720px]  p-4"> */}
        <div className="w-full min-h-screen bg-gray-50 p-4">
          <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="w-full h-16 bg-white border-b border-zinc-200 px-4 md:px-6 flex items-center">
              <div className="w-full">
                <div className="font-plus-jakarta font-semibold text-xl leading-6 text-zinc-900">
                  Job Listing
                </div>
              </div>
            </div>

            {showSuccess && (
              <div className="px-6 pt-6">
                <SuccessAlert
                  show={showSuccess}
                  message={successMessage}
                  onDismiss={() => setShowSuccess(false)}
                  alertType={alertType}
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

            <div className="w-full bg-white p-4 md:p-6 gap-6 flex flex-col">
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <JobFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onCreateJob={handleCreateJobClick}
                />
              </div>

              <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="w-full lg:w-auto p-0.5 rounded-[10px]">
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                      setActiveTab(
                        value as
                        | "open"
                        | "on-hold"
                        | "closed-won"
                        | "closed-lost"
                      )
                    }
                    className="w-full"
                  >
                    <TabsList className="bg-gray-100 rounded-[10px] p-0.5 inline-flex w-full lg:w-auto">
                      <TabsTrigger
                        value="open"
                        className="flex-1 lg:flex-initial h-[30px] py-0.5 px-4 rounded-[10px] text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 whitespace-nowrap transition-all"
                      >
                        Open
                      </TabsTrigger>
                      <TabsTrigger
                        value="on-hold"
                        className="flex-1 lg:flex-initial h-[30px] py-0.5 px-4 rounded-[10px] text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 whitespace-nowrap transition-all"
                      >
                        On Hold
                      </TabsTrigger>
                      <TabsTrigger
                        value="closed-won"
                        className="flex-1 lg:flex-initial h-[30px] py-0.5 px-4 rounded-[10px] text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 whitespace-nowrap transition-all"
                      >
                        Closed Won
                      </TabsTrigger>
                      <TabsTrigger
                        value="closed-lost"
                        className="flex-1 lg:flex-initial h-[30px] py-0.5 px-4 rounded-[10px] text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 whitespace-nowrap transition-all"
                      >
                        Closed Lost
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="w-full lg:w-auto flex items-center gap-4">
                  <JobViewToggle view={view} onViewChange={setView} />
                  {/* <select className="px-3 py-2 border border-gray-200 rounded-md text-sm">
                    <option>Sort by</option>
                    <option>Date Created</option>
                    <option>Job Title</option>
                    <option>Status</option>
                  </select> */}
                </div>
              </div>

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
                  ) : view === "list" ? (
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
                  ) : (
                    <JobGrid
                      jobs={jobsWithCounts}
                      onDeleteJob={handleDeleteJob}
                      onEditJob={handleEditJob}
                      onViewJob={handleViewJob}
                    />
                  )}
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
            onOpenChange={(open) => !open && handleCancelDelete()}
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

export default JobListingPage;
