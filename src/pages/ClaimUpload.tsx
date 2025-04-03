
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Image, Video, AlertCircle } from "lucide-react";
import FileUploadZone from "@/components/claim-upload/FileUploadZone";
import FileList from "@/components/claim-upload/FileList";
import InvalidClaimMessage from "@/components/claim-upload/InvalidClaimMessage";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useToast } from "@/hooks/use-toast";

const ClaimUpload = () => {
  const { claimId, token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isValidClaim, setIsValidClaim] = useState(false);
  const [claimInfo, setClaimInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    uploadedFiles,
    uploadProgress,
    uploadStatus,
    isSubmitting,
    addFiles,
    removeFile,
    simulateUpload
  } = useFileUpload();

  // Check if the claim exists in localStorage
  useEffect(() => {
    const validateClaim = () => {
      console.log("Validating claim with ID:", claimId, "and token:", token);
      setIsLoading(true);
      try {
        // Initialize claims if they don't exist
        if (!localStorage.getItem('claims')) {
          console.log("Initializing claims in localStorage");
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

    // Small delay to ensure the router is fully initialized
    const timer = setTimeout(() => {
      validateClaim();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [claimId, token]);

  const handleSuccessfulUpload = () => {
    toast({
      title: "Files Uploaded Successfully",
      description: `Your files have been uploaded successfully for claim ${claimId}.`,
    });
    
    setTimeout(() => {
      navigate("/upload-success", { 
        state: { 
          claimId,
          message: "Thank you for uploading your documentation. Your claim is being processed." 
        } 
      });
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Validating claim...</p>
        </div>
      </div>
    );
  }

  if (!isValidClaim) {
    return <InvalidClaimMessage />;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upload Documentation for Claim {claimId}</CardTitle>
          <CardDescription>
            Upload photos, videos, and other documents related to your insurance claim.
            {claimInfo && (
              <div className="mt-2 text-sm">
                <p><strong>Policy:</strong> {claimInfo.policyNumber}</p>
                <p><strong>Date of Incident:</strong> {claimInfo.incidentDate}</p>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertTitle>Tips for better documentation</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 text-sm mt-2">
                <li>Take photos in good lighting conditions</li>
                <li>Capture all angles of the damage</li>
                <li>Include close-up shots of damaged areas</li>
                <li>If possible, include a video showing all around the vehicle</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center">
              <Image className="h-10 w-10 text-blue-500 mr-3" />
              <div>
                <h3 className="font-medium">Photos</h3>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG - max 20MB each
                </p>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 flex items-center">
              <Video className="h-10 w-10 text-purple-500 mr-3" />
              <div>
                <h3 className="font-medium">Videos</h3>
                <p className="text-sm text-muted-foreground">
                  MP4, MOV - max 100MB each
                </p>
              </div>
            </div>
          </div>
          
          <FileUploadZone 
            isSubmitting={isSubmitting}
            onFileSelect={addFiles}
          />
          
          <FileList 
            files={uploadedFiles}
            progress={uploadProgress}
            status={uploadStatus}
            isSubmitting={isSubmitting}
            onRemoveFile={removeFile}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Supported formats: JPG, PNG, GIF, MP4, MOV
          </div>
          <Button 
            onClick={() => {
              simulateUpload();
              handleSuccessfulUpload();
            }} 
            disabled={uploadedFiles.length === 0 || isSubmitting}
            className="relative overflow-hidden"
          >
            {isSubmitting ? 'Uploading...' : 'Upload Files'}
            {isSubmitting && (
              <span className="absolute bottom-0 left-0 h-1 bg-white/30 animate-progress"></span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClaimUpload;
