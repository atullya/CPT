import React from "react";
import { Mail, Phone, Link, User, PencilLine, Disc } from "lucide-react";
import type { Candidate } from "@/store/candidates/candidatesTypes";
import { getStatusColors } from "../../utils/statusColors";

interface BasicInfoTabProps {
    candidate: Candidate;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ candidate }) => {
    return (
        <div className="mt-0 w-[448px] outline-none">
            <div className="flex gap-6 px-4 py-2 min-h-[38px] h-auto box-border transition-colors">
                <div className="flex items-start gap-1 w-[128px] shrink-0 pt-0.5">
                    <div className="w-4 h-4 flex items-center justify-center pt-1">
                        <Mail className="w-[16px] h-[16px] text-zinc-500" strokeWidth={1.5} />
                    </div>
                    <span className="text-[14px] leading-[22px] text-zinc-500 font-normal">
                        Email Address
                    </span>
                </div>
                <span className="text-[14px] font-medium leading-[22px] text-zinc-900 w-[296px] break-all">
                    {candidate.email}
                </span>
            </div>

            <div className="flex items-center gap-6 px-4 py-2 h-[38px] box-border transition-colors">
                <div className="flex items-center gap-1 w-[128px] shrink-0">
                    <div className="w-4 h-4 flex items-center justify-center">
                        <Phone className="w-[16px] h-[16px] text-zinc-500" strokeWidth={1.5} />
                    </div>
                    <span className="text-[14px] leading-[22px] text-zinc-500 font-normal">
                        Phone number
                    </span>
                </div>
                <span className="text-[14px] font-medium leading-[22px] text-zinc-900 w-[296px] truncate">
                    {candidate.phone || "N/A"}
                </span>
            </div>

            <div className="flex gap-6 px-4 py-2 min-h-[38px] h-auto box-border transition-colors">
                <div className="flex items-start gap-1 w-[128px] shrink-0 pt-0.5">
                    <div className="w-4 h-4 flex items-center justify-center pt-1">
                        <Link className="w-[16px] h-[16px] text-zinc-500" strokeWidth={1.5} />
                    </div>
                    <span className="text-[14px] leading-[22px] text-zinc-500 font-normal">
                        Resume URL
                    </span>
                </div>
                <a
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[14px] font-medium leading-[22px] text-violet-600 w-[296px] break-all hover:underline"
                >
                    {candidate.resumeUrl || "No URL"}
                </a>
            </div>

            <div className="flex items-center gap-6 px-4 py-2 h-[38px] box-border transition-colors">
                <div className="flex items-center gap-1 w-[128px] shrink-0">
                    <div className="w-4 h-4 flex items-center justify-center">
                        <User className="w-[16px] h-[16px] text-zinc-500" strokeWidth={1.5} />
                    </div>
                    <span className="text-[14px] leading-[22px] text-zinc-500 font-normal">
                        Candidate Type
                    </span>
                </div>
                <span className="text-[14px] font-medium leading-[22px] text-zinc-900 w-[296px] truncate">
                    {candidate.candidateType === "internal" ? "Internal Employee" : (candidate.candidateType === "external" ? "Externally Sourced" : (candidate.candidateType || "N/A"))}
                </span>
            </div>

            <div className="flex gap-6 px-4 py-2 min-h-[38px] h-auto box-border transition-colors">
                <div className="flex items-start gap-1 w-[128px] shrink-0 pt-0.5">
                    <div className="w-4 h-4 flex items-center justify-center pt-1">
                        <PencilLine className="w-[16px] h-[16px] text-zinc-500" strokeWidth={1.5} />
                    </div>
                    <span className="text-[14px] leading-[22px] text-zinc-500 font-normal">
                        Remark
                    </span>
                </div>
                <p className="text-[14px] font-medium leading-[22px] text-zinc-900 w-[296px] line-clamp-3">
                    {candidate.remarks || "No remarks provided."}
                </p>
            </div>

            <div className="flex items-center gap-6 px-4 py-2 h-[38px] box-border transition-colors">
                <div className="flex items-center gap-1 w-[128px] shrink-0">
                    <div className="w-4 h-4 flex items-center justify-center">
                        <Disc className="w-[16px] h-[16px] text-zinc-500" strokeWidth={1.5} />
                    </div>
                    <span className="text-[14px] leading-[22px] text-zinc-500 font-normal">
                        Status
                    </span>
                </div>
                <div
                    className="rounded-sm text-center font-medium flex items-center justify-center"
                    style={{
                        ...getStatusColors(candidate.pipelineStage === 'Selected' ? 'Selected' : (candidate.status === 'Active' ? 'To Be Scheduled' : (candidate.status || 'To Be Scheduled'))),
                        height: '22px',
                        padding: '2px 8px',
                        fontSize: '12px',
                        lineHeight: '18px'
                    }}
                >
                    {candidate.pipelineStage === 'Selected' ? 'Selected' : (candidate.status === 'Active' ? 'To Be Scheduled' : (candidate.status || "To Be Scheduled"))}
                </div>
            </div>
        </div>
    );
};
