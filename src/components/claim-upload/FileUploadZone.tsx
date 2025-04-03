
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploadZoneProps {
  isSubmitting: boolean;
  onFileSelect: (files: FileList) => void;
}

const FileUploadZone = ({ isSubmitting, onFileSelect }: FileUploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  return (
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
  );
};

export default FileUploadZone;
