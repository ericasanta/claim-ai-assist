
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import FileUploadZone from "@/components/claim-upload/FileUploadZone";
import FileList from "@/components/claim-upload/FileList";
import ClaimInfo from "@/components/claim-upload/ClaimInfo";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useToast } from "@/hooks/use-toast";

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
    hasImageFiles,
    addFiles,
    removeFile,
    simulateUpload
  } = useFileUpload();
  
  const { toast } = useToast();
  const [showAiNotice, setShowAiNotice] = useState(false);

  const handleUploadComplete = async () => {
    await simulateUpload();
    
    // Show AI notice if images were uploaded
    if (hasImageFiles()) {
      setShowAiNotice(true);
    }
  };

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

        {showAiNotice && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-md flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium">AI Analysis Available</p>
              <p className="text-sm text-muted-foreground">
                Your images have been uploaded and will be analyzed by our AI system for damage assessment.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Supported formats: JPG, PNG, GIF, MP4, MOV
        </div>
        <Button 
          onClick={handleUploadComplete} 
          disabled={uploadedFiles.length === 0 || isSubmitting}
        >
          {isSubmitting ? 'Uploading...' : 'Upload Files'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUploadForm;
