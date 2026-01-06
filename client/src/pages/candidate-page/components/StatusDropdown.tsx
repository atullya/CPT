import React from "react";
import { useUpdateCandidateMutation } from "@/store/candidates/candidatesApi";
import { getStatusColors } from "../utils/statusColors";
import type { Candidate } from "@/store/candidates/candidatesTypes";

interface StatusDropdownProps {
    candidate: Candidate;
    isOpen: boolean;
    onClose: () => void;
    menuPosition: { top: number; left: number } | null;
    onSuccess?: (message: string, type?: "create" | "update" | "delete") => void;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
    candidate,
    isOpen,
    onClose,
    menuPosition,
    onSuccess,
}) => {
    const [updateCandidateApi] = useUpdateCandidateMutation();

    const statuses = [
        { value: "To Be Scheduled", ...getStatusColors("To Be Scheduled") },
        { value: "Scheduled", ...getStatusColors("Scheduled") },
        { value: "Awaiting Feedback", ...getStatusColors("Awaiting Feedback") },
        { value: "Others", ...getStatusColors("Others") },
    ];

    const handleStatusUpdate = async (status: string) => {
        try {
            await updateCandidateApi({
                id: String(candidate._id),
                data: { status },
            }).unwrap();
            onSuccess?.(`Status updated to ${status}`, "update");
        } catch (error) {
            console.error("Failed to update status:", error);
        }
        onClose();
    };

    if (!isOpen || !menuPosition) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            />
            <div
                className="fixed z-20 min-w-[240px] bg-white rounded-lg shadow-md ring-1 ring-black/5 p-[5px] flex flex-col gap-2"
                style={{
                    top: menuPosition.top,
                    left: menuPosition.left,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {statuses.map((status) => (
                    <div
                        key={status.value}
                        className="w-full h-[38px] min-h-[32px] px-3 py-2 rounded-md cursor-pointer flex items-center justify-start hover:bg-gray-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(status.value);
                        }}
                    >
                        <div
                            className="rounded-sm text-center font-medium flex items-center justify-center"
                            style={{
                                backgroundColor: status.backgroundColor,
                                color: status.color,
                                height: "22px",
                                padding: "2px 8px",
                                fontSize: "12px",
                                lineHeight: "18px",
                            }}
                        >
                            {status.value}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
