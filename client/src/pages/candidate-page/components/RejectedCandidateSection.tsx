import React, { useRef, useState, useEffect } from "react";
import { ChevronUp, CalendarCheck, MoreVertical, Pencil, Trash } from "lucide-react";
import type { Candidate } from "@/store/candidates/candidatesTypes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { formatDate } from "../utils/dateUtils";

interface RejectedCandidateCardProps {
    candidate: Candidate & { rejectionRemarks?: string };
    onEdit: (candidate: Candidate) => void;
    onDelete: (candidate: Candidate) => void;
    onReactivate: (candidate: Candidate) => void;
    isJobDisabled?: boolean;
    onClick?: (candidate: Candidate) => void;
}

const RejectedCandidateCard: React.FC<RejectedCandidateCardProps> = ({
    candidate,
    onEdit,
    onDelete,
    onReactivate,
    isJobDisabled,
    onClick,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);



    return (
        <div
            className="relative w-full min-h-[76px] bg-white border border-zinc-200 rounded-lg flex flex-col cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick?.(candidate)}
        >
            <div className="h-[38px] flex items-center justify-between pt-2 px-2">
                <span className="font-plusJakarta font-semibold text-[14px] truncate">
                    {candidate.fullName}
                </span>

                {(isHovered || isMenuOpen) && !isJobDisabled && (
                    <DropdownMenu onOpenChange={setIsMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 hover:bg-gray-100 rounded focus:outline-none"
                            >
                                <MoreVertical className="w-4 h-4 text-zinc-600" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="right"
                            align="start"
                            className="w-60 p-0.5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(candidate);
                                }}
                                className="cursor-pointer"
                            >
                                <Pencil className="w-5 h-5 text-zinc-700 mr-2" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onReactivate(candidate);
                                }}
                                className="cursor-pointer"
                            >
                                <div className="w-5 h-5 border-2 border-dashed border-zinc-900 rounded-full flex items-center justify-center mr-2" />
                                <span className="text-zinc-900">Reactivate</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(candidate);
                                }}
                                className="cursor-pointer hover:bg-red-50 focus:bg-red-50"
                            >
                                <Trash className="w-5 h-5 text-red-600 mr-2" />
                                <span className="text-red-600">Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <div className="h-[38px] flex justify-start gap-2 items-center px-2 pb-2">
                <div className="h-[22px] rounded bg-[#F4F4F5] px-1 flex items-center gap-1">
                    <CalendarCheck className="w-3 h-3 text-zinc-600" />
                    <span className="text-[12px] text-[#52525B]">
                        Rejected :{" "}
                        {(() => {
                            const rejectedEntry = candidate.pipelineHistory
                                ?.filter((entry) => entry.actionType === "rejected")
                                .sort(
                                    (a, b) =>
                                        new Date(b.date).getTime() - new Date(a.date).getTime()
                                )[0];
                            return rejectedEntry
                                ? formatDate(new Date(rejectedEntry.date))
                                : formatDate(new Date(candidate.createdAt));
                        })()}
                    </span>
                </div>

                <span className="h-6 rounded bg-red-100 px-1 flex items-center text-red-700 text-[12px]">
                    Rejected
                </span>
            </div>
        </div>
    );
};

interface RejectedCandidatesSectionProps {
    rejectedCandidates: Candidate[];
    onDelete: (candidate: Candidate) => void;
    onEdit: (candidate: Candidate) => void;
    onReactivate: (candidate: Candidate) => void;
    onCandidateClick?: (candidate: Candidate) => void;
    isJobDisabled?: boolean;
}

export const RejectedCandidatesSection: React.FC<RejectedCandidatesSectionProps> = ({
    rejectedCandidates,
    onDelete,
    onEdit,
    onReactivate,
    onCandidateClick,
    isJobDisabled,
}) => {
    const [showRejected, setShowRejected] = useState(false);
    const rejectedContentRef = useRef<HTMLDivElement | null>(null);
    const rejectedHeaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!showRejected || !rejectedHeaderRef.current) return;

        const headerEl = rejectedHeaderRef.current;
        let parent: HTMLElement | null = headerEl.parentElement;

        while (parent) {
            const style = window.getComputedStyle(parent);
            const overflowY = style.overflowY;
            if (overflowY === "auto" || overflowY === "scroll") break;
            parent = parent.parentElement;
        }

        const scrollContainer = parent;

        if (scrollContainer) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const headerRect = headerEl.getBoundingClientRect();
            const offset = 16;

            const targetScrollTop =
                scrollContainer.scrollTop +
                (headerRect.top - containerRect.top) -
                offset;

            scrollContainer.scrollTo({ top: targetScrollTop, behavior: "smooth" });
        } else {
            headerEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [showRejected]);

    if (rejectedCandidates.length === 0) return null;

    return (
        <div className={`mt-auto pt-2 border-zinc-1000 shadow-inner flex flex-col shrink-0 transition-[height] duration-300 ease-in-out ${showRejected ? "h-[70%]" : "h-auto"}`}>
            <div
                ref={rejectedHeaderRef}
                className="flex justify-between items-center px-3 py-0 bg-zinc-50 shrink-0"
            >
                <div className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-xs font-medium">
                    Rejected {rejectedCandidates.length}
                </div>
                <button
                    onClick={() => setShowRejected((prev) => !prev)}
                    className="text-purple-600 text-xs font-semibold flex items-center gap-1"
                >
                    {showRejected ? "Hide all" : "Show all"}
                    <ChevronUp
                        className={`transition-transform duration-300 w-3 h-3 ${showRejected ? "" : "rotate-180"
                            }`}
                    />
                </button>
            </div>

            <div
                ref={rejectedContentRef}
                className={`overflow-y-auto no-scrollbar px-2 pt-2 flex-1 ${showRejected
                    ? "opacity-100 translate-y-0"
                    : "hidden opacity-0 translate-y-4"
                    }`}
            >
                <div className="flex flex-col gap-2 pb-2">
                    {rejectedCandidates.map((c) => (
                        <RejectedCandidateCard
                            key={c._id}
                            candidate={c}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onReactivate={onReactivate}
                            isJobDisabled={isJobDisabled}
                            onClick={(cand) => onCandidateClick?.(cand)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
