
import { Spinner } from "@/components/ui/spinner";

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Validating claim...</p>
      </div>
    </div>
  );
};

export default LoadingState;
