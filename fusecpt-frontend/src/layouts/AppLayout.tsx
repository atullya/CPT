import React from "react";
import Sidebar from "@/components/ui/sidebar/Sidebar";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isJobsPage = location.pathname === '/jobs';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAFAFA]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Body Section */}
      <main className={`flex-1 bg-[#FAFAFA] p-4 overflow-y-auto ${isJobsPage ? 'scrollbar-hide' : ''}`}>
        {children || (
          <div className="text-gray-500 text-center mt-10">
            Main content area (body side) goes here.
          </div>
        )}
      </main>
    </div>
  );
};

export default AppLayout;