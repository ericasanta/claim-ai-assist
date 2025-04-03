
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FileUploadForm from "@/components/claim-upload/FileUploadForm";
import InvalidClaimMessage from "@/components/claim-upload/InvalidClaimMessage";
import LoadingState from "@/components/claim-upload/LoadingState";

const ClaimUpload = () => {
  const { claimId, token } = useParams();
  const [isValidClaim, setIsValidClaim] = useState(false);
  const [claimInfo, setClaimInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if the claim exists in localStorage
  useEffect(() => {
    const validateClaim = () => {
      setIsLoading(true);
      try {
        // Initialize claims if they don't exist
        if (!localStorage.getItem('claims')) {
          const initialClaims = [
            {
              id: "CLM-2296",
              customer: "Jane Smith",
              policyNumber: "POL-1234-5678",
              incidentDate: "2025-03-28",
              type: "Vehicle Damage",
              description: "Car damaged in parking lot",
              status: "In Progress",
              createdDate: "2025-04-01",
              claimAmount: "$3,500",
              uploadToken: "secure123"
            }
          ];
          localStorage.setItem('claims', JSON.stringify(initialClaims));
        }
        
        const claims = JSON.parse(localStorage.getItem('claims') || '[]');
        console.log("Available claims:", claims);
        console.log("Looking for claim with ID:", claimId, "and token:", token);
        
        const foundClaim = claims.find((claim: any) => {
          return claim.id === claimId && claim.uploadToken === token;
        });
        
        console.log("Found claim:", foundClaim);
        
        if (foundClaim) {
          setIsValidClaim(true);
          setClaimInfo(foundClaim);
        } else {
          setIsValidClaim(false);
        }
      } catch (error) {
        console.error("Error validating claim:", error);
        setIsValidClaim(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateClaim();
  }, [claimId, token]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isValidClaim) {
    return <InvalidClaimMessage />;
  }

  return (
    <div className="container mx-auto py-8">
      <FileUploadForm claimId={claimId || ""} claimInfo={claimInfo} />
    </div>
  );
};

export default ClaimUpload;
