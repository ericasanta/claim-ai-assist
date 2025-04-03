
import { 
  Clock, 
  Calendar, 
  CheckCircle2 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Priority styles for tasks
const priorityStyles = {
  high: { label: "High", className: "bg-red-500 hover:bg-red-600" },
  medium: { label: "Medium", className: "bg-yellow-500 hover:bg-yellow-600" },
  low: { label: "Low", className: "bg-green-500 hover:bg-green-600" },
};

interface Task {
  id: string;
  description: string;
  dueIn: string;
  claimId: string;
  priority: string;
  type: string;
}

interface TasksSectionProps {
  tasks: Task[];
  handleTaskAction: (taskId: string, action: string) => void;
}

const TasksSection = ({ tasks, handleTaskAction }: TasksSectionProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <div className="flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
            Tasks
          </div>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" /> 
            Due Today
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" /> 
            All Tasks
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Claim ID</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.description}</TableCell>
                <TableCell>
                  <Link to={`/claims/${task.claimId}`} className="text-blue-600 hover:underline">
                    {task.claimId}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    {task.dueIn}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={priorityStyles[task.priority as keyof typeof priorityStyles].className}>
                    {priorityStyles[task.priority as keyof typeof priorityStyles].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleTaskAction(task.id, 'view')}
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleTaskAction(task.id, 'complete')}
                    >
                      Complete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TasksSection;
