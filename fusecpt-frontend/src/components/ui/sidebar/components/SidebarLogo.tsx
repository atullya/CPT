import React from "react";

interface SidebarLogoProps {
  className?: string;
}

export const SidebarLogo: React.FC<SidebarLogoProps> = ({ className = "" }) => {
  return (
    <div className={`w-[27px] h-[24px] relative flex ${className}`}>
      <div className="absolute top-0 left-0 w-[12.1659px] h-[16.3524px]">
        <img
          src="/src/assets/logo1.svg"
          alt="logo-left"
          className="w-full h-full"
        />
      </div>

      <div className="absolute top-[0.02px] left-[10.67px] w-[16.3316px] h-[24.0334px]">
        <img
          src="/src/assets/logo2.svg"
          alt="logo-right"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
