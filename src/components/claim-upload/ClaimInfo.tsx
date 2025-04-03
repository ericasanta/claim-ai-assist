
import { Card, CardDescription } from "@/components/ui/card";

interface ClaimInfoProps {
  claimInfo: {
    id: string;
    policyNumber: string;
    incidentDate: string;
    [key: string]: any;
  };
}

const ClaimInfo = ({ claimInfo }: ClaimInfoProps) => {
  return (
    <div className="mt-2 text-sm">
      <p><strong>Policy:</strong> {claimInfo.policyNumber}</p>
      <p><strong>Date of Incident:</strong> {claimInfo.incidentDate}</p>
    </div>
  );
};

export default ClaimInfo;
