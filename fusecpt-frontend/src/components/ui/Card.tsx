import * as React from "react"
import { MoreVertical, CalendarCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      //"rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export interface CandidateCardMenuItem {
  label: string;
  icon: React.ReactElement | null;
  onClick: () => void;
  className?: string;
  isDivider?: boolean;
}


export interface CandidateCardProps {
  name: string;
  statusLabel?: string;
  statusBadge?: {
    text: string;
    className?: string;
  };
  menuItems?: CandidateCardMenuItem[];
  className?: string;
}

export const CandidateCard = React.forwardRef<HTMLDivElement, CandidateCardProps>(
  ({ name, statusLabel, statusBadge, menuItems = [], className }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
      <Card
        ref={ref}
        className={cn(
          "relative w-full min-h-[76px] bg-white border border-zinc-200 rounded-lg flex flex-col shadow-none p-0",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="h-[38px] flex items-center justify-between pt-2 px-2">
          <span className="font-plusJakarta font-semibold text-[14px] truncate">
            {name}
          </span>

          {isHovered && menuItems.length > 0 && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <MoreVertical className="w-4 h-4 text-zinc-600" />
            </button>
          )}
        </div>

        {/* Info */}
        <div className="h-[38px] flex justify-between items-center px-2 pb-2">
          {statusLabel && (
            <div className="h-[22px] rounded bg-[#F4F4F5] px-1 flex items-center gap-1">
              <CalendarCheck className="w-3 h-3 text-zinc-600" />
              <span className="text-[12px] text-[#52525B]">
                {statusLabel}
              </span>
            </div>
          )}

          {statusBadge && (
            <span className={cn(
              "h-6 rounded px-1 flex items-center text-[12px]",
              statusBadge.className
            )}>
              {statusBadge.text}
            </span>
          )}
        </div>

        {/* Menu */}
        {isMenuOpen && menuItems.length > 0 && (
          <>
            <div
              className="inset-0 z-10 h-22"
              onClick={() => setIsMenuOpen(false)}
            />

            <div className="absolute right-0 top-10 z-20 w-60 bg-white border border-[#E5E5E5] rounded-lg shadow-lg p-0.5">
              {menuItems.map((item, index) => (
                item.isDivider ? (
                  <div key={index} className="h-px bg-zinc-200 my-1" />
                ) : (
                  <div
                    key={index}
                    onClick={() => {
                      item.onClick();
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 cursor-pointer",
                      item.className || "hover:bg-gray-50"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                )
              ))}
            </div>
          </>
        )}
      </Card>
    );
  }
);

CandidateCard.displayName = "CandidateCard";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
