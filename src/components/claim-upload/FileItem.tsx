
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileImage, FileVideo, FileCheck, X, ExternalLink } from "lucide-react";

interface FileItemProps {
  file: File;
  progress: number;
  status: string;
  onRemove: () => void;
  isSubmitting: boolean;
}

const FileItem = ({ file, progress, status, onRemove, isSubmitting }: FileItemProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  
  useEffect(() => {
    // Generate a preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    
    return () => {
      // Cleanup the object URL when the component unmounts
      if (preview && !preview.startsWith('data:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [file]);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="h-5 w-5 text-purple-500" />;
    } else {
      return <FileCheck className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  return (
    <div className="border rounded-md p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getFileIcon(file)}
          <span className="font-medium truncate max-w-[200px]">{file.name}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRemove}
          disabled={isSubmitting || status === 'completed'}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {preview && file.type.startsWith('image/') && (
        <div className="mb-2 relative rounded overflow-hidden">
          <img 
            src={preview} 
            alt={file.name} 
            className="w-full h-32 object-cover rounded"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-1 right-1 bg-black/30 hover:bg-black/50 rounded-full p-1 h-8 w-8"
            onClick={() => window.open(preview, '_blank')}
          >
            <ExternalLink className="h-4 w-4 text-white" />
          </Button>
        </div>
      )}
      
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>{getFileSize(file.size)}</span>
          <span>
            {status === 'waiting' && 'Ready to upload'}
            {status === 'uploading' && `Uploading ${progress}%`}
            {status === 'completed' && 'Upload complete'}
          </span>
        </div>
        <Progress value={progress || 0} className="h-1" />
      </div>
    </div>
  );
};

export default FileItem;
