
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useClaimsData } from "@/hooks/useClaimsData";
import ClaimSummary from "@/components/claim-details/ClaimSummary";
import DocumentsSection from "@/components/claim-details/DocumentsSection";
import ActivityFeed from "@/components/claim-details/ActivityFeed";
import ClaimInfoSidebar from "@/components/claim-details/ClaimInfoSidebar";
import ClaimNotFound from "@/components/claim-details/NotFound";
import LoadingState from "@/components/claim-details/LoadingState";

const ClaimDetails = () => {
  const { claimId } = useParams<{ claimId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { claims, loading, getClaimById, updateClaims } = useClaimsData();
  const [claim, setClaim] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    console.log("ClaimDetails component mounted, claimId:", claimId);
    
    if (!loading && claimId) {
      console.log("Looking for claim with ID:", claimId, "from", claims.length, "claims");
      
      // Find the claim in the claims array
      const foundClaim = getClaimById(claimId);
      
      if (foundClaim) {
        console.log("Found claim:", foundClaim);
        setClaim(foundClaim);
        setNotFound(false);
      } else {
        console.error(`Claim with ID ${claimId} not found.`);
        console.log("Available claims:", claims);
        setNotFound(true);
      }
    }
  }, [claimId, claims, loading, getClaimById]);

  const handleCopyUploadLink = () => {
    if (claim && claim.id) {
      console.log("Generating upload link for claim:", claim.id);
      
      // Generate a token if one doesn't exist
      if (!claim.uploadToken) {
        const token = `secure${Math.floor(Math.random() * 10000)}`;
        const updatedClaims = claims.map(c => {
          if (c.id === claim.id) {
            return { ...c, uploadToken: token };
          }
          return c;
        });
        
        updateClaims(updatedClaims);
        setClaim({ ...claim, uploadToken: token });
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

  if (loading) {
    console.log("ClaimDetails loading state");
    return <LoadingState />;
  }

  if (notFound) {
    console.log("ClaimDetails not found state");
    return <ClaimNotFound />;
  }

  if (!claim) {
    console.log("ClaimDetails no claim data state");
    return <LoadingState />;
  }

  console.log("ClaimDetails rendered with claim data:", claim.id);

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
