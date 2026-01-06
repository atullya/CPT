import type { ReactNode } from "react";
import { useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { CalendarCheck } from "lucide-react";

import type { DragEndEvent, DragStartEvent, UniqueIdentifier } from "@dnd-kit/core";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Candidate } from "@/store/candidates/candidatesTypes";
import { getStatusColors } from "../../utils/statusColors";
import { formatDate } from "../../utils/dateUtils";

interface KanbanColumnProps {
    stage: string;
    header: ReactNode;
    children: ReactNode;
}

export function KanbanColumn({ stage, header, children }: KanbanColumnProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: stage,
        data: { stage },
    });

    const { active, over } = useDndContext();

    const isOverContainer = isOver || (over && over.data.current && (over.data.current.pipelineStage === stage));
    const isDifferentStage = active?.data?.current?.pipelineStage !== stage;
    const showOverlay = isOverContainer && isDifferentStage;

    return (
        <div
            ref={setNodeRef}
            className={`w-[290px] h-[380px] p-2 rounded-lg border transition-all flex-shrink-0 flex flex-col relative
        ${showOverlay ? "bg-[#F5F3FF] border-[#8B5CF6]" : "bg-[#FAFAFA] border-zinc-200"}
      `}
        >
            {header}

            {showOverlay && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[256px] h-[76px] rounded-lg border border-dashed border-[#8B5CF6] bg-[#F5F3FF] flex items-center justify-center z-50 pointer-events-none">
                    <span className="text-[#8B5CF6] text-sm font-medium">Drop here</span>
                </div>
            )}

            {children}
        </div>
    );
}

interface DraggableCandidateProps {
    c: Candidate;
    pipelineStage: string;
    children: ReactNode;
    disabled?: boolean;
}

export function DraggableCandidate({ c, pipelineStage, children, disabled }: DraggableCandidateProps) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
        useSortable({
            id: String(c._id),
            data: { pipelineStage, candidate: c },
            disabled,
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
        >
            {children}
        </div>
    );
}

interface KanbanBoardProps {
    children: ReactNode;
    onMove: (id: UniqueIdentifier, toStage: string) => void;
    onStageSkipDetected?: (candidateId: UniqueIdentifier, candidateName: string, fromStage: string, toStage: string) => void;
}

export default function KanbanBoard({ children, onMove, onStageSkipDetected }: KanbanBoardProps) {
    const stageOrder = ["Preliminary", "Technical", "Additional", "Client", "Selected"];

    const getStageIndex = (stage: string) => stageOrder.indexOf(stage);

    const isStageSkipped = (fromStage: string, toStage: string): boolean => {
        const fromIndex = getStageIndex(fromStage);
        const toIndex = getStageIndex(toStage);

        //check for skips when forwardmoving
        if (toIndex > fromIndex) {
            return toIndex - fromIndex > 1;
        }
        return false;
    };
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(e: DragStartEvent) => {
                setActiveId(e.active.id);
                setActiveCandidate(e.active.data.current?.candidate);
            }}
            onDragEnd={(e: DragEndEvent) => {
                const { active, over } = e;
                setActiveId(null);
                const candidate = activeCandidate;
                setActiveCandidate(null);
                if (!over) return;

                const fromStage = active.data.current?.pipelineStage;
                const toStage = over.data.current?.stage;

                if (fromStage !== toStage && toStage) {
                    // Check skipping stagess
                    if (isStageSkipped(fromStage, toStage) && onStageSkipDetected && candidate) {
                        onStageSkipDetected(active.id, candidate.fullName, fromStage, toStage);
                    } else {
                        onMove(active.id, toStage);
                    }
                }
            }}
        >
            {children}

            <DragOverlay>
                {activeId && activeCandidate ? (
                    <div
                        className="w-[256px] h-[76px] bg-white border border-zinc-200 rounded-lg flex flex-col shadow-lg opacity-90 cursor-grabbing"
                        style={{ transform: 'rotate(-4deg)' }}
                    >
                        <div className="h-[38px] flex items-center justify-between pt-2 pr-1 pb-1.5 pl-2">
                            <span className="font-plusJakarta font-semibold text-[14px] leading-[18px] text-zinc-900 truncate max-w-[200px]">
                                {activeCandidate.fullName}
                            </span>
                        </div>

                        <div className="h-[38px] flex justify-between items-center gap-2 pt-1.5 pr-2 pb-2 pl-2">
                            <div className="h-[22px] rounded bg-[#F4F4F5] px-1 py-0.5 flex items-center gap-1">
                                <CalendarCheck className="w-3 h-3 text-zinc-600" />
                                <div className="flex items-center gap-0.5">
                                    <span className="font-plusJakarta font-normal text-[12px] leading-[18px] text-[#52525B]">
                                        Added:
                                    </span>
                                    <span className="font-plusJakarta font-normal text-[12px] leading-[18px] text-[#52525B]">
                                        {formatDate(activeCandidate.createdAt ? new Date(activeCandidate.createdAt) : new Date())}
                                    </span>
                                </div>
                            </div>
                            <div
                                className="h-6 rounded px-1 py-0.5 flex items-center"
                                style={getStatusColors(
                                    activeCandidate.status === "Active"
                                        ? "To Be Scheduled"
                                        : activeCandidate.status || "To Be Scheduled"
                                )}
                            >
                                <span className="font-plusJakarta font-semibold text-[12px] leading-[18px] text-center whitespace-nowrap">
                                    {activeCandidate.status === "Active"
                                        ? "To Be Scheduled"
                                        : activeCandidate.status || "To Be Scheduled"}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
