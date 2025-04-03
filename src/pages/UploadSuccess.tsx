
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/card";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const UploadSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { claimId, message } = location.state || { 
    claimId: "Unknown", 
    message: "Your files have been uploaded successfully." 
  };

  // If the user refreshes the page, we won't have the state anymore
  useEffect(() => {
    if (!location.state) {
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  }, [location.state, navigate]);

  return (
    <div className="container mx-auto py-12 flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Upload Successful</CardTitle>
          <CardDescription>
            Thank you for submitting your documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2"><strong>Claim Reference:</strong> {claimId}</p>
          <p className="text-muted-foreground">{message}</p>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <ul className="text-sm text-left list-disc pl-5 space-y-1">
              <li>Our claims team will review your uploads</li>
              <li>You'll receive an update within 1-2 business days</li>
              <li>You may be contacted for additional information</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => window.close()}
            className="w-full"
          >
            Close Window
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UploadSuccess;
