import React, { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "lucide-react";

interface FileUploadProps {
    label?: string;
    value: string | null;
    onChange: (val: string | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    label = "Client Logo",
    value,
    onChange
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col gap-3.5 w-full max-w-[592px]">
            <label className="text-[#18181B] font-[Plus_Jakarta_Sans] font-semibold text-[14px] leading-[22px]">
                {label}
            </label>
            <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                    {value ? (
                        <AvatarImage src={value} alt={label} className="w-full h-full object-cover" />
                    ) : (
                        <AvatarFallback className="flex items-center justify-center bg-gray-200 w-full h-full">
                            <User className="w-6 h-6 text-gray-500" />
                        </AvatarFallback>
                    )}
                </Avatar>
                <Button
                    variant="outline"
                    className="w-[125px] h-[37px] min-h-9 rounded-md border border-[#D4D4D8] bg-[#FFFFFF1A] px-4 py-[7.5px] text-sm font-normal flex items-center justify-center gap-0"
                    onClick={handleUploadClick}
                >
                    Upload Photo
                </Button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
        </div>
    );
};