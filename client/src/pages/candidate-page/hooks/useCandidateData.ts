import {
    useGetCandidatesQuery,
    useGetCandidatesSearchQuery,
} from "@/store/candidates/candidatesApi";
import type { Candidate } from "@/store/candidates/candidatesTypes";

interface UseCandidateDataProps {
    jobId?: string;
    pipelineStage?: string;
    searchTerm?: string;
    statusFilter?: string;
}

export const useCandidateData = ({
    jobId,
    pipelineStage,
    searchTerm = "",
    statusFilter = "",
}: UseCandidateDataProps) => {
    const { data, isLoading, isError } = useGetCandidatesQuery();

    const backendStatusFilter = statusFilter
        ? statusFilter
            .split(",")
            .filter((s) => s !== "Selected")
            .map((s) => (s === "To Be Scheduled" ? "To Be Scheduled,Active" : s))
            .join(",")
        : "";

    const isBackendSearchNeeded = searchTerm || backendStatusFilter;

    const { data: searchData, isFetching: isSearchLoading } =
        useGetCandidatesSearchQuery(
            {
                search: searchTerm,
                status: backendStatusFilter,
                jobId,
            },
            { skip: !isBackendSearchNeeded }
        );

    const candidates: Candidate[] = isBackendSearchNeeded
        ? searchData?.data?.candidates || []
        : data?.data?.data || [];

    const filtered = candidates.filter((c) => {
        const candidateJob =
            typeof c.job === "string" ? c.job : c.job?._id || c.job?.id;

        const matchesStage = pipelineStage
            ? c.pipelineStage === pipelineStage
            : true;
        const matchesSearch = searchTerm
            ? String(c.fullName ?? "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            : true;
        const matchesStatus = statusFilter
            ? statusFilter.split(",").some((filter) => {
                const s = filter.trim();
                if (s === "To Be Scheduled")
                    return c.status === "To Be Scheduled" || c.status === "Active";
                if (s === "Selected") return c.pipelineStage === "Selected";
                return c.status === s && c.pipelineStage !== "Selected";
            })
            : true;

        return jobId
            ? candidateJob === jobId && matchesStage && matchesSearch && matchesStatus
            : false;
    });

    const activeCandidates = filtered.filter(
        (c) => c.status?.toLowerCase() !== "rejected"
    );

    const rejectedCandidates = filtered.filter(
        (c) => c.status?.toLowerCase() === "rejected"
    );

    return {
        activeCandidates,
        rejectedCandidates,
        isLoading: isLoading || (searchTerm && isSearchLoading),
        isError,
    };
};
