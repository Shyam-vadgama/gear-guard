import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const variantStyles = {
  default: { iconBg: "bg-secondary", iconColor: "text-secondary-foreground" },
  primary: { iconBg: "bg-primary/10", iconColor: "text-primary" },
  success: { iconBg: "bg-status-success/10", iconColor: "text-status-success" },
  warning: { iconBg: "bg-status-warning/10", iconColor: "text-status-warning" },
  danger: { iconBg: "bg-status-critical/10", iconColor: "text-status-critical" },
  info: { iconBg: "bg-status-info/10", iconColor: "text-status-info" },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "primary",
  trend,
  className,
}: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card className={cn("glass-card floating-card overflow-hidden group", className)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <div className="flex items-baseline gap-2 mt-1.5">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</p>
              {trend && (
                <span className={cn("flex items-center gap-0.5 text-xs font-semibold", trend.isPositive ? "text-status-success" : "text-status-critical")}>
                  {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {trend.value}%
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground mt-1 truncate">{subtitle}</p>}
          </div>
          <div className={cn("p-2.5 sm:p-3 rounded-xl transition-transform duration-300 group-hover:scale-110", styles.iconBg)}>
            <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
