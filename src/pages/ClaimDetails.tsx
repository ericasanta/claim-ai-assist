
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ClaimSummary from "@/components/claim-details/ClaimSummary";
import DocumentsSection from "@/components/claim-details/DocumentsSection";
import ActivityFeed from "@/components/claim-details/ActivityFeed";
import ClaimInfoSidebar from "@/components/claim-details/ClaimInfoSidebar";
import ClaimNotFound from "@/components/claim-details/NotFound";
import LoadingState from "@/components/claim-details/LoadingState";

const ClaimDetails = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [claim, setClaim] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchClaim = () => {
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
              uploadLink: "/claims/CLM-2296/upload/secure123",
              hasUploads: false,
              uploadCount: 0
            }
          ];
          localStorage.setItem('claims', JSON.stringify(initialClaims));
        }
        
        const storedClaims = JSON.parse(localStorage.getItem('claims') || '[]');
        const foundClaim = storedClaims.find((c: any) => c.id === claimId);
        
        if (foundClaim) {
          setClaim(foundClaim);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching claim:", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaim();
  }, [claimId]);

  const handleCopyUploadLink = () => {
    if (claim && claim.id) {
      // Generate a token if one doesn't exist
      if (!claim.uploadToken) {
        const token = `secure${Math.floor(Math.random() * 10000)}`;
        const storedClaims = JSON.parse(localStorage.getItem('claims') || '[]');
        const updatedClaims = storedClaims.map((c: any) => {
          if (c.id === claim.id) {
            return { ...c, uploadToken: token };
          }
          return c;
        });
        localStorage.setItem('claims', JSON.stringify(updatedClaims));
        claim.uploadToken = token;
      }
      
      const fullLink = `${window.location.origin}/claims/${claim.id}/upload/${claim.uploadToken}`;
      navigator.clipboard.writeText(fullLink);
      toast({
        title: 'Upload link copied',
        description: 'The upload link has been copied to your clipboard'
      });
    }
  };

  // Add this function to navigate to the AI analysis page
  const handleAIAnalysis = () => {
    navigate('/analysis');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (notFound) {
    return <ClaimNotFound />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <ClaimSummary claim={claim} />
        <DocumentsSection 
          claim={claim} 
          onAIAnalysis={handleAIAnalysis} 
          onCopyUploadLink={handleCopyUploadLink} 
        />
        <ActivityFeed />
      </div>
      
      <ClaimInfoSidebar claim={claim} />
    </div>
  );
};

export default ClaimDetails;
