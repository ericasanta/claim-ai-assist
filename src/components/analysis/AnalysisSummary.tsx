
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface AnalysisSummaryProps {
  damageAssessments: any[];
  handleFinishAnalysis: () => void;
}

const AnalysisSummary = ({ damageAssessments, handleFinishAnalysis }: AnalysisSummaryProps) => {
  // Count damage by severity
  const highSeverity = damageAssessments.filter(d => d.severity === "high").length;
  const mediumSeverity = damageAssessments.filter(d => d.severity === "medium").length;
  const lowSeverity = damageAssessments.filter(d => d.severity === "low").length;
  
  // Calculate total cost
  const totalCost = damageAssessments.reduce((sum, item) => sum + item.estimatedCost, 0);
  
  // Determine if there are critical damages
  const hasCriticalDamage = highSeverity > 0;
  
  // Get repair recommendations
  const getRecommendation = (assessment: any) => {
    if (assessment.recommendation) return assessment.recommendation;
    return assessment.severity === 'high' ? 'replace' : 
           assessment.severity === 'medium' ? 'repair' : 'touchup';
  };
  
  const replaceItems = damageAssessments.filter(d => getRecommendation(d) === 'replace');
  const repairItems = damageAssessments.filter(d => getRecommendation(d) === 'repair');
  const touchupItems = damageAssessments.filter(d => getRecommendation(d) === 'touchup');
  
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
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className={`p-2 rounded-md ${highSeverity > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
              <p className="text-xs text-muted-foreground">High</p>
              <p className={`text-lg font-semibold ${highSeverity > 0 ? 'text-red-600' : 'text-gray-500'}`}>{highSeverity}</p>
            </div>
            <div className={`p-2 rounded-md ${mediumSeverity > 0 ? 'bg-yellow-50' : 'bg-gray-50'}`}>
              <p className="text-xs text-muted-foreground">Medium</p>
              <p className={`text-lg font-semibold ${mediumSeverity > 0 ? 'text-yellow-600' : 'text-gray-500'}`}>{mediumSeverity}</p>
            </div>
            <div className={`p-2 rounded-md ${lowSeverity > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
              <p className="text-xs text-muted-foreground">Low</p>
              <p className={`text-lg font-semibold ${lowSeverity > 0 ? 'text-green-600' : 'text-gray-500'}`}>{lowSeverity}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Repair Recommendations:</p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <Badge className="bg-red-100 text-red-800 border-red-200">Replace</Badge>
                <span>{replaceItems.length} items</span>
              </div>
              <div className="flex justify-between text-sm">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Repair</Badge>
                <span>{repairItems.length} items</span>
              </div>
              <div className="flex justify-between text-sm">
                <Badge className="bg-green-100 text-green-800 border-green-200">Touch-up</Badge>
                <span>{touchupItems.length} items</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Estimated Total Cost:</p>
            <p className="text-sm font-bold">
              ${totalCost.toFixed(2)}
            </p>
          </div>
          
          {hasCriticalDamage && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-md border border-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Critical Damage Detected</p>
                <p className="text-xs text-amber-700">
                  {highSeverity} high severity issues require immediate attention
                </p>
              </div>
            </div>
          )}
          
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
