import React from "react";
import {
  X,
  Mail,
  Phone,
  Link,
  User,
  PencilLine,
  Disc,
  ArrowRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import type { Candidate } from "@/store/candidates/candidatesTypes";
import { cn } from "@/lib/utils";

interface CandidateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
}

const CandidateDrawer: React.FC<CandidateDrawerProps> = ({
  isOpen,
  onClose,
  candidate,
}) => {
  if (!candidate) return null;

  const getStatusColors = (status: string) => {
    switch (status) {
      case "To Be Scheduled":
        return { backgroundColor: "#FFFBEB", color: "#B45309" };
      case "Scheduled":
        return { backgroundColor: "#F5F3FF", color: "#7C3AED" };
      case "Awaiting Feedback":
        return { backgroundColor: "#F1F5F9", color: "#475569" };
      case "Others":
        return { backgroundColor: "#E0F2FE", color: "#075985" };
      case "Selected":
        return { backgroundColor: "#D1FAE5", color: "#065F46" };
      case "Rejected":
        return { backgroundColor: "#FFF1F2", color: "#E11D48" };
      case "Active":
        return { backgroundColor: "#FFFBEB", color: "#B45309" };
      default:
        return { backgroundColor: "#FFFBEB", color: "#B45309" };
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-transparent z-40 transition-all duration-300",
          isOpen
            ? "visible pointer-events-auto"
            : "invisible pointer-events-none"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-[496px] bg-white transition-transform duration-300 ease-in-out",
          "shadow-[0px_25px_50px_-12px_#00000040]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-[56px] px-4 border-b border-zinc-100">
          <h2 className="text-[18px] font-semibold text-zinc-900 leading-6 font-['Plus_Jakarta_Sans']">
            {candidate.fullName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-md text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-6 px-6 overflow-y-auto h-[calc(100%-56px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Tabs defaultValue="basic" className="w-[261px] flex flex-col gap-6">
            <TabsList className="w-[261px] h-[36px] p-[3px] bg-[#F4F4F5] rounded-[10px] gap-1.5 self-start">
              <TabsTrigger
                value="basic"
                className="w-[124px] h-[30px] rounded-[10px] text-[14px] font-medium leading-[18px] data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-[0px_1px_3px_0px_#0000001A] text-zinc-500 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Basic Information
              </TabsTrigger>
              <TabsTrigger
                value="pipeline"
                className="w-[121px] h-[30px] rounded-[10px] text-[14px] font-medium leading-[18px] data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-[0px_1px_3px_0px_#0000001A] text-zinc-500 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Pipeline History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-0 w-[448px] outline-none">
              <div className="flex items-center gap-6 px-4 py-2 h-[38px] box-border hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-1 w-[128px] shrink-0">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <Mail
                      className="w-[16px] h-[16px] text-zinc-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-[14px] leading-[22px] text-zinc-500 font-normal">
                    Email Address
                  </span>
                </div>
                <span className="text-[14px] font-medium leading-[22px] text-zinc-900 w-[296px] truncate">
                  {candidate.email}
                </span>
              </div>

              <div className="flex items-center gap-6 px-4 py-2 h-[38px] box-border hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-1 w-[128px] shrink-0">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <Phone
                      className="w-[16px] h-[16px] text-zinc-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-[14px] leading-[22px] text-zinc-500 font-normal">
                    Phone number
                  </span>
                </div>
                <span className="text-[14px] font-medium leading-[22px] text-zinc-900 w-[296px] truncate">
                  {candidate.phone || "+977 981000000"}
                </span>
              </div>

              <div className="flex items-center gap-6 px-4 py-2 h-[38px] box-border hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-1 w-[128px] shrink-0">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <Link
                      className="w-[16px] h-[16px] text-zinc-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-[14px] leading-[22px] text-zinc-500 font-normal">
                    Resume URL
                  </span>
                </div>
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[14px] font-medium leading-[22px] text-violet-600 w-[296px] truncate hover:underline"
                >
                  {candidate.resumeUrl || "No URL"}
                </a>
              </div>

              <div className="flex items-center gap-6 px-4 py-2 h-[38px] box-border hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-1 w-[128px] shrink-0">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <User
                      className="w-[16px] h-[16px] text-zinc-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-[14px] leading-[22px] text-zinc-500 font-normal">
                    Candidate Type
                  </span>
                </div>
                <span className="text-[14px] font-medium leading-[22px] text-zinc-900 w-[296px] truncate">
                  {candidate.candidateType || "N/A"}
                </span>
              </div>

              <div className="flex gap-6 px-4 py-2 min-h-[38px] h-auto box-border hover:bg-zinc-50 transition-colors">
                <div className="flex items-start gap-1 w-[128px] shrink-0 pt-0.5">
                  <div className="w-4 h-4 flex items-center justify-center pt-1">
                    <PencilLine
                      className="w-[16px] h-[16px] text-zinc-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-[14px] leading-[22px] text-zinc-500 font-normal">
                    Remark
                  </span>
                </div>
                <p className="text-[14px] font-medium leading-[22px] text-zinc-900 w-[296px] line-clamp-3">
                  {candidate.remarks || "No remarks provided."}
                </p>
              </div>

              <div className="flex items-center gap-6 px-4 py-2 h-[38px] box-border hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-1 w-[128px] shrink-0">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <Disc
                      className="w-[16px] h-[16px] text-zinc-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-[14px] leading-[22px] text-zinc-500 font-normal">
                    Status
                  </span>
                </div>
                <div
                  className="rounded-sm text-center font-medium flex items-center justify-center"
                  style={{
                    ...getStatusColors(
                      candidate.pipelineStage === "Selected"
                        ? "Selected"
                        : candidate.status === "Active"
                        ? "To Be Scheduled"
                        : candidate.status || "To Be Scheduled"
                    ),
                    height: "22px",
                    padding: "2px 8px",
                    fontSize: "12px",
                    lineHeight: "18px",
                  }}
                >
                  {candidate.pipelineStage === "Selected"
                    ? "Selected"
                    : candidate.status === "Active"
                    ? "To Be Scheduled"
                    : candidate.status || "To Be Scheduled"}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pipeline" className="mt-0 w-[448px]">
              <div className="w-[448px] flex flex-col gap-2">
                {candidate.pipelineHistory &&
                candidate.pipelineHistory.length > 0 ? (
                  candidate.pipelineHistory
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((entry, index, arr) => {
                      const isLast = index === arr.length - 1;
                      const prevEntry = arr[index + 1];

                      const getTitle = () => {
                        if (entry.actionType === "added")
                          return "Candidate added";
                        if (entry.actionType === "moved")
                          return "Status updated";
                        if (entry.actionType === "rejected")
                          return "Candidate rejected";
                        if (entry.actionType === "reactivated")
                          return "Candidate reactivated";
                        return "Status updated";
                      };

                      const renderStatusBadge = (
                        status: string,
                        pipelineStage?: string,
                        strike = false
                      ) => {
                        const displayStatus =
                          pipelineStage === "Selected" ? "Selected" : status;
                        return (
                          <span
                            className={`px-2 py-0.5 rounded-sm text-xs font-medium ${
                              strike ? "line-through opacity-70" : ""
                            }`}
                            style={getStatusColors(displayStatus)}
                          >
                            {displayStatus === "Active"
                              ? "To Be Scheduled"
                              : displayStatus}
                          </span>
                        );
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

                          <div
                            className={`flex-1 flex flex-col ${
                              !isLast ? "pb-6" : ""
                            }`}
                          >
                            <div className="text-sm font-semibold text-zinc-900 leading-[22px]">
                              {getTitle()}
                            </div>

                            <div className="mt-3 pl-4">
                              <div className="border-l-2 border-violet-500 pl-4 py-2 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-zinc-500">
                                    Stage:
                                  </span>
                                  {entry.actionType === "moved" &&
                                  prevEntry &&
                                  prevEntry.pipelineStage !==
                                    entry.pipelineStage ? (
                                    <>
                                      <span className="text-xs font-medium text-zinc-500 line-through decoration-zinc-500">
                                        {prevEntry.pipelineStage}
                                      </span>
                                      <ArrowRight className="w-3 h-3 text-zinc-400" />
                                      <span className="text-xs font-medium text-zinc-900">
                                        {entry.pipelineStage}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-xs font-medium text-zinc-900">
                                      {entry.pipelineStage}
                                    </span>
                                  )}
                                </div>

                                {entry.actionType !== "rejected" && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500">
                                      Status:
                                    </span>
                                    {(entry.actionType === "moved" ||
                                      entry.actionType === "reactivated") &&
                                    prevEntry &&
                                    prevEntry.status !== entry.status ? (
                                      <>
                                        {renderStatusBadge(
                                          prevEntry.status,
                                          prevEntry.pipelineStage,
                                          true
                                        )}
                                        <ArrowRight className="w-3 h-3 text-zinc-400" />
                                        {renderStatusBadge(
                                          entry.status,
                                          entry.pipelineStage
                                        )}
                                      </>
                                    ) : (
                                      renderStatusBadge(
                                        entry.status,
                                        entry.pipelineStage
                                      )
                                    )}
                                  </div>
                                )}

                                {entry.remarks &&
                                  entry.actionType !== "added" &&
                                  entry.actionType !== "rejected" && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-zinc-500">
                                        Remark:
                                      </span>
                                      <div className="w-[336px] text-xs font-medium text-zinc-900 leading-[18px]">
                                        {entry.remarks}
                                      </div>
                                    </div>
                                  )}

                                {entry.actionType === "rejected" &&
                                  prevEntry && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-zinc-500">
                                        Status:
                                      </span>

                                      {renderStatusBadge(
                                        prevEntry.status,
                                        prevEntry.pipelineStage,
                                        true
                                      )}

                                      <ArrowRight className="w-3 h-3 text-zinc-400" />

                                      {renderStatusBadge(
                                        entry.status,
                                        entry.pipelineStage
                                      )}
                                    </div>
                                  )}

                                {entry.actionType === "rejected" &&
                                  entry.remarks && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-zinc-500">
                                        Remark:
                                      </span>
                                      <div className="w-[336px] text-xs font-medium text-zinc-900 leading-[18px]">
                                        {entry.remarks}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-zinc-500 mt-2 ml-[-16px]">
                              <User
                                className="w-[16px] h-[16px]"
                                strokeWidth={1.5}
                              />
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
                  <div className="text-center py-8 text-zinc-500 text-sm">
                    No history available.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default CandidateDrawer;
