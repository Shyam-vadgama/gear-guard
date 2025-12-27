import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-0.5 sm:mt-1 text-sm sm:text-base">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex sm:flex-wrap gap-1 h-auto p-1">
          <TabsTrigger value="profile" className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2">
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2">
            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2">
            <Palette className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2">
            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="glass-card">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm">First Name</Label>
                  <Input defaultValue="John" className="h-9 sm:h-10 text-sm" />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm">Last Name</Label>
                  <Input defaultValue="Doe" className="h-9 sm:h-10 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm">Email</Label>
                <Input type="email" defaultValue="john.doe@gearguard.com" className="h-9 sm:h-10 text-sm" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm">Role</Label>
                <Input defaultValue="Maintenance Manager" disabled className="h-9 sm:h-10 text-sm" />
              </div>
              <Button className="w-full sm:w-auto">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass-card">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">Critical Alerts</p>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    Receive notifications for critical maintenance requests
                  </p>
                </div>
                <Switch defaultChecked className="flex-shrink-0" />
              </div>
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">Overdue Reminders</p>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    Get reminders for overdue maintenance tasks
                  </p>
                </div>
                <Switch defaultChecked className="flex-shrink-0" />
              </div>
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">Schedule Updates</p>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    Notifications for preventive maintenance schedules
                  </p>
                </div>
                <Switch defaultChecked className="flex-shrink-0" />
              </div>
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">Email Notifications</p>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    Receive email summaries of daily activity
                  </p>
                </div>
                <Switch className="flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="glass-card">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm sm:text-base">Theme</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  The application currently uses a light theme optimized for industrial environments.
                </p>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm sm:text-base">Sidebar</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  The sidebar can be collapsed using the arrow button for more workspace.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="glass-card">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm">Current Password</Label>
                <Input type="password" className="h-9 sm:h-10 text-sm" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm">New Password</Label>
                <Input type="password" className="h-9 sm:h-10 text-sm" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm">Confirm New Password</Label>
                <Input type="password" className="h-9 sm:h-10 text-sm" />
              </div>
              <Button className="w-full sm:w-auto">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
