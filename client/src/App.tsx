import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import EnhancedHome from "@/pages/enhanced-home";
import PropertyPage from "@/pages/property-page";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin-login";
import AdminRegister from "@/pages/admin-register";
import AdminDashboard from "@/pages/admin-dashboard";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

function Router() {
  return (
    <Switch>
      <Route path="/" component={EnhancedHome} />
      <Route path="/home" component={Home} />
      <Route path="/property/:id" component={PropertyPage} />
      <Route path="/admin" component={() => { window.location.href = "/admin/dashboard"; return null; }} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/register" component={AdminRegister} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <FloatingWhatsApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
