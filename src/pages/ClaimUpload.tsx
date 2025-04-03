
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileImage, FileVideo, Upload, X, FileCheck, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ClaimUpload = () => {
  const { claimId, token } = useParams();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Validation
  const [isValidClaim, setIsValidClaim] = useState(true);

  // Check if the claim exists in localStorage
  useState(() => {
    const claims = JSON.parse(localStorage.getItem('claims') || '[]');
    const foundClaim = claims.find((claim: any) => 
      claim.id === claimId && claim.uploadLink.includes(token || '')
    );
    
    if (!foundClaim) {
      setIsValidClaim(false);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // Initialize progress for each file
      newFiles.forEach(file => {
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 0
        }));
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: 'waiting'
        }));
      });
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    
    // Remove progress and status for this file
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileToRemove.name];
      return newProgress;
    });
    
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[fileToRemove.name];
      return newStatus;
    });
  };

  const simulateUpload = () => {
    setIsSubmitting(true);
    
    // Simulate upload for each file
    uploadedFiles.forEach((file, index) => {
      setUploadStatus(prev => ({
        ...prev,
        [file.name]: 'uploading'
      }));
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setUploadStatus(prev => ({
            ...prev,
            [file.name]: 'completed'
          }));
          
          // If this is the last file, complete the submission
          if (index === uploadedFiles.length - 1) {
            setTimeout(() => {
              setIsSubmitting(false);
              toast({
                title: "Files uploaded successfully",
                description: `All ${uploadedFiles.length} file(s) have been uploaded for claim ${claimId}.`,
              });
              
              // Update claim in localStorage to record that files were uploaded
              const claims = JSON.parse(localStorage.getItem('claims') || '[]');
              const updatedClaims = claims.map((claim: any) => {
                if (claim.id === claimId) {
                  return {
                    ...claim,
                    hasUploads: true,
                    uploadCount: (claim.uploadCount || 0) + uploadedFiles.length
                  };
                }
                return claim;
              });
              localStorage.setItem('claims', JSON.stringify(updatedClaims));
              
              // Clear files after successful upload
              setUploadedFiles([]);
              setUploadProgress({});
              setUploadStatus({});
            }, 1000);
          }
        }
        
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));
      }, 200);
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="h-5 w-5 text-purple-500" />;
    } else {
      return <FileCheck className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!isValidClaim) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-center">Invalid Upload Link</CardTitle>
            <CardDescription className="text-center">
              This upload link is invalid or has expired. Please contact your claims adjuster for assistance.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
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
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Drag files here or click to upload</h3>
              <p className="text-sm text-muted-foreground">
                Upload images and videos of the damage for your claim
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={isSubmitting}
              >
                Select Files
              </Button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*,video/*" 
                multiple 
                className="hidden" 
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Selected Files ({uploadedFiles.length})</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file)}
                        <span className="font-medium">{file.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFile(index)}
                        disabled={isSubmitting || uploadStatus[file.name] === 'completed'}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span>
                          {uploadStatus[file.name] === 'waiting' && 'Ready to upload'}
                          {uploadStatus[file.name] === 'uploading' && `Uploading ${uploadProgress[file.name]}%`}
                          {uploadStatus[file.name] === 'completed' && 'Upload complete'}
                        </span>
                      </div>
                      <Progress value={uploadProgress[file.name] || 0} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
