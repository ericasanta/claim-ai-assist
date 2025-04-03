
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
  const { claimId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { claims, loading } = useClaimsData();
  const [claim, setClaim] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!loading && claimId) {
      // Find the claim in the claims array
      const foundClaim = claims.find(c => c.id === claimId);
      
      if (foundClaim) {
        setClaim(foundClaim);
        setNotFound(false);
      } else {
        console.error(`Claim with ID ${claimId} not found`);
        setNotFound(true);
      }
    }
  }, [claimId, claims, loading]);

  const handleCopyUploadLink = () => {
    if (claim && claim.id) {
      // Generate a token if one doesn't exist
      if (!claim.uploadToken) {
        const token = `secure${Math.floor(Math.random() * 10000)}`;
        const updatedClaims = claims.map(c => {
          if (c.id === claim.id) {
            return { ...c, uploadToken: token };
          }
          return c;
        });
        localStorage.setItem('claims', JSON.stringify(updatedClaims));
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
