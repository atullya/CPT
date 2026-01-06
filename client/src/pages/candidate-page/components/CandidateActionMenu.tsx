import React, { useState } from "react";
import { Pencil, ArrowRight, ChevronRight, Ban, Trash } from "lucide-react";
import type { Candidate } from "@/store/candidates/candidatesTypes";
import { calculateMenuPosition } from "../utils/positioning";

interface CandidateActionMenuProps {
    candidate: Candidate;
    pipelineStage?: string;
    isOpen: boolean;
    onClose: () => void;
    menuPosition: { top: number; left: number } | null;
    onEdit: (candidate: Candidate) => void;
    onReject: (candidate: Candidate) => void;
    onDelete: (candidate: Candidate) => void;
    onStageSelection: (candidate: Candidate, stage: string) => void;
    stages: { value: string; label: string }[];
}

export const CandidateActionMenu: React.FC<CandidateActionMenuProps> = ({
    candidate,
    pipelineStage,
    isOpen,
    onClose,
    menuPosition,
    onEdit,
    onReject,
    onDelete,
    onStageSelection,
    stages,
}) => {
    const [showStagesSubmenu, setShowStagesSubmenu] = useState(false);
    const [submenuPosition, setSubmenuPosition] = useState<{
        top: number;
        left: number;
    } | null>(null);

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
                className="fixed z-20 w-60 bg-white border rounded-lg shadow-lg p-[5px] flex flex-col gap-1"
                style={{
                    top: menuPosition.top,
                    left: menuPosition.left,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    onClick={() => {
                        onEdit(candidate);
                        onClose();
                    }}
                    className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 cursor-pointer rounded-md"
                >
                    <Pencil className="w-5 h-5" />
                    <span>Edit</span>
                </div>

                <div
                    className="relative flex items-center justify-between px-2 py-2 hover:bg-gray-50 cursor-pointer rounded-md"
                    onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const SUBMENU_WIDTH = 208; // w-52
                        const SUBMENU_EST_HEIGHT = 200; // Estimated height

                        const position = calculateMenuPosition(
                            {
                                top: rect.top,
                                bottom: rect.bottom,
                                left: rect.left,
                                right: rect.right,
                                width: rect.width,
                                height: rect.height
                            },
                            { width: SUBMENU_WIDTH, height: SUBMENU_EST_HEIGHT },
                            { width: window.innerWidth, height: window.innerHeight },
                            'submenu'
                        );

                        setSubmenuPosition(position);
                        setShowStagesSubmenu(true);
                    }}
                    onMouseLeave={(e) => {
                        const relatedTarget = e.relatedTarget as HTMLElement;
                        if (!relatedTarget?.closest(".stages-submenu")) {
                            setShowStagesSubmenu(false);
                        }
                    }}
                >
                    <div className="flex items-center gap-2">
                        <ArrowRight className="w-5 h-5" />
                        <span>Move to Stages</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                </div>

                {showStagesSubmenu && submenuPosition && (
                    <div
                        className="stages-submenu fixed z-30 w-52 bg-white border rounded-lg shadow-lg p-[5px] flex flex-col gap-1"
                        style={{
                            top: submenuPosition.top,
                            left: submenuPosition.left,
                        }}
                        onMouseEnter={() => setShowStagesSubmenu(true)}
                        onMouseLeave={() => setShowStagesSubmenu(false)}
                    >
                        {stages.map((stage) => (
                            <div
                                key={stage.value}
                                onClick={() => onStageSelection(candidate, stage.value)}
                                className={`px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm rounded-md ${pipelineStage === stage.value
                                    ? "bg-purple-50 text-purple-700 font-medium"
                                    : ""
                                    }`}
                            >
                                {stage.label}
                            </div>
                        ))}
                    </div>
                )}

                <div className="h-px bg-zinc-200 my-1" />

                <div
                    onClick={() => onReject(candidate)}
                    className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 cursor-pointer rounded-md"
                >
                    <Ban className="w-5 h-5 text-red-600" />
                    <span>Reject</span>
                </div>

                <div
                    onClick={() => onDelete(candidate)}
                    className="flex items-center gap-2 px-2 py-2 hover:bg-red-50 cursor-pointer rounded-md"
                >
                    <Trash className="w-5 h-5 text-red-600" />
                    <span className="text-red-600">Delete</span>
                </div>
            </div>
        </>
    );
};
