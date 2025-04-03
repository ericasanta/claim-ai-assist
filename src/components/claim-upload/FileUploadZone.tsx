
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image, File, Video } from "lucide-react";

interface FileUploadZoneProps {
  isSubmitting: boolean;
  onFileSelect: (files: FileList) => void;
}

const FileUploadZone = ({ isSubmitting, onFileSelect }: FileUploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
      // Reset the input value so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files);
    }
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Drag files here or click to upload</h3>
        <p className="text-sm text-muted-foreground">
          Upload images and videos of the damage for your claim
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()} 
            disabled={isSubmitting}
            className="gap-2"
          >
            <Image className="h-4 w-4" />
            Add Photos
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()} 
            disabled={isSubmitting}
            className="gap-2"
          >
            <Video className="h-4 w-4" />
            Add Videos
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()} 
            disabled={isSubmitting}
            className="gap-2"
          >
            <File className="h-4 w-4" />
            Add Documents
          </Button>
        </div>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*,video/*,application/pdf" 
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
