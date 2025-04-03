
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import TasksSection from "@/components/dashboard/TasksSection";
import MessagesSection from "@/components/dashboard/MessagesSection";
import RecentClaimsSection from "@/components/dashboard/RecentClaimsSection";
import { agentTasks, agentMessages, mockClaims } from "@/data/dashboardData";
import { useClaimsData } from "@/hooks/useClaimsData";
import { useDashboardActions } from "@/hooks/useDashboardActions";

const Dashboard = () => {
  const [tasks, setTasks] = useState(agentTasks);
  const [isLoading, setIsLoading] = useState(true);
  const { claims, loading: claimsLoading, error: claimsError } = useClaimsData();
  const { copyUploadLink, handleTaskAction } = useDashboardActions();
  
  useEffect(() => {
    console.log("Dashboard component mounted");
    
    // Initialize localStorage if needed
    if (!localStorage.getItem('claims')) {
      console.log("Initializing claims in localStorage");
      localStorage.setItem('claims', JSON.stringify(mockClaims));
    } else {
      console.log("Claims already exist in localStorage");
    }
    
    // Get tasks from localStorage if they exist
    const storedTasks = localStorage.getItem('dashboardTasks');
    if (storedTasks && JSON.parse(storedTasks).length > 0) {
      console.log("Using tasks from localStorage");
      setTasks(JSON.parse(storedTasks));
    } else {
      console.log("Initializing tasks in localStorage");
      // Initialize from default tasks if none in localStorage
      localStorage.setItem('dashboardTasks', JSON.stringify(agentTasks));
    }
    
    setIsLoading(false);
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

  if (isLoading || claimsLoading) {
    console.log("Dashboard loading state", { isLoading, claimsLoading });
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (claimsError) {
    console.error("Dashboard encountered an error:", claimsError);
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-destructive font-medium mb-2">Error loading dashboard data</p>
          <p className="text-muted-foreground">{claimsError.message}</p>
        </div>
      </div>
    );
  }

  console.log("Dashboard rendered with claims:", claims?.length || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Home</h2>
          <p className="text-muted-foreground">
            Welcome back, John. Here's what needs your attention today.
          </p>
        </div>
        <Link to="/claims/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Claim
          </Button>
        </Link>
      </div>

      {/* Tasks Section */}
      <TasksSection 
        tasks={tasks} 
        handleTaskAction={handleTaskActionWithUpdate} 
      />

      {/* Messages Section */}
      <MessagesSection 
        messages={agentMessages} 
      />

      {/* Recent Claims Section */}
      {claims && claims.length > 0 ? (
        <RecentClaimsSection 
          claims={claims} 
          copyUploadLink={copyUploadLink} 
        />
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-medium">No claims available</h3>
          <p className="text-muted-foreground">There are no recent claims to display.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
