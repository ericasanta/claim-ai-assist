
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileImage, FileVideo, FileCheck, X } from "lucide-react";

interface FileItemProps {
  file: File;
  progress: number;
  status: string;
  onRemove: () => void;
  isSubmitting: boolean;
}

const FileItem = ({ file, progress, status, onRemove, isSubmitting }: FileItemProps) => {
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="h-5 w-5 text-purple-500" />;
    } else {
      return <FileCheck className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="border rounded-md p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getFileIcon(file)}
          <span className="font-medium">{file.name}</span>
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
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
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
