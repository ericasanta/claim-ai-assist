import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, FileText, FileX, Link2, Sparkles } from "lucide-react";

const ClaimDetails = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedClaims = JSON.parse(localStorage.getItem('claims') || '[]');
    const foundClaim = storedClaims.find((c: any) => c.id === claimId);

    if (foundClaim) {
      setClaim(foundClaim);
    }

    setIsLoading(false);
  }, [claimId]);

  const handleCopyUploadLink = () => {
    if (claim && claim.uploadLink) {
      const fullLink = `${window.location.origin}${claim.uploadLink}`;
      navigator.clipboard.writeText(fullLink);
      alert('Upload link copied to clipboard!');
    }
  };

  // Add this function to navigate to the AI analysis page
  const handleAIAnalysis = () => {
    navigate('/analysis');
  };

  if (isLoading) {
    return <div>Loading claim details...</div>;
  }

  if (!claim) {
    return <div>Claim not found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Claim Summary</CardTitle>
            <CardDescription>
              Details for claim {claimId}
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
        
        {/* Documents Card - Update this section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Documents & Photos</CardTitle>
              <CardDescription>
                Uploaded documentation for this claim
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {claim.hasUploads && (
                <Button
                  onClick={handleAIAnalysis}
                  variant="outline"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Analysis
                </Button>
              )}
              <Button
                onClick={handleCopyUploadLink}
                variant="outline"
              >
                <Link2 className="mr-2 h-4 w-4" />
                Copy Upload Link
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {claim.hasUploads ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {/* Display document count */}
                  <div className="flex-1 rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Documents</p>
                        <p className="text-2xl font-bold">{claim.uploadCount || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Last upload date */}
                  <div className="flex-1 rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Last Upload</p>
                        <p className="text-sm text-muted-foreground">Today</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* AI Analysis Status - new section */}
                {claim.hasAiAnalysis ? (
                  <div className="rounded-lg border p-3 bg-blue-50">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 mt-0.5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">AI Analysis Completed</p>
                        <p className="text-sm text-muted-foreground">
                          {claim.aiDamageCount || 3} damage areas identified, estimated cost: {claim.aiEstimate || '$2,450'}
                        </p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-sm"
                          onClick={handleAIAnalysis}
                        >
                          View Analysis
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border p-3 bg-yellow-50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 mt-0.5 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium">AI Analysis Pending</p>
                        <p className="text-sm text-muted-foreground">
                          Perform AI damage analysis on uploaded photos
                        </p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-sm"
                          onClick={handleAIAnalysis}
                        >
                          Start Analysis
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileX className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No documents have been uploaded yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleCopyUploadLink}
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  Share Upload Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Activity Feed Card */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>
              Recent activities and updates related to this claim
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No activities yet.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Claim Details Sidebar */}
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
    </div>
  );
};

export default ClaimDetails;
