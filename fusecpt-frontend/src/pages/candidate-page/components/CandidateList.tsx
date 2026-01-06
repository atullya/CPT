import React, { useState } from "react";
import type { Candidate } from "@/store/candidates/candidatesTypes";
import AddCandidateDialog from "./forms/CandidateForm";
import { SortableContext } from "@dnd-kit/sortable";
import { CandidateCard } from "./CandidateCard";
import { RejectedCandidatesSection } from "./RejectedCandidateSection";
import { CandidateDialogs } from "./CandidateDialog";
import { useCandidateOperations } from "../hooks/useCandidateOperations";
import { useCandidateData } from "../hooks/useCandidateData";

interface CandidateListProps {
  jobId?: string;
  pipelineStage?: string;
  searchTerm?: string;
  statusFilter?: string;
  onSuccess?: (message: string, type?: "create" | "update" | "delete") => void;
  onStageSkipDetected?: (id: string, name: string, from: string, to: string) => void;
  onMoveCandidate?: (id: string, stage: string) => Promise<void>;
  onCandidateClick?: (candidate: Candidate) => void;
  showRejected?: boolean;
  showOnlyRejected?: boolean;
  isJobDisabled?: boolean;
}

const CandidateList: React.FC<CandidateListProps> = ({
  jobId,
  pipelineStage,
  searchTerm = "",
  statusFilter = "",
  onSuccess,
  onStageSkipDetected,
  onMoveCandidate,
  onCandidateClick,
  isJobDisabled,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState<Candidate | null>(null);

  const operations = useCandidateOperations(onSuccess);
  const { activeCandidates, rejectedCandidates, isLoading, isError } = useCandidateData({
    jobId,
    pipelineStage,
    searchTerm,
    statusFilter,
  });

  const stageOrder = ["Preliminary", "Technical", "Additional", "Client", "Selected"];
  const stages = [
    { value: "Preliminary", label: "Preliminary Stage" },
    { value: "Technical", label: "Technical Stage" },
    { value: "Additional", label: "Additional Stage" },
    { value: "Client", label: "Client Stage" },
    { value: "Selected", label: "Selected" },
  ];

  const getStageIndex = (stage: string) => stageOrder.indexOf(stage);

  const isStageSkipped = (fromStage: string, toStage: string): boolean => {
    const fromIndex = getStageIndex(fromStage);
    const toIndex = getStageIndex(toStage);
    if (toIndex > fromIndex) {
      return toIndex - fromIndex > 1;
    }
    return false;
  };

  const handleStageSelection = (candidate: Candidate, targetStage: string) => {
    const currentStage = pipelineStage || candidate.pipelineStage;
    if (currentStage === targetStage) return;

    if (isStageSkipped(currentStage, targetStage) && onStageSkipDetected) {
      onStageSkipDetected(
        String(candidate._id),
        String(candidate.fullName ?? "Unknown"),
        currentStage,
        targetStage
      );
    } else if (onMoveCandidate) {
      onMoveCandidate(String(candidate._id), targetStage);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Could not load candidates</p>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        <div className="flex flex-col gap-2">
          <SortableContext items={activeCandidates.map((c) => c._id as string)}>
            {activeCandidates.length === 0 ? (
              <p className="text-sm text-center text-zinc-400 mt-2">
              </p>
            ) : (
              activeCandidates.map((c) => (
                <CandidateCard
                  key={c._id}
                  candidate={c}
                  pipelineStage={pipelineStage}
                  isJobDisabled={isJobDisabled}
                  onCandidateClick={onCandidateClick}
                  onEdit={(cand) => {
                    setCandidateToEdit(cand);
                    setOpenDialog(true);
                  }}
                  onReject={operations.handleReject}
                  onDelete={operations.handleDelete}
                  onStageSelection={handleStageSelection}
                  onSuccess={onSuccess}
                  stages={stages}
                />
              ))
            )}
          </SortableContext>
        </div>
      </div>

      <RejectedCandidatesSection
        rejectedCandidates={rejectedCandidates}
        onDelete={operations.handleDelete}
        onEdit={(cand) => {
          setCandidateToEdit(cand);
          setOpenDialog(true);
        }}
        onReactivate={operations.handleReactivate}
        onCandidateClick={onCandidateClick}
        isJobDisabled={isJobDisabled}
      />

      <CandidateDialogs
        rejectOpen={operations.rejectDialog.open}
        rejectCandidateName={operations.rejectDialog.candidate?.fullName}
        rejectRemarks={operations.rejectRemarks}
        onRejectOpenChange={(open) => {
          operations.setRejectDialog((prev) => ({ ...prev, open }));
          if (!open) operations.setRejectRemarks("");
        }}
        onRejectRemarksChange={operations.setRejectRemarks}
        onRejectConfirm={operations.confirmReject}
        reactivateOpen={operations.reactivateDialog.open}
        reactivateRemarks={operations.reactivateRemarks}
        onReactivateOpenChange={(open) => {
          operations.setReactivateDialog((prev) => ({ ...prev, open }));
          if (!open) operations.setReactivateRemarks("");
        }}
        onReactivateRemarksChange={operations.setReactivateRemarks}
        onReactivateConfirm={operations.confirmReactivate}
        deleteOpen={operations.deleteDialog.open}
        deleteCandidateName={operations.deleteDialog.candidate?.fullName}
        onDeleteOpenChange={(open) => operations.setDeleteDialog((prev) => ({ ...prev, open }))}
        onDeleteConfirm={operations.confirmDelete}
      />

      {candidateToEdit && (
        <AddCandidateDialog
          open={openDialog}
          onOpenChange={(val) => {
            setOpenDialog(val);
            if (!val) setCandidateToEdit(null);
          }}
          job={jobId}
          candidateToEdit={candidateToEdit}
          onSuccess={(name) => onSuccess?.(`${name} updated`, "update")}
        />
      )}
    </div>
  );
};

export default CandidateList;