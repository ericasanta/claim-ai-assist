
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import ClaimsList from "@/pages/ClaimsList";
import NewClaim from "@/pages/NewClaim";
import ClaimDetails from "@/pages/ClaimDetails";
import ClaimUpload from "@/pages/ClaimUpload";
import UploadSuccess from "@/pages/UploadSuccess";
import Analysis from "@/pages/Analysis";
import Estimates from "@/pages/Estimates";
import Assistant from "@/pages/Assistant";
import NotFound from "@/pages/NotFound";
import AppLayout from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/claims" element={<ClaimsList />} />
          <Route path="/claims/new" element={<NewClaim />} />
          <Route path="/claims/:claimId" element={<ClaimDetails />} />
          <Route path="/claims/:claimId/upload/:token" element={<ClaimUpload />} />
          <Route path="/upload-success" element={<UploadSuccess />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/analysis/:claimId" element={<Analysis />} />
          <Route path="/estimates" element={<Estimates />} />
          <Route path="/estimates/:claimId" element={<Estimates />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
