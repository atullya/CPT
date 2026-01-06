import React from "react";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Textarea";

interface CandidateDialogsProps {
    rejectOpen: boolean;
    rejectCandidateName?: string;
    rejectRemarks: string;
    onRejectOpenChange: (open: boolean) => void;
    onRejectRemarksChange: (value: string) => void;
    onRejectConfirm: () => void;


    reactivateOpen: boolean;
    reactivateRemarks: string;
    onReactivateOpenChange: (open: boolean) => void;
    onReactivateRemarksChange: (value: string) => void;
    onReactivateConfirm: () => void;

    deleteOpen: boolean;
    deleteCandidateName?: string;
    onDeleteOpenChange: (open: boolean) => void;
    onDeleteConfirm: () => void;
}

export const CandidateDialogs: React.FC<CandidateDialogsProps> = ({
    rejectOpen,
    rejectCandidateName,
    rejectRemarks,
    onRejectOpenChange,
    onRejectRemarksChange,
    onRejectConfirm,
    reactivateOpen,
    reactivateRemarks,
    onReactivateOpenChange,
    onReactivateRemarksChange,
    onReactivateConfirm,
    deleteOpen,
    deleteCandidateName,
    onDeleteOpenChange,
    onDeleteConfirm,
}) => {
    return (
        <>
            <ConfirmDialog
                open={rejectOpen}
                onOpenChange={onRejectOpenChange}
                title="Reject Candidate?"
                description={
                    <span>
                        This will remove the candidate from the active candidate list.
                        <br />
                        Remarks are required to proceed with rejecting{" "}
                        {rejectCandidateName}.
                    </span>
                }
                onConfirm={onRejectConfirm}
                confirmText="Confirm Rejection"
                cancelText="Cancel"
                variant="destructive"
                disabled={!rejectRemarks.trim()}
                contentClassName="bg-white w-[480px] h-[318px] rounded-[10px] border border-zinc-200 shadow p-8 flex flex-col gap-4 "
                innerClassName="p-0 gap-4"
            >
                <Textarea
                    id="remarks"
                    label="Remarks"
                    placeholder="Type your message here."
                    value={rejectRemarks}
                    onChange={(e: { target: { value: string } }) =>
                        onRejectRemarksChange(e.target.value)
                    }
                    required
                />
            </ConfirmDialog>

            <ConfirmDialog
                open={reactivateOpen}
                onOpenChange={onReactivateOpenChange}
                title="Reactivate Candidate?"
                description={
                    <span>
                        This will restore the candidate to the active list. Please provide a
                        remark to proceed.
                        <br />
                    </span>
                }
                onConfirm={onReactivateConfirm}
                confirmText="Confirm Reactivation"
                cancelText="Cancel"
                disabled={!reactivateRemarks.trim()}
                contentClassName="bg-white w-[480px] h-[318px] rounded-[10px] border border-zinc-200 shadow p-8 flex flex-col gap-4"
                innerClassName="p-0 gap-4"
                confirmButtonClass="bg-[#6D28D9] hover:bg-[#5B21B6] text-white"
            >
                <Textarea
                    id="reactivate-remarks"
                    label="Remarks"
                    placeholder="Type your message here."
                    value={reactivateRemarks}
                    onChange={(e: { target: { value: string } }) =>
                        onReactivateRemarksChange(e.target.value)
                    }
                    required
                />
            </ConfirmDialog>

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={onDeleteOpenChange}
                title="Delete candidate?"
                description={
                    <span>
                        This will permanently delete{" "}
                        <strong>{deleteCandidateName}</strong>.
                    </span>
                }
                onConfirm={onDeleteConfirm}
                confirmText="Delete"
                variant="destructive"
                contentClassName="w-[480px] h-[201px] rounded-lg border border-zinc-200 shadow-lg p-2 flex flex-col items-center justify-center"
                innerClassName="w-[416px] h-[137px] p-0 gap-6 justify-between"
            />
        </>
    );
};
