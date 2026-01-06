import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    error?: string;
    onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void) | ((id: string, value: string) => void);
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
    ({ id, label, className, error, required, onChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                // Check if onChange expects (id, value) or (event)
                if (onChange.length === 2) {
                    // Custom callback: (id: string, value: string) => void
                    (onChange as (id: string, value: string) => void)(e.target.id, e.target.value);
                } else {
                    // Standard event handler: (e: React.ChangeEvent<HTMLInputElement>) => void
                    (onChange as (e: React.ChangeEvent<HTMLInputElement>) => void)(e);
                }
            }
        };

        return (
            <div className="flex flex-col w-full gap-1">
                <label
                    htmlFor={id}
                    className="block text-gray-900 font-semibold text-[15px] leading-[22px]"
                >
                    {label} {required && <span className="text-red-600">*</span>}
                </label>
                <input
                    id={id}
                    ref={ref}
                    className={cn(
                        "w-full h-9 min-h-9 rounded-md border border-[#E4E4E7] px-[3px] py-[7.5px] bg-[#FFFFFF] text-sm text-gray-900 focus:outline-none focus:ring-0",
                        error ? "border-red-500" : "border-[#E4E4E7]",
                        className
                    )}
                    onChange={handleChange}
                    {...props}
                />
                {error && (
                    <p className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </p>
                )}
            </div>
        );
    }
);

TextInput.displayName = "TextInput";

export { TextInput };