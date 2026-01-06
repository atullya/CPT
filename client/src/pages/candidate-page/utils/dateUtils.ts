import type { Candidate } from "@/store/candidates/candidatesTypes";

export const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const getDateDisplay = (candidate: Candidate) => {
    const createdAt = new Date(candidate.createdAt);
    const updatedAt = candidate.updatedAt ? new Date(candidate.updatedAt) : null;

    if (updatedAt && Math.abs(updatedAt.getTime() - createdAt.getTime()) > 1000) {
        return {
            label: "Modified:",
            date: updatedAt,
        };
    }

    return {
        label: "Added:",
        date: createdAt,
    };
};
