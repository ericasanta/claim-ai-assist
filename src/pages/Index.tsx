
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add a small delay to ensure routing is initialized
    const redirectTimer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 100);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Redirecting...</h1>
        <p className="text-gray-600">Please wait while we redirect you to the dashboard.</p>
      </div>
    </div>
  );
};

export default Index;
