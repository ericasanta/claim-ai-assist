
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useDashboardActions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const copyUploadLink = useCallback((uploadLink: string, claimId: string) => {
    const fullLink = `${window.location.origin}${uploadLink}`;
    navigator.clipboard.writeText(fullLink);
    toast({
      title: "Link copied to clipboard",
      description: `Upload link for claim ${claimId} has been copied.`,
    });
  }, [toast]);

  const handleTaskAction = useCallback((taskId: string, action: string) => {
    // Find the task
    const dashboardTasks = JSON.parse(localStorage.getItem('dashboardTasks') || '[]');
    const taskIndex = dashboardTasks.findIndex((task: any) => task.id === taskId);
    
    if (taskIndex === -1) return;
    
    const task = dashboardTasks[taskIndex];
    
    if (action === 'view') {
      // Navigate to appropriate page based on task type
      if (task.type === 'documentReview') {
        navigate(`/claims/${task.claimId}`);
      } else if (task.type === 'aiAnalysis') {
        navigate('/analysis');
      } else {
        navigate(`/claims/${task.claimId}`);
      }
    } else if (action === 'complete') {
      // Remove the task
      dashboardTasks.splice(taskIndex, 1);
      localStorage.setItem('dashboardTasks', JSON.stringify(dashboardTasks));
      
      toast({
        title: "Task completed",
        description: `Task "${task.description}" has been marked as complete.`,
      });
    }
  }, [navigate, toast]);

  return {
    copyUploadLink,
    handleTaskAction
  };
};
