import React, { useState } from 'react';
import { PanelRight } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface SidebarToggleProps {
    isCollapsed: boolean;
    onToggle: () => void;
    tooltipText: string;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({
    isCollapsed,
    onToggle,
    tooltipText
}) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <button
                onClick={onToggle}
                className={`rounded-[8px] bg-transparent hover:bg-gray-200 flex items-center justify-center ${isCollapsed ? '' : 'w-9 h-9 min-w-[36px] min-h-[36px] p-0.5'
                    }`}
                style={isCollapsed ? {
                    width: '40px',
                    height: '32px',
                    padding: '4px 12px',
                    borderRadius: '6px',
                } : {}}
            >
                <PanelRight
                    className="text-gray-700 transition-transform duration-300"
                    style={{
                        width: '16px',
                        height: '16px',
                        transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                />
            </button>

            {isHovering && !isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2">
                    <Tooltip text={tooltipText} />
                </div>
            )}
        </div>
    );
};
