
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ClaimsList from "./pages/ClaimsList";
import NewClaim from "./pages/NewClaim";
import Analysis from "./pages/Analysis";
import Estimates from "./pages/Estimates";
import Assistant from "./pages/Assistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/claims" element={<AppLayout><ClaimsList /></AppLayout>} />
          <Route path="/claims/new" element={<AppLayout><NewClaim /></AppLayout>} />
          <Route path="/analysis" element={<AppLayout><Analysis /></AppLayout>} />
          <Route path="/estimates" element={<AppLayout><Estimates /></AppLayout>} />
          <Route path="/assistant" element={<AppLayout><Assistant /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
