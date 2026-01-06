import type { Job } from "@/store/jobs/jobsTypes";
import type { Candidate } from "@/store/candidates/candidatesTypes";

interface UseCandidateStatsProps {
    job: Job | undefined;
    candidates: Candidate[];
    selectedStatus: string;
    searchValue: string;
}

export const useCandidateStats = ({
    job,
    candidates,
    selectedStatus,
    searchValue,
}: UseCandidateStatsProps) => {
    const getTotalCandidateCount = () => {
        if (!job) return 0;
        const jobId = job.id || job._id;
        return candidates.filter((c) => {
            const cJobId =
                typeof c.job === "string" ? c.job : c.job?._id || c.job?.id;

            const matchesStatus =
                !selectedStatus ||
                (selectedStatus === "Selected"
                    ? c.pipelineStage === "Selected"
                    : c.status === selectedStatus && c.pipelineStage !== "Selected");

            return (
                cJobId === jobId &&
                (!searchValue ||
                    (typeof c.fullName === "string" &&
                        c.fullName.toLowerCase().includes(searchValue.toLowerCase()))) &&
                matchesStatus
            );
        }).length;
    };

    const getStageCount = (stage: string) => {
        if (!job) return 0;
        const jobId = job.id || job._id;
        return candidates.filter((c) => {
            const cJobId =
                typeof c.job === "string" ? c.job : c.job?._id || c.job?.id;

            const matchesStatus =
                !selectedStatus ||
                (selectedStatus === "Selected"
                    ? c.pipelineStage === "Selected"
                    : c.status === selectedStatus && c.pipelineStage !== "Selected");

            return (
                cJobId === jobId &&
                c.pipelineStage === stage &&
                (!searchValue ||
                    (typeof c.fullName === "string" &&
                        c.fullName.toLowerCase().includes(searchValue.toLowerCase()))) &&
                matchesStatus
            );
        }).length;
    };

    return { getTotalCandidateCount, getStageCount };
};
