import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ id, label, className, error, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className="relative w-full">
                <Label htmlFor={id} className="text-base font-medium text-[#18181B]">
                    {label}
                </Label>
                <div className="relative mt-1">
                    <Input
                        id={id}
                        type={showPassword ? "text" : "password"}
                        className={cn(
                            "pr-10",
                            error ? "border-[#DC2626]" : "border-[#D4D4D8]",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#71717A]"
                    >
                        {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                </div>
                {error && (
                    <div className="flex items-center gap-1 text-[#DC2626] text-sm mt-1">
                        <AlertCircle className="shrink-0 w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };