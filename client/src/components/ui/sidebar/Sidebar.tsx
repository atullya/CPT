import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  PanelRight,
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
} from "lucide-react";
import { Tooltip } from "./components/Tooltip";
import { SidebarLogo } from "./components/SidebarLogo";
import { SidebarToggle } from "./components/SidebarToggle";
import { SidebarItem } from "./components/SidebarItem";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { UserSection } from "./components/UserSection";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);

  return (
    <div
      className={`relative z-20 flex flex-col h-screen bg-[#FAFAFA] gap-2.5 transition-all duration-300 ${
        isCollapsed ? "w-14 border-r border-[#E4E4E7]" : "w-64"
      }`}
    >
      <div className="flex flex-col grow">
        <div
          className={`w-full flex items-center justify-between ${
            isCollapsed ? "h-16 p-2" : "px-2 py-2"
          }`}
        >
          {isCollapsed ? (
            <div
              className="flex items-center justify-center w-full cursor-pointer relative"
              onMouseEnter={() => setIsHoveringLogo(true)}
              onMouseLeave={() => setIsHoveringLogo(false)}
              onClick={() => setIsCollapsed(false)}
            >
              {isHoveringLogo && <Tooltip text="Open sidebar" />}

              <SidebarLogo
                className={`transition-opacity duration-200 ${
                  isHoveringLogo ? "opacity-0" : "opacity-100"
                }`}
              />

              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                  isHoveringLogo ? "opacity-100" : "opacity-0"
                }`}
              >
                <PanelRight className="text-gray-700 w-4 h-4 rotate-180" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 min-w-0 flex-1 pl-3">
                <SidebarLogo />
                <div className="flex items-center md:block">
                  <span
                    className="
        font-inter 
        font-semibold 
        text-[24px] 
        leading-7 
        tracking-[0px] 
        text-[#6D28D9] 
        whitespace-nowrap
        hover:cursor-default
    "
                  >
                    CPT
                  </span>
                </div>
              </div>

              <SidebarToggle
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(true)}
                tooltipText="Close sidebar"
              />
            </>
          )}
        </div>

        {/* Sidebar Items Section */}
        <div
          className={`flex flex-col flex-1 ${
            isCollapsed ? "p-2 gap-[326px]" : "p-2 gap-2"
          }`}
        >
          <div
            className={`w-full flex flex-col ${
              isCollapsed ? "gap-2" : "gap-2"
            }`}
          >
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              path="/dashboard"
              isCollapsed={isCollapsed}
            />

            <SidebarItem
              icon={BriefcaseBusiness}
              label="Job Listing"
              path="/jobs"
              isCollapsed={isCollapsed}
              isActive={
                location.pathname === "/jobs" ||
                location.pathname.startsWith("/candidates")
              }
            />

            <SidebarItem
              icon={Users}
              label="Users"
              path="/users"
              isCollapsed={isCollapsed}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        className={`mt-auto ${
          isCollapsed
            ? "flex items-center justify-center w-14 h-[82px] p-2"
            : ""
        }`}
      >
        <div
          className={`${
            isCollapsed
              ? "flex flex-col items-center gap-3"
              : "p-3 flex flex-col gap-3"
          }`}
        >
          <DarkModeToggle
            darkMode={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
            compact={isCollapsed}
          />

          <UserSection collapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
