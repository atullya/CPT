import React from "react";
import { XCircle } from "lucide-react";

interface DisabledJobAlertProps {
    show: boolean;
    message: string;
}

const DisabledJobAlert: React.FC<DisabledJobAlertProps> = ({ show, message }) => {
    if (!show) return null;

    return (
        <div className="absolute top-8 right-4 z-50">
            <div className="w-[400px] h-[76px] p-1 border border-gray-200 rounded-lg bg-white flex items-center gap-4 shadow-md">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-3" />
                <p className="text-sm text-red-600 font-medium">{message}</p>
            </div>
        </div>
    );
};

export default DisabledJobAlert;
