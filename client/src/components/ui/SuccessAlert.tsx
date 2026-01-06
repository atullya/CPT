import React, { useEffect } from 'react';
import { CheckCircle2, Trash, Pencil } from 'lucide-react';

interface SuccessAlertProps {
  show: boolean;
  message: string;
  subtitle?: string;
  onDismiss: () => void;
  alertType: "create" | "delete" | "update";
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ show, message, subtitle, alertType, onDismiss }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onDismiss(), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  if (!show) return null;

  const renderIcon = () => {
    switch (alertType) {
      case "delete":
        return <Trash className="w-4 h-4 text-green-600" />;
      case "update":
        return <Pencil className="w-4 h-4 text-green-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    }
  };

  // Two-line layout when subtitle is provided
  if (subtitle) {
    return (
      <div className="fixed top-8 right-8 w-[311px] h-[99px] bg-white border border-zinc-200 rounded-lg shadow-[0px_1px_2px_5px_rgba(0,0,0,0.1),0px_1px_3px_10px_rgba(0,0,0,0.1)] p-4 opacity-100 animate-in fade-in duration-300 z-50">
        <div className="flex flex-col gap-0">
          {/* First line - message with left padding to align with second line text */}
          <span className="text-sm font-medium text-green-600 leading-[22px] pl-6">
            {message}
          </span>

          {/* Second line - icon + subtitle */}
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 mt-[3px]">
              {renderIcon()}
            </div>
            <span className="text-sm font-normal text-zinc-500 leading-[22px]">
              {subtitle}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Original single-line layout
  return (
    <div className="fixed top-12 right-8 w-72 h-[54px] bg-white border border-zinc-200 rounded-lg shadow-lg p-1 opacity-100 animate-in fade-in duration-300 z-50">
      <div className="w-64 h-[22px] gap-3 flex items-center justify-between mx-auto mt-[14px]">
        {/* Left icon section */}
        <div className="w-4 h-[22px] gap-2 flex items-start">
          <div className="w-4 h-4 pt-[3px]">
            {renderIcon()}
          </div>
        </div>

        {/* Right message section */}
        <div className="w-[228px] h-[22px] gap-px flex items-center justify-between">
          <span className="text-sm  text-green-600 font-normal leading-[22px] flex-1">
            {message}
          </span>
          <button
            className="text-sm text-green-600 hover:text-green-700 hover:underline font-medium leading-[22px] whitespace-nowrap"

          >
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert;