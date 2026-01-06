import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "destructive" | "primary" | "custom";
  confirmButtonClass?: string;
  contentClassName?: string;
  innerClassName?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  children,
  isLoading,
  disabled,
  variant = "primary",
  confirmButtonClass,
  contentClassName,
  innerClassName,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("bg-white p-0 gap-0 flex flex-col", contentClassName)}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div
          className={cn(
            "flex flex-col h-full w-full gap-4",
            innerClassName || "p-2 sm:p-8"
          )}
        >
          <DialogHeader className="p-0 space-y-0 text-left">
            <DialogTitle className="font-plusJakarta font-semibold text-[20px] leading-[24px] text-[#18181B]">
              {title}
            </DialogTitle>
          </DialogHeader>

          {description && (
            <div className="font-plusJakarta font-normal text-[14px] leading-[22px] text-[#71717A]">
              {description}
            </div>
          )}

          {children}

          <div className="flex justify-end gap-2 mt-auto">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-[37px] px-4 rounded-md bg-white text-[#18181B] font-plusJakarta border-zinc-200"
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={disabled || isLoading}
              className={cn(
                "h-[37px] px-4 rounded-md font-plusJakarta text-white",
                variant === "destructive" && "bg-[#DC2626] hover:bg-red-700",
                variant === "primary" && "bg-[#18181B]",
                confirmButtonClass
              )}
            >
              {isLoading ? "Loading..." : confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  saveText?: string;
  cancelText?: string;
  isSaving?: boolean;
  saveEnabled?: boolean;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  saveButtonClass?: string;
  cancelButtonClass?: string;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  children,
  onSave,
  saveText = "Save",
  cancelText = "Cancel",
  isSaving,
  saveEnabled = true,
  contentClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
  saveButtonClass,
  cancelButtonClass,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "bg-white rounded-lg shadow-lg flex flex-col p-0",
          contentClassName
        )}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className={cn("p-4", headerClassName)}>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div
          className={cn(
            "flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200",
            bodyClassName
          )}
        >
          {children}
        </div>

        <div className={cn("flex justify-end gap-2 p-4", footerClassName)}>
          <Button
            variant="outline"
            className={cn("w-24", cancelButtonClass)}
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            {cancelText}
          </Button>

          <Button
            className={cn(
              "w-32",
              saveEnabled
                ? "bg-[#7C3AED] text-white hover:bg-[#6d2ed8]"
                : "bg-gray-400 text-white cursor-not-allowed",
              saveButtonClass
            )}
            onClick={onSave}
            disabled={!saveEnabled || isSaving}
          >
            {isSaving ? "Saving..." : saveText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
