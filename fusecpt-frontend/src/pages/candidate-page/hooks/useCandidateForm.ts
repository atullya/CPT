import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { XCircle } from "lucide-react";
import {
    useCreateCandidateMutation,
    useUpdateCandidateMutation,
} from "@/store/candidates/candidatesApi";
import type { Candidate } from "@/store/candidates/candidatesTypes";

interface UseCandidateFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    job?: any;
    onSuccess?: (candidateName?: string) => void;
    candidateToEdit?: Candidate;
}

export const useCandidateForm = ({
    open,
    onOpenChange,
    job,
    onSuccess,
    candidateToEdit,
}: UseCandidateFormProps) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        resumeUrl: "",
        candidateType: "Internal Employee",
        remarks: "",
        pipelineStage: "Preliminary",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasStartedTyping, setHasStartedTyping] = useState(false);

    const [createCandidate, { isLoading: isCreating }] =
        useCreateCandidateMutation();
    const [updateCandidate, { isLoading: isUpdating }] =
        useUpdateCandidateMutation();

    useEffect(() => {
        if (open && candidateToEdit) {
            const backendToDisplayMap: { [key: string]: string } = {
                internal: "Internal Employee",
                external: "Externally Sourced",
            };

            const candidateTypeValue = String(
                candidateToEdit.candidateType || "internal"
            );
            const displayCandidateType =
                backendToDisplayMap[candidateTypeValue.toLowerCase()] ||
                "Internal Employee";

            setFormData({
                fullName: String(candidateToEdit.fullName || ""),
                email: String(candidateToEdit.email || ""),
                phone: String(candidateToEdit.phone || ""),
                resumeUrl: String(candidateToEdit.resumeUrl || ""),
                candidateType: displayCandidateType,
                remarks: String(candidateToEdit.remarks || ""),
                pipelineStage: String(candidateToEdit.pipelineStage || "Preliminary"),
            });
            setHasStartedTyping(false);
        } else if (!open) {
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                resumeUrl: "",
                candidateType: "Internal Employee",
                remarks: "",
                pipelineStage: "Preliminary",
            });
            setErrors({});
            setHasStartedTyping(false);
        }
    }, [open, candidateToEdit]);

    const validateFullName = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return "Full name is required.";
        if (trimmed.length < 3) return "Full name must be at least 3 characters.";
        if (trimmed.length > 50) return "Full name must not exceed 50 characters.";
        if (!/^[A-Za-z\s.\-\u2019']+$/.test(trimmed)) return "Invalid name.";
        return "";
    };

    const validateEmail = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return "Email is required.";
        if (trimmed.length > 254) return "Email must not exceed 254 characters.";

        const [localPart, domainPart] = trimmed.split("@");
        if (localPart && localPart.length > 64)
            return "Local part must not exceed 64 characters.";
        if (domainPart && domainPart.length > 255)
            return "Domain part must not exceed 255 characters.";

        if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmed))
            return "Invalid email.";
        return "";
    };

    const validatePhone = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return "";
        if (/[A-Za-z]/.test(trimmed)) return "Phone number must not contain letters.";
        if (!/^[+\d\s-]+$/.test(trimmed))
            return "Phone number contains invalid characters.";
        const digitCount = trimmed.replace(/\D/g, "").length;
        if (digitCount < 7 || digitCount > 15)
            return "Phone number must contain 7–15 digits.";
        return "";
    };

    const validateResumeUrl = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return "Resume URL is required.";
        const startsWithProtocol = /^https?:\/\//i.test(trimmed);
        const startsWithWww = /^www\./i.test(trimmed);
        if (!startsWithProtocol && !startsWithWww) {
            return "Invalid Url.";
        }
        try {
            let urlToValidate = trimmed;
            if (startsWithWww && !startsWithProtocol) {
                urlToValidate = "https://" + urlToValidate;
            }
            const url = new URL(urlToValidate);
            if (!["http:", "https:"].includes(url.protocol)) {
                return "URL must use http or https protocol.";
            }
            const hostname = url.hostname.toLowerCase();
            if (!hostname.includes(".")) {
                return "Invalid URL format.";
            }
            const domainPattern = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
            if (!domainPattern.test(hostname)) {
                return "Invalid domain name.";
            }
            const tld = hostname.split(".").pop();
            if (!tld || tld.length < 2) {
                return "Invalid top-level domain.";
            }
            return "";
        } catch (error) {
            return "Invalid URL format";
        }
    };

    const handleValidation = (field?: string) => {
        const newErrors: Record<string, string> = { ...errors };
        const validateField = (key: string, value: string) => {
            switch (key) {
                case "fullName":
                    return validateFullName(value);
                case "email":
                    return validateEmail(value);
                case "phone":
                    return validatePhone(value);
                case "resumeUrl":
                    return validateResumeUrl(value);
                default:
                    return "";
            }
        };
        if (field) {
            newErrors[field] = validateField(
                field,
                formData[field as keyof typeof formData]
            );
        } else {
            Object.keys(formData).forEach((key) => {
                newErrors[key] = validateField(
                    key,
                    formData[key as keyof typeof formData]
                );
            });
        }
        setErrors(newErrors);
        return Object.values(newErrors).every((err) => !err);
    };

    const handleInputChange = (id: string, value: string) => {
        if (id === "fullName" && value.length > 50) return;
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (!hasStartedTyping) setHasStartedTyping(true);
        setErrors((prev) => ({ ...prev, [id]: "" }));
    };

    const handleSubmit = async () => {
        if (!handleValidation()) return;
        setIsSubmitting(true);
        let normalizedResumeUrl = formData.resumeUrl.trim();
        const startsWithWww = /^www\./i.test(normalizedResumeUrl);
        const startsWithProtocol = /^https?:\/\//i.test(normalizedResumeUrl);
        if (startsWithWww && !startsWithProtocol) {
            normalizedResumeUrl = "https://" + normalizedResumeUrl;
        }
        const displayToBackendMap: { [key: string]: string } = {
            "Internal Employee": "internal",
            "Externally Sourced": "external",
        };
        const payload = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone || undefined,
            resumeUrl: normalizedResumeUrl,
            candidateType:
                displayToBackendMap[formData.candidateType] ||
                formData.candidateType.toLowerCase(),
            remarks: formData.remarks,
            pipelineStage: candidateToEdit
                ? candidateToEdit.pipelineStage
                : "Preliminary",
            status: candidateToEdit
                ? candidateToEdit.status
                : "Active",
            job: job?._id || job?.id || job,
        };
        try {
            if (candidateToEdit) {
                await updateCandidate({
                    id: candidateToEdit._id as string,
                    data: payload,
                }).unwrap();
                if (onSuccess) onSuccess(formData.fullName);
            } else {
                await createCandidate(payload).unwrap();
                if (onSuccess) onSuccess();
            }
            onOpenChange(false);
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                resumeUrl: "",
                candidateType: "Internal Employee",
                remarks: "",
                pipelineStage: "Preliminary",
            });
            setErrors({});
            setHasStartedTyping(false);
            setHasStartedTyping(false);
        } catch (err: any) {
            console.error("Candidate submit error:", err);
            const errorMessage =
                err?.data?.message || err?.message || "Failed to add candidate";

            if (
                errorMessage.includes("duplicate key error") &&
                errorMessage.includes("email")
            ) {
                toast.error("Candidate with this email already exists.", {
                    style: {
                        color: "#DC2626",
                    },
                    icon: React.createElement(XCircle, { className: "w-5 h-5 text-[#DC2626]" }),
                });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        hasStartedTyping,
        handleInputChange,
        handleValidation,
        handleSubmit,
        isSubmitting: isSubmitting || isCreating || isUpdating,
    };
};
