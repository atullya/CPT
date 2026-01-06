import React from "react";
import { Check, X } from "lucide-react";

interface PasswordRuleProps {
    label: string;
    isValid: boolean | null;
}

const PasswordRule: React.FC<PasswordRuleProps> = ({ label, isValid }) => {
    let icon;
    let colorClass;

    if (isValid === null) {
        icon = <Check className="w-3 h-3 text-[#A1A1AA]" />;
        colorClass = "border-[#A1A1AA]";
    } else if (isValid) {
        icon = <Check className="w-3 h-3 text-[#22C55E]" />;
        colorClass = "border-[#22C55E]";
    } else {
        icon = <X className="w-3 h-3 text-[#DC2626]" />;
        colorClass = "border-[#DC2626]";
    }

    return (
        <div className="flex items-center gap-2">
            <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
            >
                {icon}
            </div>
            <span className="w-[322px] h-[22px] font-sans font-normal text-[14px] leading-[22px] tracking-[0px] text-[#71717A]">
                {label}
            </span>
        </div>
    );
};

export { PasswordRule };