
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

  const hasImageFiles = () => {
    return uploadedFiles.some(file => 
      file.type.startsWith('image/') || 
      ['jpg', 'jpeg', 'png', 'gif'].some(ext => 
        file.name.toLowerCase().endsWith(`.${ext}`)
      )
    );
  };

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

  const simulateUpload = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate upload for each file
    for (let index = 0; index < uploadedFiles.length; index++) {
      const file = uploadedFiles[index];
      setUploadStatus(prev => ({
        ...prev,
        [file.name]: 'uploading'
      }));
      
      await new Promise<void>((resolve) => {
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
            
            resolve();
          }
          
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
        }, 200);
      });
    }
    
    // Complete the submission after all files are processed
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
            type: "documentReview",
            claimId: claimId
          };
          
          const aiAnalysisTask = {
            id: `TSK-${Math.floor(Math.random() * 10000)}`,
            description: `Analyze vehicle damage with AI tools for claim ${claimId}`,
            dueIn: "Today",
            priority: "high",
            type: "aiAnalysis",
            claimId: claimId
          };
          
          const newTasks = [reviewTask];
          
          // Only add AI analysis task if this is a photo upload
          if (hasImageFiles()) {
            newTasks.push(aiAnalysisTask);
          }
          
          return {
            ...claim,
            hasUploads: true,
            uploadCount: (claim.uploadCount || 0) + uploadedFiles.length
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
      if (hasImageFiles()) {
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
      
      // Clear files after successful upload
      setUploadedFiles([]);
      setUploadProgress({});
      setUploadStatus({});
    }, 1000);
  };

  return {
    uploadedFiles,
    uploadProgress,
    uploadStatus,
    isSubmitting,
    hasImageFiles,
    addFiles,
    removeFile,
    simulateUpload
  };
};
