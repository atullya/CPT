import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    label?: string;
    error?: string;
    onChange?: ((e: React.ChangeEvent<HTMLTextAreaElement>) => void) | ((id: string, value: string) => void);
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ id, label, className, error, required, onChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (onChange) {
                // Check if onChange expects (id, value) or (event)
                if (onChange.length === 2) {
                    // Custom callback: (id: string, value: string) => void
                    (onChange as (id: string, value: string) => void)(e.target.id, e.target.value);
                } else {
                    // Standard event handler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
                    (onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void)(e);
                }
            }
        };

        return (
            <div className="flex flex-col w-full gap-1">
                <label
                    htmlFor={id}
                    className="block text-[#18181B] font-medium text-[14px] leading-[150%] tracking-[1.5%]"
                >
                    {label} {required && <span className="text-red-600">*</span>}
                </label>
                <textarea
                    id={id}
                    ref={ref}
                    className={cn(
                        "w-full h-[76px] rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-gray-900 resize focus:outline-none focus:ring-0",
                        error ? "border-red-500" : "border-[#E4E4E7]",
                        className
                    )}
                    onChange={handleChange}
                    {...props}
                />
                {error && (
                    <p className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

export { Textarea };