
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { mockClaims } from "@/data/dashboardData";

const FallbackDashboard = () => {
  const handleResetData = () => {
    localStorage.setItem('claims', JSON.stringify(mockClaims));
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Insurance Claims Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome to your insurance claims management system. Manage and track all your customer claims in one place.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Link to="/claims/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create New Claim
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={handleResetData}
            className="border-gray-300"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Claims</h2>
          <div className="space-y-4">
            {mockClaims.slice(0, 3).map(claim => (
              <div key={claim.id} className="border-b pb-4">
                <Link to={`/claims/${claim.id}`} className="text-blue-600 hover:underline font-medium">
                  {claim.id}
                </Link>
                <div className="text-sm text-gray-600 mt-1">
                  {claim.customer} - {claim.type}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {claim.date}
                </div>
              </div>
            ))}
            
            <Link to="/claims" className="block text-blue-600 hover:underline text-sm mt-4">
              View all claims →
            </Link>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="space-y-3">
            <Link to="/claims/new" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
              <div className="font-medium text-gray-900">Create New Claim</div>
              <div className="text-sm text-gray-600">Register a new insurance claim</div>
            </Link>
            <Link to="/claims" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
              <div className="font-medium text-gray-900">View All Claims</div>
              <div className="text-sm text-gray-600">Manage existing claims</div>
            </Link>
            <Link to="/analysis" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
              <div className="font-medium text-gray-900">AI Damage Analysis</div>
              <div className="text-sm text-gray-600">Analyze claim photos with AI</div>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Claims Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Customer</th>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Amount</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockClaims.slice(0, 5).map(claim => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{claim.id}</td>
                  <td className="px-4 py-3 border-b">{claim.customer}</td>
                  <td className="px-4 py-3 border-b">{claim.date}</td>
                  <td className="px-4 py-3 border-b">{claim.amount}</td>
                  <td className="px-4 py-3 border-b">
                    <span className={`px-2 py-1 rounded text-xs ${
                      claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      claim.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b">
                    <Link to={`/claims/${claim.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FallbackDashboard;
