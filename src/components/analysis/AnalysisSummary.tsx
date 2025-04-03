
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface AnalysisSummaryProps {
  damageAssessments: any[];
  handleFinishAnalysis: () => void;
}

const AnalysisSummary = ({ damageAssessments, handleFinishAnalysis }: AnalysisSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Total Damage Points:</p>
            <p className="text-sm">{damageAssessments.length}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">High Severity Issues:</p>
            <p className="text-sm">
              {damageAssessments.filter(d => d.severity === "high").length}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Estimated Total Cost:</p>
            <p className="text-sm font-bold">
              ${damageAssessments.reduce((sum, item) => sum + item.estimatedCost, 0).toFixed(2)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Analysis Status:</p>
            <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleFinishAnalysis}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Complete Analysis & Generate Estimate
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisSummary;
