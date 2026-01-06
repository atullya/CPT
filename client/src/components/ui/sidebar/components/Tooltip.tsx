import React from "react";

interface TooltipProps {
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  return (
    <div className="absolute left-full ml-2 z-50">
      <div className="relative flex items-center">
        {/* Arrow */}
        <div
          className="absolute -left-2 w-0 h-0 
          border-t-[8px] border-t-transparent 
          border-b-[8px] border-b-transparent 
          border-r-[8px] border-r-[#09090B]"
        ></div>

        {/* Tooltip box */}
        <div
          className="
          w-[95px] 
          h-[30px]
          bg-[#09090B] 
          text-white 
          flex 
          items-center 
          justify-center
          rounded-[8px]
          px-2
        "
        >
          <div
            className="text-white"
            style={{
              width: "79px",
              height: "18px",
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
            }}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};
