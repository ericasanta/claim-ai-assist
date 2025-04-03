
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import TasksSection from "@/components/dashboard/TasksSection";
import MessagesSection from "@/components/dashboard/MessagesSection";
import RecentClaimsSection from "@/components/dashboard/RecentClaimsSection";
import { agentTasks, agentMessages } from "@/data/dashboardData";
import { useClaimsData } from "@/hooks/useClaimsData";
import { useDashboardActions } from "@/hooks/useDashboardActions";

const Dashboard = () => {
  const [tasks, setTasks] = useState(agentTasks);
  const { claims } = useClaimsData();
  const { copyUploadLink, handleTaskAction } = useDashboardActions();
  
  useEffect(() => {
    // Get tasks from localStorage if they exist
    const storedTasks = JSON.parse(localStorage.getItem('dashboardTasks') || '[]');
    if (storedTasks.length > 0) {
      setTasks(storedTasks);
    } else {
      // Initialize from default tasks if none in localStorage
      localStorage.setItem('dashboardTasks', JSON.stringify(agentTasks));
    }
  }, []);

  // Update tasks state when a task is completed
  const handleTaskActionWithUpdate = (taskId: string, action: string) => {
    handleTaskAction(taskId, action);
    // Update local state after task completion
    if (action === 'complete') {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
  };

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
      <RecentClaimsSection 
        claims={claims} 
        copyUploadLink={copyUploadLink} 
      />
    </div>
  );
};

export default Dashboard;
