import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        critical: "bg-status-critical text-white",
        normal: "bg-status-normal text-white",
        low: "bg-status-low text-white",
        overdue: "bg-status-overdue text-white animate-pulse",
        success: "bg-status-success text-white",
        warning: "bg-status-warning text-white",
        info: "bg-status-info text-white",
        new: "bg-kanban-new text-white",
        in_progress: "bg-kanban-progress text-white",
        repaired: "bg-kanban-repaired text-white",
        scrap: "bg-kanban-scrap text-white",
        active: "bg-status-success/20 text-status-success border border-status-success/30",
        inactive: "bg-muted text-muted-foreground border border-border",
        scrapped: "bg-destructive/20 text-destructive border border-destructive/30",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        default: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "normal",
      size: "default",
    },
  }
);

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

export function StatusBadge({ className, variant, size, children, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  );
}
