
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

export interface UploadStatus {
  progress: Record<string, number>;
  status: Record<string, string>;
}

export const useFileUpload = () => {
  const { claimId } = useParams();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addFiles = (newFileList: FileList) => {
    const newFiles = Array.from(newFileList);
    
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
    if (uploadedFiles.length === 0) return;
    
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

  return {
    uploadedFiles,
    uploadProgress,
    uploadStatus,
    isSubmitting,
    addFiles,
    removeFile,
    simulateUpload
  };
};
