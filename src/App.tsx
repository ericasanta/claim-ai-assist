
import { Routes, Route } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import Dashboard from '@/pages/Dashboard'
import ClaimsList from '@/pages/ClaimsList'
import NewClaim from '@/pages/NewClaim'
import ClaimDetails from '@/pages/ClaimDetails'
import ClaimUpload from '@/pages/ClaimUpload'
import NotFound from '@/pages/NotFound'
import Assistant from '@/pages/Assistant'
import Estimates from '@/pages/Estimates'
import Analysis from "./pages/Analysis";
import Index from "./pages/Index";

function App() {
  console.log("App component rendered");
  return (
    <main className="app">
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Index />} />
          <Route path="claims" element={<ClaimsList />} />
          <Route path="claims/new" element={<NewClaim />} />
          <Route path="claims/:claimId" element={<ClaimDetails />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="estimates" element={<Estimates />} />
          <Route path="analysis" element={<Analysis />} />
        </Route>
        <Route path="claims/:claimId/upload/:token" element={<ClaimUpload />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
