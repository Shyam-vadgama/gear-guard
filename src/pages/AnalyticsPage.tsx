import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { BarChart3, PieChartIcon, TrendingUp, Package } from "lucide-react";

const requestsByTeam = [
  { team: 'Mechanical', corrective: 18, preventive: 12 },
  { team: 'Electrical', corrective: 8, preventive: 6 },
  { team: 'Facilities', corrective: 5, preventive: 15 },
];

const requestsByCategory = [
  { name: 'Manufacturing', value: 35, color: 'hsl(215, 70%, 50%)' },
  { name: 'Utilities', value: 25, color: 'hsl(35, 95%, 50%)' },
  { name: 'Material Handling', value: 15, color: 'hsl(145, 60%, 40%)' },
  { name: 'Automation', value: 15, color: 'hsl(280, 70%, 50%)' },
  { name: 'Electrical', value: 10, color: 'hsl(0, 75%, 55%)' },
];

const sparePartsUsage = [
  { name: 'Bearings', quantity: 45, cost: 2025 },
  { name: 'V-Belts', quantity: 32, cost: 896 },
  { name: 'Hydraulic Seals', quantity: 18, cost: 2700 },
  { name: 'Air Filters', quantity: 28, cost: 980 },
  { name: 'Lubricants', quantity: 65, cost: 1170 },
];

const monthlyTrends = [
  { month: 'Jul', requests: 28, resolved: 25, cost: 4200 },
  { month: 'Aug', requests: 32, resolved: 30, cost: 5100 },
  { month: 'Sep', requests: 25, resolved: 24, cost: 3800 },
  { month: 'Oct', requests: 35, resolved: 32, cost: 5800 },
  { month: 'Nov', requests: 30, resolved: 28, cost: 4500 },
  { month: 'Dec', requests: 28, resolved: 26, cost: 4100 },
];

export default function AnalyticsPage() {
  const { requests, equipment } = useApp();
  const [dateRange, setDateRange] = useState("6m");

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-0.5 sm:mt-1 text-sm sm:text-base">
            Analyze maintenance performance and trends
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full sm:w-[180px] h-9 sm:h-10 text-sm">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last Month</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="w-max sm:w-auto inline-flex">
            <TabsTrigger value="overview" className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2.5 sm:px-3">
              <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2.5 sm:px-3">
              <PieChartIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">By Team</span>
            </TabsTrigger>
            <TabsTrigger value="parts" className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2.5 sm:px-3">
              <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Parts</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2.5 sm:px-3">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Trends</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Requests by Category */}
            <Card className="glass-card">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-sm sm:text-base">Requests by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={requestsByCategory}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {requestsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend below chart for mobile */}
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {requestsByCategory.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requests by Team */}
            <Card className="glass-card">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-sm sm:text-base">Requests by Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={requestsByTeam} layout="vertical" margin={{ left: 0, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" className="text-[10px] sm:text-xs fill-muted-foreground" />
                      <YAxis dataKey="team" type="category" className="text-[10px] sm:text-xs fill-muted-foreground" width={70} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="corrective" name="Corrective" fill="hsl(0, 75%, 55%)" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="preventive" name="Preventive" fill="hsl(200, 85%, 50%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Monthly Request Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="requests" 
                      name="Total Requests"
                      stroke="hsl(215, 70%, 50%)" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(215, 70%, 50%)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="resolved" 
                      name="Resolved"
                      stroke="hsl(145, 70%, 42%)" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(145, 70%, 42%)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Team Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={requestsByTeam}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="team" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="corrective" name="Corrective" fill="hsl(0, 75%, 55%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="preventive" name="Preventive" fill="hsl(200, 85%, 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spare Parts Tab */}
        <TabsContent value="parts" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Spare Parts Usage & Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sparePartsUsage}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                    <YAxis yAxisId="left" className="text-xs fill-muted-foreground" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="quantity" name="Quantity Used" fill="hsl(215, 70%, 50%)" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="cost" name="Total Cost ($)" fill="hsl(35, 95%, 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Cost Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [`$${value}`, 'Cost']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      name="Maintenance Cost"
                      stroke="hsl(35, 95%, 50%)" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(35, 95%, 50%)', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
