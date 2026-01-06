import React, { useState } from "react";
import { CalendarCheck, MoreVertical } from "lucide-react";
import type { Candidate } from "@/store/candidates/candidatesTypes";
import { getStatusColors } from "../utils/statusColors";
import { formatDate, getDateDisplay } from "../utils/dateUtils";
import { DraggableCandidate } from "./kanban/KanbanBoard";
import { calculateMenuPosition } from "../utils/positioning";
import { StatusDropdown } from "./StatusDropdown";
import { CandidateActionMenu } from "./CandidateActionMenu";

interface CandidateCardProps {
    candidate: Candidate;
    pipelineStage?: string;
    isJobDisabled?: boolean;
    onCandidateClick?: (candidate: Candidate) => void;
    onEdit: (candidate: Candidate) => void;
    onReject: (candidate: Candidate) => void;
    onDelete: (candidate: Candidate) => void;
    onStageSelection: (candidate: Candidate, stage: string) => void;
    onSuccess?: (
        message: string,
        type?: "create" | "update" | "delete"
    ) => void;
    stages: { value: string; label: string }[];
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
    candidate,
    pipelineStage,
    isJobDisabled,
    onCandidateClick,
    onEdit,
    onReject,
    onDelete,
    onStageSelection,
    onSuccess,
    stages,
}) => {
    const [hoveredCard, setHoveredCard] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState<{
        top: number;
        left: number;
    } | null>(null);

    const id = String(candidate._id);
    const dateDisplay = getDateDisplay(candidate);

    return (
        <DraggableCandidate
            key={id}
            c={{ ...candidate, _id: id }}
            pipelineStage={pipelineStage ?? ""}
            disabled={isJobDisabled}
        >
            <div
                className={`bg-white border border-zinc-200 rounded-lg px-3 py-2 flex flex-col gap-2 ${
                    isJobDisabled
                        ? "cursor-default"
                        : "cursor-grab active:cursor-grabbing"
                }`}
                onMouseEnter={() => setHoveredCard(true)}
                onMouseLeave={() => setHoveredCard(false)}
                onClick={() => onCandidateClick?.(candidate)}
            >
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm truncate">
                        {candidate.fullName}
                    </span>

                    {hoveredCard && !isJobDisabled && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const rect =
                                    e.currentTarget.getBoundingClientRect();
                                const MENU_WIDTH = 240; // w-60
                                const MENU_EST_HEIGHT = 160;

                                const position = calculateMenuPosition(
                                    {
                                        top: rect.top,
                                        bottom: rect.bottom,
                                        left: rect.left,
                                        right: rect.right,
                                        width: rect.width,
                                        height: rect.height,
                                    },
                                    {
                                        width: MENU_WIDTH,
                                        height: MENU_EST_HEIGHT,
                                    },
                                    {
                                        width: window.innerWidth,
                                        height: window.innerHeight,
                                    },
                                    "dropdown"
                                );

                                setMenuPosition(position);
                                setOpenMenu(openMenu === id ? null : id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <MoreVertical className="w-4 h-4 text-zinc-600" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-1.5 text-xs flex-nowrap w-full">
                    <div
                        className="flex items-center gap-1 bg-zinc-100 px-1 rounded-sm shrink-0 font-medium"
                        style={{ height: "22px" }}
                    >
                        <CalendarCheck className="w-3 h-3 text-zinc-600 shrink-0" />
                        <span className="text-zinc-600 whitespace-nowrap leading-[18px]">
                            {dateDisplay.label} {formatDate(dateDisplay.date)}
                        </span>
                    </div>
                    {pipelineStage === "Selected" ? (
                        <div
                            className="px-2 py-1 rounded-sm text-xs font-medium text-center flex items-center justify-center"
                            style={{
                                backgroundColor: "#D1FAE5",
                                color: "#065F46",
                                width: "61px",
                                height: "22px",
                                padding: "2px 4px",
                                fontSize: "12px",
                                lineHeight: "18px",
                            }}
                        >
                            Selected
                        </div>
                    ) : (
                        <div className="relative shrink-0">
                            <div
                                className="px-1 py-1 rounded-sm text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center whitespace-nowrap"
                                style={{
                                    ...getStatusColors(
                                        candidate.status === "Active"
                                            ? "To Be Scheduled"
                                            : candidate.status ||
                                                  "To Be Scheduled"
                                    ),
                                    height: "22px",
                                    lineHeight: "18px",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const rect =
                                        e.currentTarget.getBoundingClientRect();
                                    const MENU_WIDTH = 240;
                                    const MENU_EST_HEIGHT = 180;

                                    const position = calculateMenuPosition(
                                        {
                                            top: rect.top,
                                            bottom: rect.bottom,
                                            left: rect.left,
                                            right: rect.right,
                                            width: rect.width,
                                            height: rect.height,
                                        },
                                        {
                                            width: MENU_WIDTH,
                                            height: MENU_EST_HEIGHT,
                                        },
                                        {
                                            width: window.innerWidth,
                                            height: window.innerHeight,
                                        },
                                        "dropdown"
                                    );

                                    setMenuPosition(position);
                                    setOpenMenu(
                                        openMenu === `status-${id}`
                                            ? null
                                            : `status-${id}`
                                    );
                                }}
                            >
                                {candidate.status === "Active"
                                    ? "To Be Scheduled"
                                    : candidate.status || "To Be Scheduled"}
                            </div>

                            <StatusDropdown
                                candidate={candidate}
                                isOpen={openMenu === `status-${id}`}
                                onClose={() => setOpenMenu(null)}
                                menuPosition={menuPosition}
                                onSuccess={onSuccess}
                            />
                        </div>
                    )}
                </div>

                <CandidateActionMenu
                    candidate={candidate}
                    pipelineStage={pipelineStage}
                    isOpen={openMenu === id}
                    onClose={() => setOpenMenu(null)}
                    menuPosition={menuPosition}
                    onEdit={onEdit}
                    onReject={onReject}
                    onDelete={onDelete}
                    onStageSelection={onStageSelection}
                    stages={stages}
                />
            </div>
        </DraggableCandidate>
    );
};
