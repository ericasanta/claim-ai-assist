
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const ClaimNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-center">Claim Not Found</CardTitle>
          <CardDescription className="text-center">
            The claim you are looking for does not exist or has been removed.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pt-4">
          <Link to="/claims">
            <Button>
              Return to Claims List
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimNotFound;
