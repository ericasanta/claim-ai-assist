
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FileUploadZone from "@/components/claim-upload/FileUploadZone";
import FileList from "@/components/claim-upload/FileList";
import ClaimInfo from "@/components/claim-upload/ClaimInfo";
import { useFileUpload } from "@/hooks/use-file-upload";

interface FileUploadFormProps {
  claimId: string;
  claimInfo: any;
}

const FileUploadForm = ({ claimId, claimInfo }: FileUploadFormProps) => {
  const {
    uploadedFiles,
    uploadProgress,
    uploadStatus,
    isSubmitting,
    addFiles,
    removeFile,
    simulateUpload
  } = useFileUpload();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Documentation for Claim {claimId}</CardTitle>
        <CardDescription>
          Upload photos, videos, and other documents related to your insurance claim.
          {claimInfo && <ClaimInfo claimInfo={claimInfo} />}
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
  );
};

export default FileUploadForm;
