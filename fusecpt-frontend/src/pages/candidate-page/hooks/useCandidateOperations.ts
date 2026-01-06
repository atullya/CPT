import { useState } from "react";
import {
    useDeleteCandidateMutation,
    useRejectCandidateMutation,
    useReactivateCandidateMutation,
} from "@/store/candidates/candidatesApi";
import type { Candidate } from "@/store/candidates/candidatesTypes";

export const useCandidateOperations = (
    onSuccess?: (message: string, type?: "create" | "update" | "delete") => void
) => {
    const [deleteCandidateApi] = useDeleteCandidateMutation();
    const [rejectCandidateApi] = useRejectCandidateMutation();
    const [reactivateCandidateApi] = useReactivateCandidateMutation();

    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        candidate: null as Candidate | null,
    });

    const [rejectDialog, setRejectDialog] = useState({
        open: false,
        candidate: null as Candidate | null,
    });
    const [rejectRemarks, setRejectRemarks] = useState("");

    const [reactivateDialog, setReactivateDialog] = useState({
        open: false,
        candidate: null as Candidate | null,
    });
    const [reactivateRemarks, setReactivateRemarks] = useState("");

    const handleDelete = (candidate: Candidate) => {
        setDeleteDialog({ open: true, candidate });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.candidate) return;

        try {
            await deleteCandidateApi(deleteDialog.candidate._id as string).unwrap();
            onSuccess?.(
                `${deleteDialog.candidate.fullName} deleted successfully.`,
                "delete"
            );
        } catch {
            onSuccess?.("Failed to delete candidate", "delete");
        } finally {
            setDeleteDialog({ open: false, candidate: null });
        }
    };

    const handleReject = (candidate: Candidate) => {
        setRejectDialog({ open: true, candidate });
        setRejectRemarks("");
    };

    const confirmReject = async () => {
        if (!rejectDialog.candidate?._id || !rejectRemarks.trim()) return;

        try {
            await rejectCandidateApi({
                id: String(rejectDialog.candidate._id),
                rej_remarks: rejectRemarks,
            }).unwrap();

            onSuccess?.(`${rejectDialog.candidate.fullName} rejected.`, "update");

            setRejectDialog({ open: false, candidate: null });
            setRejectRemarks("");
        } catch {
            onSuccess?.("Failed to reject candidate.", "update");
        }
    };

    const handleReactivate = (candidate: Candidate) => {
        setReactivateDialog({ open: true, candidate });
        setReactivateRemarks("");
    };

    const confirmReactivate = async () => {
        if (!reactivateDialog.candidate?._id || !reactivateRemarks.trim()) return;

        try {
            await reactivateCandidateApi({
                id: String(reactivateDialog.candidate._id),
                rej_remarks: reactivateRemarks,
            }).unwrap();

            onSuccess?.(
                `${reactivateDialog.candidate.fullName} reactivated!`,
                "update"
            );
        } catch {
            onSuccess?.("Failed to reactivate candidate.", "update");
        } finally {
            setReactivateDialog({ open: false, candidate: null });
            setReactivateRemarks("");
        }
    };

    return {
        deleteDialog,
        setDeleteDialog,
        handleDelete,
        confirmDelete,

        rejectDialog,
        setRejectDialog,
        rejectRemarks,
        setRejectRemarks,
        handleReject,
        confirmReject,

        reactivateDialog,
        setReactivateDialog,
        reactivateRemarks,
        setReactivateRemarks,
        handleReactivate,
        confirmReactivate,
    };
};
