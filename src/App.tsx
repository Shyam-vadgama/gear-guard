import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import EquipmentPage from "@/pages/EquipmentPage";
import MaintenancePage from "@/pages/MaintenancePage";
import TeamsPage from "@/pages/TeamsPage";
import SchedulePage from "@/pages/SchedulePage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ScannerPage from "@/pages/ScannerPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useApp();
  // Simple check. Ideally check loading state too.
  // For now, if no user and no token in local storage (handled in AppContext), redirect.
  // Since AppContext initializes user asynchronously, this might redirect prematurely.
  // Better to have 'isLoading' state in AppContext. 
  // For this prototype, we'll assume if no user, we check token. 
  
  // Actually, AppContext should have an `isLoading` state.
  // Let's rely on user for now, but `useApp` doesn't expose loading.
  // We can check localStorage token.
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="gearguard-theme">
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/equipment" element={<EquipmentPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/scanner" element={<ScannerPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
