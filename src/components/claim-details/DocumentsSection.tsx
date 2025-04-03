
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, FileX, Link2, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentsSectionProps {
  claim: any;
  onAIAnalysis: () => void;
  onCopyUploadLink: () => void;
}

const DocumentsSection = ({ claim, onAIAnalysis, onCopyUploadLink }: DocumentsSectionProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!claim) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documents & Photos</CardTitle>
          <CardDescription>
            Uploaded documentation for this claim
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {claim?.hasUploads && (
            <Button
              onClick={onAIAnalysis}
              variant="outline"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Analysis
            </Button>
          )}
          <Button
            onClick={onCopyUploadLink}
            variant="outline"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Copy Upload Link
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {claim?.hasUploads ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* Display document count */}
              <div className="flex-1 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Documents</p>
                    <p className="text-2xl font-bold">{claim.uploadCount || 0}</p>
                  </div>
                </div>
              </div>
              
              {/* Last upload date */}
              <div className="flex-1 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Last Upload</p>
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Analysis Status */}
            {claim.hasAiAnalysis ? (
              <div className="rounded-lg border p-3 bg-blue-50">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 mt-0.5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">AI Analysis Completed</p>
                    <p className="text-sm text-muted-foreground">
                      {claim.aiDamageCount || 3} damage areas identified, estimated cost: {claim.aiEstimate || '$2,450'}
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm"
                      onClick={onAIAnalysis}
                    >
                      View Analysis
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border p-3 bg-yellow-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">AI Analysis Pending</p>
                    <p className="text-sm text-muted-foreground">
                      Perform AI damage analysis on uploaded photos
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm"
                      onClick={onAIAnalysis}
                    >
                      Start Analysis
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileX className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No documents have been uploaded yet</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={onCopyUploadLink}
            >
              <Link2 className="mr-2 h-4 w-4" />
              Share Upload Link
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
