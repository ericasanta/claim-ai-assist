
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FileUploadZone from "@/components/claim-upload/FileUploadZone";
import FileList from "@/components/claim-upload/FileList";
import InvalidClaimMessage from "@/components/claim-upload/InvalidClaimMessage";
import { useFileUpload } from "@/hooks/use-file-upload";

const ClaimUpload = () => {
  const { claimId, token } = useParams();
  const [isValidClaim, setIsValidClaim] = useState(true);
  
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
    const claims = JSON.parse(localStorage.getItem('claims') || '[]');
    const foundClaim = claims.find((claim: any) => 
      claim.id === claimId && claim.uploadLink.includes(token || '')
    );
    
    if (!foundClaim) {
      setIsValidClaim(false);
    }
  }, [claimId, token]);

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
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
            onClick={simulateUpload} 
            disabled={uploadedFiles.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Uploading...' : 'Upload Files'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClaimUpload;
