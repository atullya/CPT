import type { Job } from "@/store/jobs/jobsTypes";
import type { JobHistoryItem } from "@/store/jobs/jobsApi";
import { formatFieldLabel, formatHistoryValue } from "./jobUtils";

export interface ChangeItem {
    label: string;
    oldValue: string;
    newValue: string;
    isStatus?: boolean;
    isLogo?: boolean;
}

export interface ActivityItem {
    id: string;
    action: "created" | "updated";
    title: string;
    jobTitle?: string;
    oldJobTitle?: string;
    status: string;
    statusColor: string;
    user: string;
    date: string;
    time: string;
    region?: string;
    minExp?: string;
    changes?: ChangeItem[];
}

export const processJobHistory = (
    job: Job,
    history: JobHistoryItem[]
): ActivityItem[] => {
    if (!job || !history.length) return [];

    const sortedHistory = [...history].sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
    });

    return sortedHistory.map((h, index) => {
        const isUpdated = h.action === "updated";

        const dateObj =
            h.createdAt && !Number.isNaN(Date.parse(h.createdAt))
                ? new Date(h.createdAt)
                : job.createdAt
                    ? new Date(job.createdAt)
                    : new Date();

        const userName = h.user?.name || h.user?.email || "Unknown user";

        const changes: ChangeItem[] | undefined = h.changes?.map((c) => ({
            label: formatFieldLabel(c.field),
            oldValue: formatHistoryValue(c.from),
            newValue: formatHistoryValue(c.to),
            isStatus: c.field === "status",
            isLogo: c.field === "clientLogo",
        }));

        const titleChange = h.changes?.find((c) => c.field === "title");
        const cardTitle = titleChange
            ? formatHistoryValue(titleChange.to)
            : job.jobTitle;

        return {
            id: `${h.action}-${index}`,
            action: h.action,
            title: isUpdated ? "Job updated" : "Job created",
            jobTitle: cardTitle,
            status: isUpdated ? "Updated" : job.status || "Open",
            statusColor: isUpdated ? "yellow" : "sky",
            user: userName,
            date: dateObj.toLocaleDateString("en-GB", {
                month: "short",
                day: "numeric",
            }),
            time: dateObj.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            changes,
        };
    });
};
