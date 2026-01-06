import React from "react";
import CandidateSearchFilter from "./CandidateSearchFilter";
import AddCandidateButton from "./forms/AddCandidate";
import KanbanBoard, { KanbanColumn } from "./kanban/KanbanBoard";
import CandidateList from "./CandidateList";
import EmptyState from "@/components/ui/EmptyState";
import layerImg from "@/assets/layer.png";
import searchEmptyIcon from "@/assets/noresult.svg";
import technicalIcon from "@/assets/technical.svg"
import additionalIcon from "@/assets/additional.svg";
import clientIcon from "@/assets/client.svg";
import { CheckCircle } from "lucide-react";
import DisabledJobAlert from "./DisabledJob";
import type { Job } from "@/store/jobs/jobsTypes";
import type { Candidate } from "@/store/candidates/candidatesTypes";

interface CandidatePipelineProps {
    job: Job;
    loading: boolean;
    LoadingComponent: React.ComponentType<{ message?: string; className?: string }>;
    searchValue: string;
    selectedStatus: string;
    isJobDisabled: boolean;
    setSearchInput: (val: string) => void;
    setSelectedStatus: (val: string) => void;
    setAlertMessage: (msg: { message: string, subtitle?: string, type?: "create" | "update" | "delete" }) => void;
    handleMove: (id: string, stage: string) => Promise<void>;
    handleStageSkipDetected: (id: string, name: string, from: string, to: string) => void;
    handleCandidateClick: (c: Candidate) => void;
    getStageCount: (stage: string) => number;
    getTotalCandidateCount: () => number;
}

const pipelineStages = [
    {
        stage: "Preliminary",
        headerBg: "bg-zinc-200",
        textColor: "text-zinc-900",
        icon: (() => <div className="w-4 h-4 border-2 border-dashed border-zinc-500 rounded-full"></div>)(),
    },
    {
        stage: "Technical",
        headerBg: "bg-yellow-100",
        textColor: "text-yellow-800",
        icon: <img src={technicalIcon || "/placeholder.svg"} alt="Technical" className="w-4 h-4" />,
    },
    {
        stage: "Additional",
        headerBg: "bg-cyan-100",
        textColor: "text-cyan-900",
        icon: <img src={additionalIcon || "/placeholder.svg"} alt="Additional" className="w-4 h-4" />,
    },
    {
        stage: "Client",
        headerBg: "bg-blue-100",
        textColor: "text-blue-900",
        icon: <img src={clientIcon || "/placeholder.svg"} alt="Client" className="w-4 h-4" />,
    },
    {
        stage: "Selected",
        headerBg: "bg-green-100",
        textColor: "text-green-900",
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
    },
];

const CandidatePipeline: React.FC<CandidatePipelineProps> = ({
    job,
    loading,
    LoadingComponent,
    searchValue,
    selectedStatus,
    isJobDisabled,
    setSearchInput,
    setSelectedStatus,
    setAlertMessage,
    handleMove,
    handleStageSkipDetected,
    handleCandidateClick,
    getStageCount,
    getTotalCandidateCount,
}) => {
    return (
        <div className="w-full h-full flex flex-col gap-4 relative">
            {/* <DisabledJobAlert show={isJobDisabled} message="This job is currently disabled. You cannot perform actions." /> */}
            <div className="flex justify-between items-center">
                <CandidateSearchFilter
                    onSearchChange={(search: string, status: string) => {
                        setSearchInput(search);
                        setSelectedStatus(status);
                    }}
                />
                <AddCandidateButton
                    job={job}
                    disabled={isJobDisabled}
                    onSuccess={() =>
                        setAlertMessage({
                            message: "Candidate added successfully.",
                            subtitle: 'New candidate added in "Preliminary stage".',
                            type: "create",
                        })
                    }
                />
            </div>

            <div className="relative flex-1 min-h-0">
                <LoadingComponent
                    message="Loading candidates..."
                    className="absolute inset-0 z-10 bg-white/80"
                />

                {getTotalCandidateCount() > 0 && (
                    <div className="flex gap-4 w-full overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-[7px] [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
                        <KanbanBoard
                            onMove={(id, stage) => handleMove(String(id), stage)}
                            onStageSkipDetected={(id, name, from, to) =>
                                handleStageSkipDetected(String(id), name, from, to)
                            }
                        >
                            {pipelineStages.map((config) => (
                                <KanbanColumn
                                    key={config.stage}
                                    stage={config.stage}
                                    header={
                                        <div className="w-full h-[42px] p-2 flex items-center gap-2">
                                            <div className={`w-[114px] h-[26px] rounded-md px-2 py-1 ${config.headerBg} flex items-center gap-2`}>
                                                {config.icon}
                                                <span className={`w-[65px] h-[18px] flex items-center justify-start font-plusJakarta font-semibold text-[12px] leading-[18px] ${config.textColor}`}>
                                                    {config.stage}
                                                </span>
                                                <span className="text-zinc-500 text-xs font-medium">
                                                    {getStageCount(config.stage)}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        <CandidateList
                                            jobId={job?.id || job?._id}
                                            pipelineStage={config.stage}
                                            searchTerm={searchValue}
                                            statusFilter={selectedStatus}
                                            onSuccess={(message, type) =>
                                                setAlertMessage({ message, type })
                                            }
                                            onStageSkipDetected={(id, name, from, to) =>
                                                handleStageSkipDetected(id, name, from, to)
                                            }
                                            onMoveCandidate={(id, stage) => handleMove(id, stage)}
                                            onCandidateClick={handleCandidateClick}
                                            isJobDisabled={isJobDisabled}
                                        />
                                    </div>
                                </KanbanColumn>
                            ))}
                        </KanbanBoard>
                    </div>
                )}

                {!loading &&
                    getTotalCandidateCount() === 0 &&
                    (searchValue || selectedStatus) && (
                        <EmptyState
                            icon={searchEmptyIcon}
                            title={
                                searchValue
                                    ? "No search results found"
                                    : "No matching results found."
                            }
                            description={
                                searchValue
                                    ? "Please try again with a different search query."
                                    : "Please try again with a different filters."
                            }
                        />
                    )}

                {!loading &&
                    getTotalCandidateCount() === 0 &&
                    !searchValue &&
                    !selectedStatus && (
                        <EmptyState
                            icon={layerImg}
                            title="No Candidates Yet"
                            description="Add candidates to view in pipeline board"
                            variant="circle"
                        />
                    )}
            </div>
        </div>
    );
};

export default CandidatePipeline;
