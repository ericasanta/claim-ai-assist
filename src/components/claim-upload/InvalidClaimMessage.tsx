
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const InvalidClaimMessage = () => {
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
};

export default InvalidClaimMessage;
