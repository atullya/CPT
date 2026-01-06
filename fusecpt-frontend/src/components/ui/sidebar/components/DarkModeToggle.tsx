import React from 'react';

interface DarkModeToggleProps {
    darkMode: boolean;
    onToggle: () => void;
    compact?: boolean;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
    darkMode,
    onToggle,
    compact = false
}) => {
    if (compact) {
        return (
            <div
                className="flex items-center justify-center"
                style={{
                    height: '18px',
                }}
            >
                <button
                    onClick={onToggle}
                    className={`flex items-center rounded-full transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-300"
                        }`}
                    style={{
                        width: '33px',
                        height: '18px',
                        padding: '1px',
                    }}
                >
                    <div
                        className={`rounded-full bg-white transform transition-transform duration-300 ${darkMode ? "translate-x-[15px]" : "translate-x-0"
                            }`}
                        style={{
                            width: '16px',
                            height: '16px',
                        }}
                    />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between border border-[#E4E4E7] bg-white rounded-lg px-3 py-2">
            <span className="text-sm text-gray-800">Dark Mode</span>
            <button
                onClick={onToggle}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-300"
                    }`}
            >
                <div
                    className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${darkMode ? "translate-x-5" : "translate-x-0"
                        }`}
                />
            </button>
        </div>
    );
};
