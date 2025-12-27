import { useApp } from "@/context/AppContext";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { QuickActions } from "@/components/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Box, 
  Wrench, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  DollarSign,
  TrendingUp,
  Activity,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";

const maintenanceData = [
  { month: 'Jan', corrective: 12, preventive: 8 },
  { month: 'Feb', corrective: 15, preventive: 10 },
  { month: 'Mar', corrective: 10, preventive: 12 },
  { month: 'Apr', corrective: 8, preventive: 14 },
  { month: 'May', corrective: 14, preventive: 11 },
  { month: 'Jun', corrective: 11, preventive: 13 },
];

const statusDistribution = [
  { name: 'New', value: 2, color: 'hsl(199, 89%, 48%)' },
  { name: 'In Progress', value: 2, color: 'hsl(38, 92%, 50%)' },
  { name: 'Repaired', value: 1, color: 'hsl(142, 71%, 45%)' },
  { name: 'Scrap', value: 1, color: 'hsl(220, 9%, 46%)' },
];

export default function Dashboard() {
  const { stats, requests, equipment } = useApp();
  const navigate = useNavigate();

  const recentRequests = requests.slice(0, 4);
  const criticalEquipment = equipment.filter(eq => eq.openRequestsCount > 0).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
            <Sparkles className="h-5 w-5 text-accent animate-float" />
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Monitor your equipment and maintenance operations
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-card/80 backdrop-blur px-4 py-2 rounded-full border border-border/50 shadow-sm">
          <div className="relative">
            <Activity className="h-4 w-4 text-status-success" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-status-success rounded-full animate-pulse" />
          </div>
          <span className="text-muted-foreground hidden sm:inline">System: </span>
          <StatusBadge variant="success" size="sm">Operational</StatusBadge>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</h2>
        <QuickActions />
      </section>

      {/* Stats Grid */}
      <section className="grid gap-4 grid-cols-2 lg:grid-cols-4 stagger-fade-in">
        <StatsCard
          title="Total Equipment"
          value={stats.totalEquipment}
          subtitle={`${stats.activeEquipment} active`}
          icon={Box}
          variant="primary"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Open Requests"
          value={stats.openRequests}
          subtitle={`${stats.criticalRequests} critical`}
          icon={Wrench}
          variant="warning"
        />
        <StatsCard
          title="Overdue"
          value={stats.overdueRequests}
          subtitle="Require attention"
          icon={AlertTriangle}
          variant="danger"
        />
        <StatsCard
          title="Completed"
          value={stats.completedThisMonth}
          subtitle="This month"
          icon={CheckCircle2}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
      </section>

      {/* Charts Row */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Maintenance Trends */}
        <Card className="lg:col-span-2 glass-card overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                Maintenance Trends
              </CardTitle>
              <div className="flex items-center gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-status-critical" />
                  <span className="text-muted-foreground">Corrective</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-status-info" />
                  <span className="text-muted-foreground">Preventive</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[260px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={maintenanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="correctiveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="preventiveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" tickLine={false} axisLine={false} />
                  <YAxis className="text-xs fill-muted-foreground" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '16px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    }}
                    labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="corrective" 
                    stroke="hsl(0, 84%, 60%)" 
                    fill="url(#correctiveGradient)" 
                    strokeWidth={2.5}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="preventive" 
                    stroke="hsl(199, 89%, 48%)" 
                    fill="url(#preventiveGradient)" 
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              Request Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                  <span className="text-xs font-bold ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Bottom Row */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent Requests */}
        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Wrench className="h-4 w-4 text-primary" />
                </div>
                Recent Requests
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs gap-1.5 hover:bg-primary/5 hover:text-primary"
                onClick={() => navigate('/maintenance')}
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {recentRequests.map((request, index) => (
                <div 
                  key={request.id} 
                  className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 cursor-pointer group"
                  onClick={() => navigate('/maintenance')}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{request.subject}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {request.equipmentName}
                    </p>
                  </div>
                  <StatusBadge variant={request.priority} size="sm">{request.priority}</StatusBadge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipment Needing Attention */}
        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                <div className="p-1.5 rounded-lg bg-accent/10">
                  <AlertTriangle className="h-4 w-4 text-accent" />
                </div>
                Needs Attention
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs gap-1.5 hover:bg-primary/5 hover:text-primary"
                onClick={() => navigate('/equipment')}
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {criticalEquipment.map((eq, index) => (
                <div 
                  key={eq.id} 
                  className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 cursor-pointer group"
                  onClick={() => navigate('/equipment')}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{eq.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {eq.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge variant={eq.status} size="sm">{eq.status}</StatusBadge>
                    {eq.openRequestsCount > 0 && (
                      <span className="flex items-center justify-center min-w-[22px] h-[22px] rounded-full bg-gradient-to-br from-accent to-accent/80 text-white text-[10px] font-bold shadow-sm">
                        {eq.openRequestsCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cost Summary */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
            <div className="p-1.5 rounded-lg bg-status-success/10">
              <DollarSign className="h-4 w-4 text-status-success" />
            </div>
            Total Cost of Ownership (TCO)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="p-5 rounded-2xl bg-secondary/40 text-center transition-all hover:bg-secondary/60">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Labor Cost</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight">$8,250</p>
            </div>
            <div className="p-5 rounded-2xl bg-secondary/40 text-center transition-all hover:bg-secondary/60">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Spare Parts</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight">$7,500</p>
            </div>
            <div className="p-5 rounded-2xl bg-secondary/40 text-center transition-all hover:bg-secondary/60">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">External Services</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight">$2,100</p>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-center border border-primary/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-xs text-primary font-semibold uppercase tracking-wide relative z-10">Total TCO</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2 text-primary tracking-tight relative z-10">${stats.totalCost.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
