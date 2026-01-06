import React from "react";
import { User, ArrowRight } from "lucide-react";
import type { Candidate } from "@/store/candidates/candidatesTypes";
import { getStatusColors } from "../../utils/statusColors";

interface PipelineHistoryTabProps {
    candidate: Candidate;
}

export const PipelineHistoryTab: React.FC<PipelineHistoryTabProps> = ({ candidate }) => {
    const renderStatusBadge = (status: string, pipelineStage?: string, strike = false) => {
        const displayStatus = pipelineStage === 'Selected' ? 'Selected' : status;
        return (
            <span
                className={`px-2 py-0.5 rounded-sm text-xs font-medium ${strike ? 'line-through opacity-70' : ''}`}
                style={getStatusColors(displayStatus)}
            >
                {displayStatus === 'Active' ? 'To Be Scheduled' : displayStatus}
            </span>
        );
    };

    return (
        <div className="mt-0 w-[448px]">
            <div className="w-[448px] flex flex-col gap-2">
                {candidate.pipelineHistory && candidate.pipelineHistory.length > 0 ? (
                    candidate.pipelineHistory
                        .slice()
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((entry, index, arr) => {
                            const isLast = index === arr.length - 1;
                            const prevEntry = arr[index + 1];

                            const getTitle = () => {
                                if (entry.actionType === 'added') return 'Candidate added';
                                if (entry.actionType === 'moved') return 'Status updated';
                                if (entry.actionType === 'rejected') return 'Candidate rejected';
                                if (entry.actionType === 'reactivated') return 'Candidate reactivated';
                                return 'Status updated';
                            };

                            return (
                                <div key={index} className="flex gap-4 w-full">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 rounded-full border-[1.5px] border-zinc-400 flex items-center justify-center flex-shrink-0 mt-2">
                                            <div className="w-[10px] h-[10px] rounded-full" />
                                        </div>
                                        {!isLast && (
                                            <div className="flex-1 border-2 border-dashed border-zinc-200 mt-1" />
                                        )}
                                    </div>

                                    <div className={`flex-1 flex flex-col ${!isLast ? 'pb-6' : ''}`}>
                                        <div className="text-sm font-semibold text-zinc-900 leading-[22px]">
                                            {getTitle()}
                                        </div>

                                        <div className="mt-3 pl-4">
                                            <div className="border-l-2 border-violet-500 pl-4 py-2 flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-zinc-500">Stage:</span>
                                                    {entry.actionType === 'moved' && prevEntry && prevEntry.pipelineStage !== entry.pipelineStage ? (
                                                        <>
                                                            <span className="text-xs font-medium text-zinc-500 line-through decoration-zinc-500">{prevEntry.pipelineStage}</span>
                                                            <ArrowRight className="w-3 h-3 text-zinc-400" />
                                                            <span className="text-xs font-medium text-zinc-900">{entry.pipelineStage}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs font-medium text-zinc-900">{entry.pipelineStage}</span>
                                                    )}
                                                </div>

                                                {entry.actionType !== 'rejected' && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-zinc-500">Status:</span>
                                                        {(entry.actionType === 'moved' || entry.actionType === 'reactivated') && prevEntry && prevEntry.status !== entry.status ? (
                                                            <>
                                                                {renderStatusBadge(prevEntry.status, prevEntry.pipelineStage, true)}
                                                                <ArrowRight className="w-3 h-3 text-zinc-400" />
                                                                {renderStatusBadge(entry.status, entry.pipelineStage)}
                                                            </>
                                                        ) : (
                                                            renderStatusBadge(entry.status, entry.pipelineStage)
                                                        )}
                                                    </div>
                                                )}

                                                {entry.remarks && entry.actionType !== 'added' && entry.actionType !== 'rejected' && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-zinc-500">Remark:</span>
                                                        <div className="w-[336px] text-xs font-medium text-zinc-900 leading-[18px]">{entry.remarks}</div>
                                                    </div>
                                                )}

                                                {entry.actionType === 'rejected' && prevEntry && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-zinc-500">Status:</span>
                                                        {renderStatusBadge(prevEntry.status, prevEntry.pipelineStage, true)}
                                                        <ArrowRight className="w-3 h-3 text-zinc-400" />
                                                        {renderStatusBadge(entry.status, entry.pipelineStage)}
                                                    </div>
                                                )}

                                                {entry.actionType === 'rejected' && entry.remarks && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-zinc-500">Remark:</span>
                                                        <div className="w-[336px] text-xs font-medium text-zinc-900 leading-[18px]">{entry.remarks}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-zinc-500 mt-2 ml-[-16px]">
                                            <User className="w-[16px] h-[16px]" strokeWidth={1.5} />
                                            <span>{entry.actionBy}</span>
                                            <span>·</span>
                                            <span>
                                                {new Date(entry.date).toLocaleString([], {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                ) : (
                    <div className="text-center py-8 text-zinc-500 text-sm">No history available.</div>
                )}
            </div>
        </div>
    );
};
