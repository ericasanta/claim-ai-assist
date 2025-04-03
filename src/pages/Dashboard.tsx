
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import TasksSection from "@/components/dashboard/TasksSection";
import MessagesSection from "@/components/dashboard/MessagesSection";
import RecentClaimsSection from "@/components/dashboard/RecentClaimsSection";
import { agentTasks, agentMessages, mockClaims } from "@/data/dashboardData";
import { useDashboardActions } from "@/hooks/useDashboardActions";

const Dashboard = () => {
  const [tasks, setTasks] = useState(agentTasks);
  const [claims, setClaims] = useState(mockClaims);
  const [isLoading, setIsLoading] = useState(false);
  const { copyUploadLink, handleTaskAction } = useDashboardActions();

  console.log("Dashboard rendering");
  
  useEffect(() => {
    console.log("Dashboard component mounted");
    
    // Initialize localStorage if needed
    localStorage.setItem('dashboardTasks', JSON.stringify(agentTasks));
    localStorage.setItem('claims', JSON.stringify(mockClaims));
    
    console.log("Dashboard initialization complete");
  }, []);

  // Update tasks state when a task is completed
  const handleTaskActionWithUpdate = (taskId: string, action: string) => {
    handleTaskAction(taskId, action);
    // Update local state after task completion
    if (action === 'complete') {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white text-black p-6 rounded shadow">
        <h2 className="text-3xl font-bold tracking-tight">Loading dashboard...</h2>
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full my-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black p-6 rounded shadow">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Home</h2>
          <p className="text-gray-600">
            Welcome back, John. Here's what needs your attention today.
          </p>
        </div>
        <Link to="/claims/new">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Claim
          </Button>
        </Link>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="text-xl font-bold text-black mb-3">Your Tasks</h3>
        <TasksSection 
          tasks={tasks} 
          handleTaskAction={handleTaskActionWithUpdate} 
        />
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="text-xl font-bold text-black mb-3">Messages</h3>
        <MessagesSection 
          messages={agentMessages} 
        />
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="text-xl font-bold text-black mb-3">Recent Claims</h3>
        <RecentClaimsSection 
          claims={claims} 
          copyUploadLink={copyUploadLink} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
