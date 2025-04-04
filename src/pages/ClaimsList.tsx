import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Filter, Plus, Search } from "lucide-react";

// Status badges with appropriate colors
const statusStyles = {
  pending: { label: "Pending", className: "bg-yellow-400 hover:bg-yellow-500" },
  "under-review": { label: "Under Review", className: "bg-blue-500 hover:bg-blue-600" },
  completed: { label: "Completed", className: "bg-green-500 hover:bg-green-600" },
};

// Sample data for demonstration
const sampleClaims = [
  {
    id: "CLM-4231",
    customer: "Emily Johnson",
    policyNumber: "POL-78542",
    status: "pending",
    date: "2023-10-15",
    type: "Collision",
    amount: "$4,250.00",
    createdDate: "2023-10-15",
    description: "Vehicle collision on Main Street",
    incidentDate: "2023-10-10",
    claimAmount: "$4,250.00",
    uploadLink: "/claims/CLM-4231/upload/abc123",
    hasUploads: false,
    uploadCount: 0,
    hasAiAnalysis: false
  },
  {
    id: "CLM-4230",
    customer: "Michael Chen",
    policyNumber: "POL-96325",
    status: "under-review",
    date: "2023-10-14",
    type: "Comprehensive",
    amount: "$1,850.75",
    createdDate: "2023-10-14",
    description: "Hail damage to vehicle roof and hood",
    incidentDate: "2023-10-05",
    claimAmount: "$1,850.75",
    uploadLink: "/claims/CLM-4230/upload/def456",
    hasUploads: false,
    uploadCount: 0,
    hasAiAnalysis: false
  },
  {
    id: "CLM-4229",
    customer: "Sarah Williams",
    policyNumber: "POL-12589",
    status: "completed",
    date: "2023-10-12",
    type: "Liability",
    amount: "$3,500.00",
    createdDate: "2023-10-12",
    description: "Liability claim for property damage",
    incidentDate: "2023-10-08",
    claimAmount: "$3,500.00",
    uploadLink: "/claims/CLM-4229/upload/ghi789",
    hasUploads: true,
    uploadCount: 1,
    hasAiAnalysis: true
  },
  {
    id: "CLM-4228",
    customer: "David Rodriguez",
    policyNumber: "POL-36985",
    status: "under-review",
    date: "2023-10-10",
    type: "Collision",
    amount: "$7,250.50",
    createdDate: "2023-10-10",
    description: "Collision with another vehicle",
    incidentDate: "2023-10-06",
    claimAmount: "$7,250.50",
    uploadLink: "/claims/CLM-4228/upload/jkl012",
    hasUploads: false,
    uploadCount: 0,
    hasAiAnalysis: false
  },
  {
    id: "CLM-4227",
    customer: "Linda Smith",
    policyNumber: "POL-45632",
    status: "pending",
    date: "2023-10-09",
    type: "Comprehensive",
    amount: "$2,800.25",
    createdDate: "2023-10-09",
    description: "Comprehensive claim for vehicle damage",
    incidentDate: "2023-10-04",
    claimAmount: "$2,800.25",
    uploadLink: "/claims/CLM-4227/upload/mno345",
    hasUploads: true,
    uploadCount: 2,
    hasAiAnalysis: true
  },
  {
    id: "CLM-4226",
    customer: "Robert Brown",
    policyNumber: "POL-78965",
    status: "completed",
    date: "2023-10-07",
    type: "Collision",
    amount: "$5,150.00",
    createdDate: "2023-10-07",
    description: "Collision with pedestrian",
    incidentDate: "2023-10-03",
    claimAmount: "$5,150.00",
    uploadLink: "/claims/CLM-4226/upload/pqr678",
    hasUploads: false,
    uploadCount: 0,
    hasAiAnalysis: false
  },
  {
    id: "CLM-4225",
    customer: "Jennifer Davis",
    policyNumber: "POL-36521",
    status: "pending",
    date: "2023-10-05",
    type: "Liability",
    amount: "$1,950.25",
    createdDate: "2023-10-05",
    description: "Liability claim for personal injury",
    incidentDate: "2023-10-01",
    claimAmount: "$1,950.25",
    uploadLink: "/claims/CLM-4225/upload/stu901",
    hasUploads: false,
    uploadCount: 0,
    hasAiAnalysis: false
  },
  {
    id: "CLM-4224",
    customer: "Thomas Miller",
    policyNumber: "POL-95123",
    status: "under-review",
    date: "2023-10-03",
    type: "Comprehensive",
    amount: "$3,250.75",
    createdDate: "2023-10-03",
    description: "Comprehensive claim for vehicle damage",
    incidentDate: "2023-09-30",
    claimAmount: "$3,250.75",
    uploadLink: "/claims/CLM-4224/upload/vwx234",
    hasUploads: true,
    uploadCount: 1,
    hasAiAnalysis: true
  },
  {
    id: "CLM-4223",
    customer: "Jessica Wilson",
    policyNumber: "POL-78542",
    status: "completed",
    date: "2023-10-01",
    type: "Collision",
    amount: "$6,500.50",
    createdDate: "2023-10-01",
    description: "Collision with another vehicle",
    incidentDate: "2023-09-28",
    claimAmount: "$6,500.50",
    uploadLink: "/claims/CLM-4223/upload/yza567",
    hasUploads: false,
    uploadCount: 0,
    hasAiAnalysis: false
  },
  {
    id: "CLM-4222",
    customer: "Daniel Moore",
    policyNumber: "POL-45698",
    status: "pending",
    date: "2023-09-29",
    type: "Comprehensive",
    amount: "$2,100.25",
    createdDate: "2023-09-29",
    description: "Comprehensive claim for vehicle damage",
    incidentDate: "2023-09-25",
    claimAmount: "$2,100.25",
    uploadLink: "/claims/CLM-4222/upload/bcd789",
    hasUploads: true,
    uploadCount: 2,
    hasAiAnalysis: true
  },
];

const ClaimsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [allClaims, setAllClaims] = useState(sampleClaims);

  // Initialize localStorage with sample claims if not already present
  useEffect(() => {
    const storedClaims = localStorage.getItem('claims');
    if (!storedClaims) {
      localStorage.setItem('claims', JSON.stringify(sampleClaims));
      setAllClaims(sampleClaims);
    } else {
      setAllClaims(JSON.parse(storedClaims));
    }
  }, []);

  // Filter claims based on search, status, and tab
  const filteredClaims = allClaims.filter((claim) => {
    const matchesSearch =
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
    
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && claim.status === "pending") ||
      (activeTab === "under-review" && claim.status === "under-review") ||
      (activeTab === "completed" && claim.status === "completed");

    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Claims</h2>
          <p className="text-muted-foreground">
            View and manage all insurance claims
          </p>
        </div>
        <Link to="/claims/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Claim
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Claims Management</CardTitle>
          <CardDescription>
            All claims in the system can be viewed and filtered here.
          </CardDescription>
          <Tabs 
            defaultValue="all" 
            className="mt-4"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Claims</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="under-review">Under Review</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search claims by ID, customer or policy number..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Select 
                defaultValue="all"
                onValueChange={(value) => setStatusFilter(value)}
              >
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

          <div className="mt-6 rounded-md border">
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
                {filteredClaims.length > 0 ? (
                  filteredClaims.map((claim) => (
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No claims found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimsList;
