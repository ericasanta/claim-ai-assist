
import { 
  Search, 
  Filter,
  ExternalLink
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
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Status badges with appropriate colors
const statusStyles = {
  pending: { label: "Pending", className: "bg-yellow-400 hover:bg-yellow-500" },
  "under-review": { label: "Under Review", className: "bg-blue-500 hover:bg-blue-600" },
  completed: { label: "Completed", className: "bg-green-500 hover:bg-green-600" },
  "in progress": { label: "In Progress", className: "bg-blue-500 hover:bg-blue-600" },
};

interface Claim {
  id: string;
  customer: string;
  policyNumber: string;
  status: string;
  date: string;
  type: string;
  amount: string;
  uploadLink?: string;
}

interface RecentClaimsSectionProps {
  claims: Claim[];
  copyUploadLink: (uploadLink: string, claimId: string) => void;
}

const RecentClaimsSection = ({ claims, copyUploadLink }: RecentClaimsSectionProps) => {
  return (
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
              <TableHead>Upload Link</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.map((claim) => (
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
                  <Badge className={statusStyles[claim.status.toLowerCase() as keyof typeof statusStyles]?.className || "bg-gray-500"}>
                    {statusStyles[claim.status.toLowerCase() as keyof typeof statusStyles]?.label || claim.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {claim.uploadLink ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyUploadLink(claim.uploadLink!, claim.id)}
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Copy Link
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">Not available</span>
                  )}
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
  );
};

export default RecentClaimsSection;
