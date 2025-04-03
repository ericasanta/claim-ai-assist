
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";

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
  console.log("RecentClaimsSection rendering with claims:", claims?.length || 0);
  
  if (!claims || claims.length === 0) {
    return (
      <div className="bg-white p-4 rounded border text-center">
        <p className="text-gray-600">No claims available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Claim ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
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
              <TableCell>
                <Badge className={statusStyles[claim.status.toLowerCase() as keyof typeof statusStyles]?.className || "bg-gray-500"}>
                  {statusStyles[claim.status.toLowerCase() as keyof typeof statusStyles]?.label || claim.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Link to={`/claims/${claim.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentClaimsSection;
