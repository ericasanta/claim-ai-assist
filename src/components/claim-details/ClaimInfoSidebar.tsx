
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ClaimInfoSidebarProps {
  claim: {
    status: string;
    createdDate: string;
    claimAmount: string;
  } | null;
}

const ClaimInfoSidebar = ({ claim }: ClaimInfoSidebarProps) => {
  if (!claim) return null;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Claim Information</CardTitle>
          <CardDescription>
            Details about the claim
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm">
            <strong>Status:</strong> {claim.status}
          </div>
          <div className="text-sm">
            <strong>Created Date:</strong> {claim.createdDate}
          </div>
          <div className="text-sm">
            <strong>Claim Amount:</strong> {claim.claimAmount}
          </div>
        </CardContent>
      </Card>
      
      {/* Adjuster Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Adjuster Information</CardTitle>
          <CardDescription>
            Assigned adjuster for this claim
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm">
            <strong>Name:</strong> John Doe
          </div>
          <div className="text-sm">
            <strong>Email:</strong> john.doe@example.com
          </div>
          <div className="text-sm">
            <strong>Phone:</strong> 555-123-4567
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimInfoSidebar;
