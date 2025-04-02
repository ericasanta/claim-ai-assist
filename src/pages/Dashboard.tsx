
import { 
  Bell,
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Filter,
  Plus, 
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Link } from "react-router-dom";

// Sample data for tasks
const agentTasks = [
  {
    id: "TSK-1001",
    description: "Review damage assessment for claim CLM-4231",
    dueIn: "Today",
    claimId: "CLM-4231",
    priority: "high"
  },
  {
    id: "TSK-1002",
    description: "Call Emily Johnson regarding photo submission for claim",
    dueIn: "Tomorrow",
    claimId: "CLM-4231",
    priority: "medium"
  },
  {
    id: "TSK-1003",
    description: "Confirm repair shop estimate for Michael Chen's claim",
    dueIn: "2 days",
    claimId: "CLM-4230",
    priority: "medium"
  },
  {
    id: "TSK-1004",
    description: "Submit final approval for Sarah Williams's payout",
    dueIn: "Today",
    claimId: "CLM-4229",
    priority: "high"
  },
  {
    id: "TSK-1005",
    description: "Schedule follow-up inspection for David Rodriguez's vehicle",
    dueIn: "3 days",
    claimId: "CLM-4228",
    priority: "low"
  }
];

// Sample data for messages
const agentMessages = [
  {
    id: "MSG-2001",
    subject: "Questions about my claim estimate",
    date: "2023-10-15",
    senderType: "Customer",
    sender: "Emily Johnson",
    needsReply: true,
    sentiment: "neutral",
    claimId: "CLM-4231"
  },
  {
    id: "MSG-2002",
    subject: "Approval needed for payout above threshold",
    date: "2023-10-14",
    senderType: "Senior Adjuster",
    sender: "James Wilson",
    needsReply: true,
    sentiment: "urgent",
    claimId: "CLM-4228"
  },
  {
    id: "MSG-2003",
    subject: "Additional photos submitted",
    date: "2023-10-14",
    senderType: "Customer",
    sender: "Michael Chen",
    needsReply: false,
    sentiment: "positive",
    claimId: "CLM-4230"
  },
  {
    id: "MSG-2004",
    subject: "Repair shop pricing dispute",
    date: "2023-10-13",
    senderType: "Repair Shop",
    sender: "Downtown Auto Repair",
    needsReply: true,
    sentiment: "negative",
    claimId: "CLM-4227"
  },
  {
    id: "MSG-2005",
    subject: "Thank you for resolving my claim",
    date: "2023-10-12",
    senderType: "Customer",
    sender: "Sarah Williams",
    needsReply: false,
    sentiment: "positive",
    claimId: "CLM-4229"
  }
];

// Priority styles for tasks
const priorityStyles = {
  high: { label: "High", className: "bg-red-500 hover:bg-red-600" },
  medium: { label: "Medium", className: "bg-yellow-500 hover:bg-yellow-600" },
  low: { label: "Low", className: "bg-green-500 hover:bg-green-600" },
};

// Sentiment styles for messages
const sentimentStyles = {
  positive: { className: "bg-green-500 hover:bg-green-600" },
  neutral: { className: "bg-blue-500 hover:bg-blue-600" },
  negative: { className: "bg-red-500 hover:bg-red-600" },
  urgent: { className: "bg-purple-500 hover:bg-purple-600" },
};

// Status badges with appropriate colors
const statusStyles = {
  pending: { label: "Pending", className: "bg-yellow-400 hover:bg-yellow-500" },
  "under-review": { label: "Under Review", className: "bg-blue-500 hover:bg-blue-600" },
  completed: { label: "Completed", className: "bg-green-500 hover:bg-green-600" },
};

// Sample data for demonstration
const recentClaims = [
  {
    id: "CLM-4231",
    customer: "Emily Johnson",
    policyNumber: "POL-78542",
    status: "pending",
    date: "2023-10-15",
    type: "Collision",
    amount: "$4,250.00",
  },
  {
    id: "CLM-4230",
    customer: "Michael Chen",
    policyNumber: "POL-96325",
    status: "under-review",
    date: "2023-10-14",
    type: "Comprehensive",
    amount: "$1,850.75",
  },
  {
    id: "CLM-4229",
    customer: "Sarah Williams",
    policyNumber: "POL-12589",
    status: "completed",
    date: "2023-10-12",
    type: "Liability",
    amount: "$3,500.00",
  },
  {
    id: "CLM-4228",
    customer: "David Rodriguez",
    policyNumber: "POL-36985",
    status: "under-review",
    date: "2023-10-10",
    type: "Collision",
    amount: "$7,250.50",
  },
  {
    id: "CLM-4227",
    customer: "Linda Smith",
    policyNumber: "POL-45632",
    status: "pending",
    date: "2023-10-09",
    type: "Comprehensive",
    amount: "$2,800.25",
  },
];

const Home = () => {
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
              {agentTasks.map((task) => (
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
                    <Button variant="ghost" size="sm">
                      Complete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Messages Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <div className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary" />
              Messages
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages..."
                className="w-[200px] pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Claim ID</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">{message.subject}</TableCell>
                  <TableCell>
                    <Link to={`/claims/${message.claimId}`} className="text-blue-600 hover:underline">
                      {message.claimId}
                    </Link>
                  </TableCell>
                  <TableCell>{message.sender}</TableCell>
                  <TableCell>{message.senderType}</TableCell>
                  <TableCell>{message.date}</TableCell>
                  <TableCell>
                    <Badge 
                      className={sentimentStyles[message.sentiment as keyof typeof sentimentStyles].className}
                    >
                      {message.needsReply ? "Needs Reply" : "No Reply Needed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Claims Section - Kept from original */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Claims</CardTitle>
          <div className="flex flex-col gap-4 pt-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search claims..."
                className="w-full pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Policy Number</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden lg:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">
                    <Link to={`/claims/${claim.id}`} className="text-blue-600 hover:underline">
                      {claim.id}
                    </Link>
                  </TableCell>
                  <TableCell>{claim.customer}</TableCell>
                  <TableCell className="hidden sm:table-cell">{claim.policyNumber}</TableCell>
                  <TableCell className="hidden md:table-cell">{claim.date}</TableCell>
                  <TableCell className="hidden lg:table-cell">{claim.type}</TableCell>
                  <TableCell className="hidden md:table-cell">{claim.amount}</TableCell>
                  <TableCell>
                    <Badge className={statusStyles[claim.status as keyof typeof statusStyles].className}>
                      {statusStyles[claim.status as keyof typeof statusStyles].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/claims/${claim.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
