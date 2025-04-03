
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
    
    // Check file types and sizes
    const validFiles = newFiles.filter(file => {
      // Check if file type is supported
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isDocument = file.type === 'application/pdf';
      
      if (!isImage && !isVideo && !isDocument) {
        toast({
          title: "Unsupported file type",
          description: `${file.name} is not a supported file type. Please upload images, videos, or PDF documents.`,
          variant: "destructive",
        });
        return false;
      }
      
      // Check file size
      const maxSizeInBytes = isVideo ? 100 * 1024 * 1024 : 20 * 1024 * 1024; // 100MB for videos, 20MB for others
      if (file.size > maxSizeInBytes) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the maximum file size of ${isVideo ? '100MB' : '20MB'}.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Initialize progress for each file
    validFiles.forEach(file => {
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 0
      }));
      setUploadStatus(prev => ({
        ...prev,
        [file.name]: 'waiting'
      }));
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
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
                  // Create new tasks for this upload
                  const reviewTask = {
                    id: `TSK-${Math.floor(Math.random() * 10000)}`,
                    description: `Review ${uploadedFiles.length} new document(s) uploaded for claim ${claimId}`,
                    dueIn: "Today",
                    priority: "high",
                    type: "documentReview"
                  };
                  
                  const aiAnalysisTask = {
                    id: `TSK-${Math.floor(Math.random() * 10000)}`,
                    description: `Analyze vehicle damage with AI tools for claim ${claimId}`,
                    dueIn: "Today",
                    priority: "high",
                    type: "aiAnalysis"
                  };
                  
                  const newTasks = [reviewTask];
                  
                  // Only add AI analysis task if this is a photo upload (simple check for image files)
                  const hasImages = uploadedFiles.some(file => 
                    file.type.startsWith('image/') || 
                    ['jpg', 'jpeg', 'png', 'gif'].some(ext => 
                      file.name.toLowerCase().endsWith(`.${ext}`)
                    )
                  );
                  
                  if (hasImages) {
                    newTasks.push(aiAnalysisTask);
                  }
                  
                  return {
                    ...claim,
                    hasUploads: true,
                    uploadCount: (claim.uploadCount || 0) + uploadedFiles.length,
                    tasks: claim.tasks ? [...claim.tasks, ...newTasks] : newTasks
                  };
                }
                return claim;
              });
              localStorage.setItem('claims', JSON.stringify(updatedClaims));
              
              // Add tasks to dashboard tasks
              const dashboardTasks = JSON.parse(localStorage.getItem('dashboardTasks') || '[]');
              const newDashboardTasks = [];
              
              // Add document review task
              newDashboardTasks.push({
                id: `TSK-${Math.floor(Math.random() * 10000)}`,
                description: `Review ${uploadedFiles.length} new document(s) uploaded for claim ${claimId}`,
                dueIn: "Today",
                priority: "high",
                type: "documentReview",
                claimId: claimId
              });
              
              // Add AI analysis task if images were uploaded
              const hasImages = uploadedFiles.some(file => 
                file.type.startsWith('image/') || 
                ['jpg', 'jpeg', 'png', 'gif'].some(ext => 
                  file.name.toLowerCase().endsWith(`.${ext}`)
                )
              );
              
              if (hasImages) {
                newDashboardTasks.push({
                  id: `TSK-${Math.floor(Math.random() * 10000)}`,
                  description: `Analyze vehicle damage with AI tools for claim ${claimId}`,
                  dueIn: "Today",
                  priority: "high",
                  type: "aiAnalysis",
                  claimId: claimId
                });
                
                // Notify user that AI analysis is available
                toast({
                  title: "AI Analysis Available",
                  description: "Images have been uploaded. You can now perform AI damage analysis.",
                  duration: 5000,
                });
              }
              
              localStorage.setItem('dashboardTasks', JSON.stringify([...dashboardTasks, ...newDashboardTasks]));
              
              // Don't clear files here as we'll handle the redirect in the ClaimUpload component
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
