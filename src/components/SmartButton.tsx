import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SmartButtonProps {
  icon: LucideIcon;
  label: string;
  count?: number;
  onClick?: () => void;
  variant?: "default" | "primary" | "warning" | "success";
  className?: string;
}

export function SmartButton({ 
  icon: Icon, 
  label, 
  count, 
  onClick, 
  variant = "default",
  className 
}: SmartButtonProps) {
  const variants = {
    default: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground",
    warning: "bg-accent hover:bg-accent/90 text-accent-foreground",
    success: "bg-status-success hover:bg-status-success/90 text-white",
  };

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "relative h-auto px-2.5 sm:px-4 py-2 sm:py-3 flex flex-col items-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 active:scale-95",
        variants[variant],
        className
      )}
    >
      <div className="relative">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        {count !== undefined && count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] flex items-center justify-center rounded-full bg-status-critical text-white text-[9px] sm:text-[10px] font-bold animate-bounce-in">
            {count}
          </span>
        )}
      </div>
      <span className="text-[10px] sm:text-xs font-medium">{label}</span>
    </Button>
  );
}
