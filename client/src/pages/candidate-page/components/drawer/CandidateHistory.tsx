import React from "react";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import type { Candidate } from "@/store/candidates/candidatesTypes";
import { cn } from "@/lib/utils";
import { BasicInfoTab } from "./BasicInfo";
import { PipelineHistoryTab } from "./PipelineHistory";

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
          "shadow-2xl",
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
                className="w-[124px] h-[30px] rounded-[10px] text-[14px] font-medium leading-[18px] data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm text-zinc-500 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Basic Information
              </TabsTrigger>
              <TabsTrigger
                value="pipeline"
                className="w-[121px] h-[30px] rounded-[10px] text-[14px] font-medium leading-[18px] data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm text-zinc-500 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Pipeline History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <BasicInfoTab candidate={candidate} />
            </TabsContent>

            <TabsContent value="pipeline">
              <PipelineHistoryTab candidate={candidate} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default CandidateDrawer;
