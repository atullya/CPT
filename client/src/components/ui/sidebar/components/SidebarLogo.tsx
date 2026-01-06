import React from "react";
import logo1 from "../../../../assets/logo1.svg";
import logo2 from "../../../../assets/logo2.svg";
interface SidebarLogoProps {
  className?: string;
}

export const SidebarLogo: React.FC<SidebarLogoProps> = ({ className = "" }) => {
  return (
    <div className={`w-[27px] h-[24px] relative flex ${className}`}>
      <div className="absolute top-0 left-0 w-[12.1659px] h-[16.3524px]">
        <img src={logo1} alt="logo-left" className="w-full h-full" />
      </div>

      <div className="absolute top-[0.02px] left-[10.67px] w-[16.3316px] h-[24.0334px]">
        <img src={logo2} alt="logo-right" className="w-full h-full" />
      </div>
    </div>
  );
};
