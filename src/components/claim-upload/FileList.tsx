
import FileItem from "./FileItem";

interface FileListProps {
  files: File[];
  progress: Record<string, number>;
  status: Record<string, string>;
  isSubmitting: boolean;
  onRemoveFile: (index: number) => void;
}

const FileList = ({ files, progress, status, isSubmitting, onRemoveFile }: FileListProps) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Selected Files ({files.length})</h3>
      <div className="space-y-3">
        {files.map((file, index) => (
          <FileItem
            key={`${file.name}-${index}`}
            file={file}
            progress={progress[file.name] || 0}
            status={status[file.name] || 'waiting'}
            onRemove={() => onRemoveFile(index)}
            isSubmitting={isSubmitting}
          />
        ))}
      </div>
    </div>
  );
};

export default FileList;
