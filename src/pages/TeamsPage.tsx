import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail, DollarSign, Wrench, Plus } from "lucide-react";

export default function TeamsPage() {
  const { teams, requests } = useApp();

  const getTeamStats = (teamId: string) => {
    const teamRequests = requests.filter(r => r.teamId === teamId);
    return {
      total: teamRequests.length,
      open: teamRequests.filter(r => r.status !== 'repaired' && r.status !== 'scrap').length,
      completed: teamRequests.filter(r => r.status === 'repaired').length,
    };
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground mt-0.5 sm:mt-1 text-sm sm:text-base">
            Manage maintenance teams and technicians
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Team
        </Button>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {teams.map((team) => {
          const stats = getTeamStats(team.id);
          return (
            <Card key={team.id} className="glass-card overflow-hidden animate-fade-in card-hover">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">{team.name}</CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{team.specialization}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-secondary/30">
                    <p className="text-base sm:text-lg font-bold">{stats.total}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="p-1.5 sm:p-2 rounded-lg bg-status-warning/10">
                    <p className="text-base sm:text-lg font-bold text-status-warning">{stats.open}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Open</p>
                  </div>
                  <div className="p-1.5 sm:p-2 rounded-lg bg-status-success/10">
                    <p className="text-base sm:text-lg font-bold text-status-success">{stats.completed}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Done</p>
                  </div>
                </div>

                {/* Members */}
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Team Members</p>
                  <div className="space-y-1.5 sm:space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin">
                    {team.members.map((member) => (
                      <div 
                        key={member.id}
                        className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                            <AvatarFallback className="text-[10px] sm:text-xs bg-primary/10 text-primary">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium truncate">{member.name}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{member.role}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-[10px] sm:text-xs flex-shrink-0 ml-2">
                          ${member.hourlyRate}/hr
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9">
                    <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">View</span> Tasks
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
