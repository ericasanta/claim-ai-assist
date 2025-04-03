
import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import FallbackDashboard from "@/components/dashboard/FallbackDashboard";
import { mockClaims } from "@/data/dashboardData";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  
  useEffect(() => {
    console.log("Index component mounted - initializing data");
    
    // Ensure localStorage has the mock data
    localStorage.setItem('claims', JSON.stringify(mockClaims));
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("Index done loading");
    }, 1000);
    
    // After 3 seconds, if things still aren't working, use the fallback
    const fallbackTimer = setTimeout(() => {
      console.log("Using fallback dashboard");
      setUseFallback(true);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Dashboard</h1>
          <p className="text-gray-600 mb-6">Please wait while we prepare your insurance claims dashboard.</p>
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-blue-600 animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (useFallback) {
    return <FallbackDashboard />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <Dashboard />
    </div>
  );
};

export default Index;
