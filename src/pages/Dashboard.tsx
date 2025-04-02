
import { 
  BarChart3, 
  Car, 
  Clock, 
  CircleDollarSign, 
  FileText, 
  Plus, 
  Search, 
  Filter
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

// Status badges with appropriate colors
const statusStyles = {
  pending: { label: "Pending", className: "bg-yellow-400 hover:bg-yellow-500" },
  "under-review": { label: "Under Review", className: "bg-blue-500 hover:bg-blue-600" },
  completed: { label: "Completed", className: "bg-green-500 hover:bg-green-600" },
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, John. Here's an overview of all claims.
          </p>
        </div>
        <Link to="/claims/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Claim
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              +4.6% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">
              -2.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Claims processed
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <p className="text-xs text-muted-foreground">
              +17% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Estimate Value
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$642,800</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0">
          <CardTitle>Claims Overview</CardTitle>
          <div className="ml-auto flex gap-2">
            <Select defaultValue="30days">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="3months">Last 3 months</SelectItem>
                  <SelectItem value="12months">Last 12 months</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button size="icon" variant="outline">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full flex items-center justify-center bg-muted/30 rounded-md border">
            <span className="text-muted-foreground">Chart placeholder - Claims over time</span>
          </div>
        </CardContent>
      </Card>

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
                  <TableCell className="font-medium">{claim.id}</TableCell>
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

export default Dashboard;
