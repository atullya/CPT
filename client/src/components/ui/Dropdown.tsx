import React, { useEffect, useRef } from "react";
import { ChevronDown, AlertCircle, Check, ChevronRight } from "lucide-react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";



interface DropdownProps {
    id: string;
    label: string;
    options: string[];
    value: string;
    open: boolean;
    setOpen: (val: boolean) => void;
    onSelect: (val: string) => void;
    error?: string;
    multi?: boolean;
    selectedOptions?: string[];
}

export const Dropdown: React.FC<DropdownProps> = ({
    id,
    label,
    options,
    value,
    open,
    setOpen,
    onSelect,
    error,
    multi = false,
    selectedOptions = [],
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setOpen]);

    return (
        <div ref={dropdownRef} className="flex flex-col w-full max-w-[592px] gap-1 relative">
            <label
                htmlFor={id}
                className="block text-gray-900 font-semibold text-[15px] leading-[22px]"
            >
                {label} <span className="text-red-600">*</span>
            </label>

            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`w-full h-9 min-h-9 rounded-md border px-[3px] py-[7.5px] bg-white text-sm text-[#71717A] flex items-center justify-between focus:outline-none ${error ? "border-red-500" : "border-[#E4E4E7]"
                    }`}
            >
                {value ? value : `Select ${label.toLowerCase()}`}
                <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {open && (
                <ul className="absolute z-50 mt-1 w-full bg-white border border-[#E5E5E5] rounded-md shadow-md flex flex-col gap-1 p-1 max-h-[200px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden top-full">
                    {options.map((option) => {
                        const isSelected = multi
                            ? selectedOptions.includes(option)
                            : value === option;

                        return (
                            <li
                                key={option}
                                onClick={() => {
                                    onSelect(option);
                                    if (!multi) setOpen(false);
                                }}
                                className="cursor-pointer px-3 py-2 rounded text-sm hover:bg-gray-100 text-gray-800 flex items-center justify-between"
                            >
                                {option}
                                {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                            </li>
                        );
                    })}
                </ul>
            )}

            {error && (
                <p className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-4 h-4" /> {error}
                </p>
            )}
        </div>
    );
};



const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        className={cn(
            "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
            inset && "pl-8",
            className
        )}
        {...props}
    >
        {children}
        <ChevronRight className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
    DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={cn(
            "z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 shadow-lg",
            className
        )}
        {...props}
    />
));
DropdownMenuSubContent.displayName =
    DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                "z-50 min-w-32 rounded-md border bg-popover p-1 shadow-md",
                className
            )}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent",
            inset && "pl-8",
            className
        )}
        {...props}
    />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, checked, children, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        checked={checked}
        className={cn(
            "relative flex items-center pl-8 pr-2 py-1.5 text-sm rounded-sm outline-none focus:bg-accent",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex items-center justify-center w-3.5 h-3.5">
            <DropdownMenuPrimitive.ItemIndicator>
                <Check className="h-4 w-4" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
    DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
        ref={ref}
        className={cn(
            "relative flex items-center pl-8 pr-2 py-1.5 text-sm rounded-sm outline-none",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex items-center justify-center w-4 h-4">
            <div className="w-4 h-4 border rounded-full flex items-center justify-center">
                <DropdownMenuPrimitive.ItemIndicator>
                    <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                </DropdownMenuPrimitive.ItemIndicator>
            </div>
        </span>
        {children}
    </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName =
    DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
        {...props}
    />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={cn("bg-muted h-px my-1 -mx-1", className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
    <span className={cn("ml-auto text-xs opacity-60 tracking-widest", className)} {...props} />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
};