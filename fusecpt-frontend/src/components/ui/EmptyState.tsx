import React from 'react';

interface EmptyStateProps {
    icon: string;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
    variant?: "default" | "circle";
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title = "No search results found",
    description = "Please try again with a different search query.",
    action,
    className,
    variant = "default",
}) => {
    return (
        <div className={`flex justify-center items-center w-full h-[364px] ${className || ''}`}>
            <div className="flex flex-col items-center gap-4 w-full max-w-[1144px]">
                {variant === "circle" ? (
                    <div className="w-[80px] h-[80px] flex items-center justify-center rounded-[62px] bg-[#F4F4F5]">
                        <img src={icon} alt="No results" className="w-[40px] h-[40px] object-contain opacity-100" />
                    </div>
                ) : (
                    <div className="w-[122px] h-[81.41px] flex items-center justify-center">
                        <img src={icon} alt="No results" className="w-full h-full object-contain opacity-100" />
                    </div>
                )}

                <div className="flex flex-col items-center gap-1 w-full max-w-[1144px]">
                    <h3 className="text-zinc-900 font-medium text-lg leading-[50px] text-center">
                        {title}
                    </h3>

                    <p className="text-zinc-500 font-normal text-sm leading-[22px] text-center">
                        {description}
                    </p>

                    {action && (
                        <div className="mt-4">
                            {action}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmptyState;
