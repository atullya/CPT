import { useState, useEffect } from "react";
import type { Job } from "@/store/jobs/jobsTypes";

export const useJobStatus = (job: Job | undefined) => {
    const status = (job?.status as string) || "";
    const isJobDisabled =
        status === "OnHold" ||
        status === "On-Hold" ||
        status === "ClosedWon" ||
        status === "Closed Won" ||
        status === "ClosedLost" ||
        status === "Closed Lost";

    const getDisabledMessage = () => {
        const status = job?.status?.toLowerCase().replace(/[-\s]/g, "");
        if (status === "onhold") {
            return "This job is on hold, adding or moving candidates is disabled.";
        } else if (status === "closedwon") {
            return "This job is closed won, adding or moving candidates is disabled.";
        } else if (status === "closedlost") {
            return "This job is closed lost, adding or moving candidates is disabled.";
        }
        return "This job is disabled, adding or moving candidates is disabled.";
    };

    const [showDisabledAlert, setShowDisabledAlert] = useState(false);

    useEffect(() => {
        if (isJobDisabled) {
            setShowDisabledAlert(true);
            const timer = setTimeout(() => {
                setShowDisabledAlert(false);
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            setShowDisabledAlert(false);
        }
    }, [isJobDisabled]);

    return { isJobDisabled, showDisabledAlert, getDisabledMessage };
};
