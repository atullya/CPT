import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarItemProps {
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    label: string;
    path: string;
    isCollapsed: boolean;
    isActive?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
    icon: Icon,
    label,
    path,
    isCollapsed,
    isActive: externalIsActive
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = externalIsActive !== undefined ? externalIsActive : location.pathname === path;

    return (
        <div
            onClick={() => navigate(path)}
            className={`
        flex items-center ${isCollapsed ? 'rounded-md' : 'gap-2 rounded-md px-3 py-1 h-8'} cursor-pointer transition-colors
        ${isActive
                    ? "bg-violet-50 text-violet-700"
                    : "text-zinc-700 hover:bg-zinc-100"
                }
      `}
            style={isCollapsed ? {
                width: '40px',
                height: '32px',
                padding: '4px 12px',
                borderRadius: '6px',
                gap: '8px',
            } : {}}
        >
            <Icon
                className={`${isActive ? "text-violet-700" : "text-zinc-700"}`}
                style={{
                    width: '16px',
                    height: '16px',
                }}
            />

            {!isCollapsed && (
                <span
                    className={`
            font-semibold text-[14px] leading-[22px] md:block hidden
            ${isActive ? "text-violet-700" : "text-zinc-700"}
          `}
                >
                    {label}
                </span>
            )}
        </div>
    );
};
