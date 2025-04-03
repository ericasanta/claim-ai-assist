
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ClaimSummaryProps {
  claim: {
    customer: string;
    policyNumber: string;
    incidentDate: string;
    type: string;
    description: string;
  } | null;
}

const ClaimSummary = ({ claim }: ClaimSummaryProps) => {
  if (!claim) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Summary</CardTitle>
        <CardDescription>
          Details for claim {claim.id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Customer:</strong> {claim.customer}</p>
          <p><strong>Policy Number:</strong> {claim.policyNumber}</p>
          <p><strong>Date of Incident:</strong> {claim.incidentDate}</p>
          <p><strong>Type:</strong> {claim.type}</p>
          <p><strong>Description:</strong> {claim.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClaimSummary;
