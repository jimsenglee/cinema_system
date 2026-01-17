import React from "react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * ConfirmDialog component props
 */
export interface ConfirmDialogProps {
  /**
   * Whether dialog is open
   */
  open: boolean;
  
  /**
   * Callback when dialog should close
   */
  onOpenChange: (open: boolean) => void;
  
  /**
   * Dialog title
   */
  title: string;
  
  /**
   * Dialog description/message
   */
  description: string;
  
  /**
   * Confirm button text
   * @default "Continue"
   */
  confirmText?: string;
  
  /**
   * Cancel button text
   * @default "Cancel"
   */
  cancelText?: string;
  
  /**
   * Callback when user confirms
   */
  onConfirm: () => void;
  
  /**
   * Callback when user cancels (optional, defaults to just closing)
   */
  onCancel?: () => void;
  
  /**
   * Variant for styling the confirm button
   * @default "default"
   */
  variant?: "default" | "destructive";
  
  /**
   * Whether action is loading
   * @default false
   */
  loading?: boolean;
}

/**
 * Reusable confirmation dialog component
 * 
 * Features:
 * - Built on AlertDialog for accessibility
 * - Customizable text and variants
 * - Loading state support
 * - Destructive action support (red button)
 * 
 * @example
 * <ConfirmDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   title="Delete Booking?"
 *   description="This action cannot be undone."
 *   variant="destructive"
 *   onConfirm={handleDelete}
 * />
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  loading = false
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/60">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={handleCancel}
            disabled={loading}
            className="bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-700"
          >
            {cancelText}
          </AlertDialogCancel>
          
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "min-w-[100px]",
              variant === "destructive" 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            )}
          >
            {loading ? "Loading..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
