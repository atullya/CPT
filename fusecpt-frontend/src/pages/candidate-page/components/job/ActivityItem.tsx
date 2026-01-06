import React, { useState } from "react";
import { User, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import type { ActivityItem } from "../../utils/activityUtils";

interface ActivityItemProps {
    activity: ActivityItem;
    isLast: boolean;
}

const getStatusColors = (color: string) => {
    switch (color) {
        case "green":
            return "bg-green-100 text-green-800";
        case "yellow":
            return "bg-yellow-100 text-yellow-800";
        case "red":
            return "bg-red-100 text-red-800";
        case "sky":
            // Open status - sky blue
            return "bg-[#E0F2FE] text-[#075985]";
        case "lime":
            // Closed, Won, Lost, On Hold - lime green
            return "bg-[#ECFCCB] text-[#365314]";
        default:
            return "bg-[#E0F2FE] text-[#075985]";
    }
};

export const ActivityItemDisplay: React.FC<ActivityItemProps> = ({
    activity,
    isLast,
}) => {
    const isUpdated = activity.action === "updated";
    const [showAll, setShowAll] = useState(false);

    if (!isUpdated) {
        return (
            <div className="flex gap-4 w-[348px]">
                <div className="flex flex-col items-center">
                    <div className="w-[12px] h-[12px] rounded-full border-2 border-[#A1A1AA] mt-2"></div>
                </div>

                <div
                    className={`flex-1 flex flex-col gap-2 pb-6 ${isLast ? "pb-0" : ""}`}
                >
                    <div className="text-[14px] font-semibold text-[#18181B] leading-[22px]">
                        {activity.title}
                    </div>

                    <div className="pl-4">
                        <div className="border-l-2 border-violet-500 pl-4 py-2 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] text-[#71717A]">Title:</span>
                                <span className="text-[12px] text-[#18181B] font-medium">
                                    {activity.jobTitle}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] text-[#71717A]">Status:</span>
                                <span
                                    className={`px-2 py-0.5 rounded text-[12px] font-semibold ${getStatusColors(
                                        activity.statusColor
                                    )}`}
                                >
                                    {activity.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[14px] text-[#71717A] mt-2 ml-[-16px]">
                            <User className="w-4 h-4" />
                            <span>{activity.user}</span>
                            <span>·</span>
                            <span>
                                {activity.date} at {activity.time}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const allChanges = activity.changes ?? [];
    const changesToShow = showAll ? allChanges : allChanges.slice(0, 2);
    const hasMore = allChanges.length > 2;

    return (
        <div className="flex gap-4 w-[348px]">
            <div className="flex flex-col items-center">
                <div className="w-[12px] h-[12px] rounded-full border-2 border-[#A1A1AA] mt-2" />
                {!isLast && (
                    <div className="flex-1 border-2 border-dashed border-[#E4E4E7] mt-1"></div>
                )}
            </div>
            <div className="flex-1 flex flex-col">
                <div className="text-[14px] font-semibold text-[#18181B] leading-[22px]">
                    {activity.title}
                </div>
                <div className="mt-3 pl-4">
                    <div className="border-l-2 border-violet-500 pl-4 py-2 flex flex-col gap-2">
                        {changesToShow.map((change, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col gap-1 text-[12px] leading-[18px] text-[#18181B]"
                            >
                                <div className="flex items-start gap-2">
                                    <span className="flex-shrink-0 text-[#71717A]">
                                        {change.label}:
                                    </span>

                                    <div className="flex-1 text-[12px] leading-[18px] text-[#18181B]">
                                        {!change.isLogo && (
                                            <span
                                                className={`line-through text-[#71717A] inline-block align-middle mr-1 ${change.isStatus
                                                    ? "px-2 py-0.5 rounded bg-gray-100"
                                                    : ""
                                                    }`}
                                            >
                                                {change.oldValue}
                                            </span>
                                        )}

                                        {change.isLogo && (
                                            <Avatar
                                                className="w-5 h-5 rounded-[4px] opacity-100 inline-block align-middle mr-1"
                                                style={{ width: 20, height: 20 }}
                                            >
                                                <AvatarImage
                                                    src={change.oldValue}
                                                    alt="Old Logo"
                                                    className="rounded-[4px]"
                                                    style={{ width: 20, height: 20 }}
                                                />
                                                <AvatarFallback className="rounded-[4px] text-[8px]">
                                                    NA
                                                </AvatarFallback>
                                            </Avatar>
                                        )}

                                        <ArrowRight className="inline-block align-middle mx-1 w-4 h-4 text-[#71717A]" />

                                        {!change.isLogo && (
                                            <span
                                                className={`font-semibold break-words inline align-middle ${change.isStatus
                                                    ? (() => {
                                                        const statusLower = change.newValue.toLowerCase();
                                                        if (statusLower === "open") return "bg-[#E0F2FE] text-[#075985]";
                                                        if (["closed", "won", "lost", "on hold"].includes(statusLower)) return "bg-[#ECFCCB] text-[#365314]";
                                                        return "bg-[#E0F2FE] text-[#075985]";
                                                    })() + " px-2 py-0.5 rounded inline-block"
                                                    : ""
                                                    }`}
                                            >
                                                {change.newValue}
                                            </span>
                                        )}

                                        {change.isLogo && (
                                            <Avatar
                                                className="w-5 h-5 rounded-[4px] opacity-100 inline-block align-middle ml-1"
                                                style={{ width: 20, height: 20 }}
                                            >
                                                <AvatarImage
                                                    src={change.newValue}
                                                    alt="New Logo"
                                                    className="rounded-[4px]"
                                                    style={{ width: 20, height: 20 }}
                                                />
                                                <AvatarFallback className="rounded-[4px] text-[8px]">
                                                    NA
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {hasMore && (
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="flex items-center gap-1 text-[12px] font-medium text-violet-600 hover:text-violet-700 mt-1"
                            >
                                <span>{showAll ? "Hide All" : "Show All"}</span>
                                {showAll ? (
                                    <ChevronUp className="w-3 h-3" />
                                ) : (
                                    <ChevronDown className="w-3 h-3" />
                                )}
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-[#71717A] mt-2 ml-[-16px]">
                        <User className="w-4 h-4" />
                        <span>{activity.user}</span>
                        <span>·</span>
                        <span>
                            {activity.date} at {activity.time}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};