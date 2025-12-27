import { LucideIcon, Plus, Wrench, Box, Calendar, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface QuickAction {
  icon: LucideIcon;
  label: string;
  description: string;
  href: string;
  gradient: string;
}

const quickActions: QuickAction[] = [
  {
    icon: Plus,
    label: "New Request",
    description: "Create maintenance request",
    href: "/maintenance",
    gradient: "from-primary/10 to-primary/5",
  },
  {
    icon: Box,
    label: "Add Equipment",
    description: "Register new asset",
    href: "/equipment",
    gradient: "from-status-success/10 to-status-success/5",
  },
  {
    icon: QrCode,
    label: "Scan QR",
    description: "Quick equipment lookup",
    href: "/scanner",
    gradient: "from-accent/10 to-accent/5",
  },
  {
    icon: Calendar,
    label: "Schedule",
    description: "View maintenance calendar",
    href: "/schedule",
    gradient: "from-status-info/10 to-status-info/5",
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {quickActions.map((action, index) => (
        <button
          key={action.label}
          onClick={() => navigate(action.href)}
          className={cn(
            "group relative flex flex-col items-center justify-center gap-3 p-5 sm:p-6 rounded-2xl",
            "bg-card border border-border/50 transition-all duration-300",
            "hover:border-primary/30 hover:shadow-lg cursor-pointer overflow-hidden",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
          )}
          style={{ animationDelay: `${index * 75}ms` }}
        >
          {/* Gradient background on hover */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            action.gradient
          )} />
          
          <div className={cn(
            "relative z-10 p-3.5 rounded-2xl bg-secondary/60 transition-all duration-300",
            "group-hover:scale-110 group-hover:bg-primary/10"
          )}>
            <action.icon className={cn(
              "h-6 w-6 text-muted-foreground transition-colors duration-300",
              "group-hover:text-primary"
            )} />
          </div>
          <div className="relative z-10 text-center">
            <p className="text-sm font-semibold group-hover:text-foreground transition-colors">{action.label}</p>
            <p className="text-xs text-muted-foreground hidden sm:block mt-1">
              {action.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
