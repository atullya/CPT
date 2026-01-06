import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        purple: "bg-[#7C3AED] text-white shadow hover:bg-violet-700",
        white: "bg-white text-black shadow hover:bg-white-100",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "purple",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    disabled,
    loading = false,
    loadingText,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    const getStateClasses = () => {
      if (loading) {
        if (variant === "purple" || variant === "default" || !variant) {
          return "!bg-violet-700 !text-white cursor-not-allowed";
        }
        return "cursor-not-allowed opacity-70";
      }

      if (disabled) {
        if (variant === "purple" || variant === "default" || !variant) {
          return "!bg-[#9f9fa3] !text-white cursor-not-allowed";
        }
        if (variant === "white") {
          return "!bg-gray-200 !text-gray-400 cursor-not-allowed";
        }
        if (variant === "outline") {
          return "!bg-gray-100 !text-gray-400 cursor-not-allowed";
        }
        return "cursor-not-allowed opacity-50";
      }

      return "cursor-pointer";
    };

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          getStateClasses(),
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (loadingText || children) : children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };