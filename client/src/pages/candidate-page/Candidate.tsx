"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";

import {
  useUpdateCandidateMutation,
  useGetCandidatesQuery,
  useGetCandidatesSearchQuery,
} from "@/store/candidates/candidatesApi";
import { useGetJobByIdQuery } from "@/store/jobs/jobsApi";
import type { Candidate } from "@/store/candidates/candidatesTypes";
import CreateJob from "@/pages/job-form/CreateJob";
import { useJobs } from "@/pages/job-form/hooks/useJobs";
import useLoader from "@/hooks/useLoader";

import { ConfirmDialog } from "@/components/ui/Dialog";
import { useJobStatus } from "./hooks/useJobStatus";
import DisabledJobAlert from "./components/DisabledJob";
import { useCandidateStats } from "./hooks/useCandidateStatus";
import SuccessAlert from "@/components/ui/SuccessAlert";
import Breadcrumb from "./components/BreadCrumb";
import JobHeader from "./components/job/JobHeader";
import JobOverview from "./components/job/JobOverview";
import CandidatePipeline from "./components/CandidatePipeline";
import CandidateDrawer from "./components/drawer/CandidateHistory";

const CandidatePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationJob = location.state?.job;
  const prevParams = location.state?.prevParams;
  const jobId = locationJob?.id || locationJob?._id;

  const { data: jobData } = useGetJobByIdQuery(jobId, {
    skip: !jobId,
  });

  const job = jobData || locationJob;

  const { isJobDisabled, showDisabledAlert, getDisabledMessage } =
    useJobStatus(job);

  useEffect(() => {
    if (!job) {
      navigate("/jobs");
    }
  }, [job, navigate]);

  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    subtitle?: string;
    type?: "create" | "update" | "delete";
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"overview" | "pipeline">(
    "pipeline"
  );
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [updateCandidate] = useUpdateCandidateMutation();
  const { data: candidatesData } = useGetCandidatesQuery();

  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { updateJob, deleteJob, isDeleting } = useJobs();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [skipConfirmDialog, setSkipConfirmDialog] = useState({
    open: false,
    candidateId: "" as string,
    candidateName: "",
    fromStage: "",
    toStage: "",
  });

  const { loading, start, stop, LoadingComponent } = useLoader();

  const candidates: Candidate[] = candidatesData?.data?.data || [];

  const { getTotalCandidateCount, getStageCount } = useCandidateStats({
    job,
    candidates,
    selectedStatus,
    searchValue,
  });

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setSearchValue(searchInput);
      setIsSearching(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  const backendStatusFilter =
    selectedStatus === "Selected" ? "" : selectedStatus;
  const isBackendSearchNeeded = searchValue || backendStatusFilter;

  const { isFetching: isSearchFetching } = useGetCandidatesSearchQuery(
    {
      candidateType: "internal",
      search: searchValue,
      status: backendStatusFilter,
      jobId: job?.id || job?._id,
    },
    { skip: !isBackendSearchNeeded }
  );

  useEffect(() => {
    if ((isSearching || isSearchFetching) && searchValue) {
      start();
    } else {
      stop();
    }
  }, [isSearching, isSearchFetching, searchValue, start, stop]);

  const handleEditJob = () => {
    setIsEditMode(true);
    setIsCreateJobOpen(true);
  };

  const handleDeleteJob = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (job) {
      const jobId = job.id || job._id;
      const result = await deleteJob(jobId);
      if (result.success) {
        setDeleteDialogOpen(false);
        navigate("/jobs");
      }
    }
  };

  const handleCreateJobSubmit = async (formData: any) => {
    const result = await updateJob(formData);
    if (result.success) {
      setAlertMessage({ message: "Job updated successfully" });
      setIsCreateJobOpen(false);
      setIsEditMode(false);
    }
    return result;
  };

  const handleCreateJobClose = () => {
    setIsCreateJobOpen(false);
    setIsEditMode(false);
  };

  const handleMove = async (candidateId: string, newStage: string) => {
    const candidate = candidates.find(
      (c) => String(c._id) === candidateId || String(c.id) === candidateId
    );

    if (candidate && candidate.pipelineStage === newStage) {
      return;
    }

    try {
      await updateCandidate({
        id: candidateId,
        data: { pipelineStage: newStage, status: "To Be Scheduled" } as any,
      }).unwrap();
      setAlertMessage({ message: `Candidate moved to ${newStage}` });
    } catch (error) {
      console.error("Failed to move candidate:", error);
      setAlertMessage({ message: "Failed to move candidate" });
    }
  };

  const handleStageSkipDetected = (
    candidateId: string,
    candidateName: string,
    fromStage: string,
    toStage: string
  ) => {
    setSkipConfirmDialog({
      open: true,
      candidateId: String(candidateId),
      candidateName,
      fromStage,
      toStage,
    });
  };

  const handleConfirmSkip = async () => {
    if (skipConfirmDialog.candidateId && skipConfirmDialog.toStage) {
      await handleMove(
        skipConfirmDialog.candidateId,
        skipConfirmDialog.toStage
      );
    }
    setSkipConfirmDialog({
      open: false,
      candidateId: "",
      candidateName: "",
      fromStage: "",
      toStage: "",
    });
  };

  return (
    <AppLayout>
      <SuccessAlert
        show={!!alertMessage}
        message={alertMessage?.message || ""}
        subtitle={alertMessage?.subtitle}
        onDismiss={() => setAlertMessage(null)}
        alertType={alertMessage?.type || "create"}
      />

      <div className="w-full h-full flex justify-start overflow-hidden">
        <div className="w-full h-full bg-white rounded-lg border border-zinc-200 flex flex-col relative">
          {isJobDisabled && (
            <DisabledJobAlert
              show={showDisabledAlert}
              message={getDisabledMessage()}
            />
          )}

          <Breadcrumb job={job} prevParams={prevParams} />

          <div className="flex-1 flex flex-col p-6 gap-2 min-h-0">
            <JobHeader
              job={job}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              totalCandidates={getTotalCandidateCount()}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
            />

            {activeTab === "overview" ? (
              <JobOverview job={job} />
            ) : (
              <CandidatePipeline
                job={job}
                loading={loading}
                LoadingComponent={LoadingComponent}
                searchValue={searchValue}
                selectedStatus={selectedStatus}
                isJobDisabled={!!isJobDisabled}
                setSearchInput={setSearchInput}
                setSelectedStatus={setSelectedStatus}
                setAlertMessage={setAlertMessage}
                handleMove={handleMove}
                handleStageSkipDetected={handleStageSkipDetected}
                handleCandidateClick={handleCandidateClick}
                getStageCount={getStageCount}
                getTotalCandidateCount={getTotalCandidateCount}
              />
            )}
          </div>
        </div>
      </div>

      <CreateJob
        open={isCreateJobOpen}
        onClose={handleCreateJobClose}
        onSubmit={handleCreateJobSubmit}
        editJob={job}
        isEditMode={isEditMode}
      />

      <ConfirmDialog
        open={skipConfirmDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setSkipConfirmDialog((prev) => ({ ...prev, open: false }));
          }
        }}
        title="Skip Stages and Move Candidate?"
        description={
          <span>
            This action will skip interview stages for{" "}
            <strong>{skipConfirmDialog.candidateName}</strong>.
            <br />
            <br />
            Are you sure you want to proceed with this action?
          </span>
        }
        onConfirm={handleConfirmSkip}
        confirmText="Yes, skip"
        cancelText="Cancel"
        confirmButtonClass="bg-[#6D28D9] hover:bg-[#5B21B6] text-white"
        contentClassName="w-full max-w-[480px] rounded-lg border border-zinc-200 shadow-lg p-8 flex flex-col gap-4"
        innerClassName="p-0 gap-6"
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => !open && setDeleteDialogOpen(false)}
        title="Delete job?"
        description={
          <span>
            This will permanently delete "{job?.jobTitle}". This action cannot
            be undone.
          </span>
        }
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
        contentClassName="w-full max-w-[480px] rounded-lg border border-zinc-200 shadow-lg p-2 flex flex-col items-center justify-center"
        innerClassName="w-full h-auto p-0 gap-6 justify-between"
      />

      <CandidateDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        candidate={selectedCandidate}
      />
    </AppLayout>
  );
};

export default CandidatePage;
