import React from "react";

interface RadioOption {
    label: string;
    value: string;
}

interface RadioGroupProps {
    label: string;
    options: string[] | RadioOption[];
    selected: string;
    onChange: (val: string) => void;
    disabledOptions?: string[];
}

const RadioGroup: React.FC<RadioGroupProps> = ({
    label,
    options,
    selected,
    onChange,
    disabledOptions = [],
}) => {
    return (
        <div className="flex flex-col w-full max-w-[592px] gap-2">
            <label className="block text-[#18181B] font-semibold text-[14px] leading-[22px]">
                {label} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
                {options.map((opt) => {
                    const labelText = typeof opt === "string" ? opt : opt.label;
                    const value = typeof opt === "string" ? opt : opt.value;
                    const isDisabled = disabledOptions.includes(value);

                    return (
                        <label
                            key={value}
                            className={`cursor-pointer flex-1 min-w-[130px] ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <input
                                type="radio"
                                name={label}
                                value={value}
                                checked={selected === value}
                                onChange={() => !isDisabled && onChange(value)}
                                className="hidden"
                                disabled={isDisabled}
                            />
                            <div
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-full h-[38px] transition-colors ${selected === value ? "border-[#7C3AED] bg-[#F5F3FF]" : "border-gray-300 bg-white"
                                    }`}
                            >
                                <div className="relative w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center shrink-0">
                                    <div
                                        className={`w-2 h-2 rounded-full ${selected === value ? "bg-[#7C3AED]" : "bg-transparent"}`}
                                    ></div>
                                </div>
                                <span className="text-[#3F3F46] font-[Plus_Jakarta_Sans] text-[14px] leading-[22px]">{labelText}</span>
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export { RadioGroup };