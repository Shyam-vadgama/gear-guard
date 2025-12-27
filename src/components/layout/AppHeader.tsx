import { Bell, Search, User, Cog, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/context/AppContext";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AppHeader() {
  const { requests, user, logout } = useApp();
  const navigate = useNavigate();
  const criticalCount = requests.filter(r => r.priority === 'critical' && r.status !== 'repaired' && r.status !== 'scrap').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 sm:h-16 bg-card/80 backdrop-blur-xl border-b border-border/40 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 gap-4 transition-colors duration-300">
      {/* Mobile Menu & Logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <MobileNav />
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-7 h-7 flex items-center justify-center">
            <Cog className="w-7 h-7 text-primary gear-spin absolute" />
          </div>
          <span className="text-base font-bold tracking-tight hidden xs:inline group-hover:text-primary transition-colors">
            GearGuard
          </span>
        </Link>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search equipment, requests..."
            className="pl-10 bg-secondary/40 border-border/40 focus:bg-background focus:border-primary/40 h-10 text-sm transition-all duration-200 rounded-xl"
          />
        </div>
      </div>

      {/* Mobile Search */}
      <Button variant="ghost" size="icon" className="sm:hidden h-9 w-9 hover:bg-secondary/80">
        <Search className="h-5 w-5 text-muted-foreground" />
      </Button>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 hover:bg-secondary/80">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {criticalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-status-critical text-white text-[10px] font-bold pulse-notification animate-bounce-in">
                  {criticalCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 animate-scale-in">
            <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer hover:bg-status-critical/5">
              <span className="font-medium text-status-critical">Critical: Spindle vibration issue</span>
              <span className="text-xs text-muted-foreground">CNC Milling Machine - Unassigned</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer hover:bg-status-warning/5">
              <span className="font-medium text-status-warning">Overdue: Hydraulic leak repair</span>
              <span className="text-xs text-muted-foreground">Hydraulic Press - 2 days overdue</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-primary font-medium cursor-pointer justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-2 sm:pr-3 h-9 hover:bg-secondary/80">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-primary/20 transition-all hover:ring-primary/40">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs sm:text-sm font-semibold">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium leading-none">{user?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user?.role || "Role"}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 animate-scale-in">
            <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer focus:text-destructive gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
