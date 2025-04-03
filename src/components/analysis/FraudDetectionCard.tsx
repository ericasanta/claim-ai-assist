
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertTriangle, CheckCircle, Info, ShieldAlert, ShieldCheck } from "lucide-react";

interface FraudDetectionProps {
  damageAssessments: any[];
}

const FraudDetectionCard = ({ damageAssessments }: FraudDetectionProps) => {
  // Calculate a mock fraud score based on the damage assessments
  const calculateFraudScore = (): number => {
    if (!damageAssessments.length) return 20; // Default low score if no assessments
    
    let score = 0;
    
    // Check for high cost items
    const totalCost = damageAssessments.reduce((sum, item) => sum + item.estimatedCost, 0);
    const averageCost = totalCost / damageAssessments.length;
    
    if (averageCost > 600) score += 30;
    else if (averageCost > 400) score += 15;
    
    // Check for unusual number of high severity damages
    const highSeverityCount = damageAssessments.filter(d => d.severity === "high").length;
    if (highSeverityCount > 2) score += 25;
    else if (highSeverityCount > 0) score += 10;
    
    // Check for manual entries (could indicate manipulation)
    const manualEntries = damageAssessments.filter(d => d.isManual).length;
    if (manualEntries > 1) score += 20;
    
    // Add random factor (5-15) to simulate varying detection logic
    score += 5 + Math.floor(Math.random() * 10);
    
    // Cap at 100
    return Math.min(score, 100);
  };
  
  const fraudScore = calculateFraudScore();
  
  // Determine fraud status based on score
  const getFraudStatus = () => {
    if (fraudScore < 30) return { status: "passed", color: "green" };
    if (fraudScore < 70) return { status: "caution", color: "yellow" };
    return { status: "flagged", color: "red" };
  };
  
  const fraudStatus = getFraudStatus();
  
  // Generate fraud detection reasons
  const getFraudReasons = () => {
    const reasons = [];
    
    if (fraudScore >= 70) {
      reasons.push("Multiple high-cost repair items exceeding typical values");
      reasons.push("Unusual damage pattern detected across vehicle components");
      reasons.push("Multiple manual adjustments to damage assessment");
      reasons.push("Photographic evidence inconsistency detected");
    } else if (fraudScore >= 30) {
      reasons.push("Some repair costs slightly above average for vehicle type");
      reasons.push("Minor inconsistencies in damage pattern");
      if (damageAssessments.filter(d => d.isManual).length > 0) {
        reasons.push("Manual adjustment detected in damage assessment");
      }
    } else {
      reasons.push("All costs within expected ranges");
      reasons.push("Damage pattern consistent with reported incident");
      reasons.push("No suspicious modifications detected");
    }
    
    return reasons;
  };
  
  // Generate recommendations based on score
  const getRecommendations = () => {
    if (fraudScore >= 70) {
      return [
        "Initiate detailed investigation",
        "Request additional documentation",
        "Schedule in-person inspection",
        "Flag for senior adjuster review"
      ];
    } else if (fraudScore >= 30) {
      return [
        "Request secondary review",
        "Verify repair cost estimates with trusted providers",
        "Compare with similar claims history"
      ];
    } else {
      return [
        "Proceed with normal claim processing",
        "No additional verification needed"
      ];
    }
  };
  
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <Card className={`border-l-4 ${
      fraudStatus.status === "passed" ? "border-l-green-500 bg-green-50" : 
      fraudStatus.status === "caution" ? "border-l-yellow-500 bg-yellow-50" : 
      "border-l-red-500 bg-red-50"
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center gap-2">
            {fraudStatus.status === "passed" ? (
              <ShieldCheck className="h-5 w-5 text-green-500" />
            ) : fraudStatus.status === "caution" ? (
              <ShieldAlert className="h-5 w-5 text-yellow-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            Fraud Detection Analysis
          </CardTitle>
          <Badge 
            className={`
              ${fraudStatus.status === "passed" ? "bg-green-100 text-green-800 border-green-200" : 
                fraudStatus.status === "caution" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : 
                "bg-red-100 text-red-800 border-red-200"}
            `}
          >
            {fraudStatus.status === "passed" ? "Passed" : 
             fraudStatus.status === "caution" ? "Caution" : "Flagged"}
          </Badge>
        </div>
        <CardDescription>
          AI-powered fraud detection score based on damage analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-600 font-medium">Low Risk</span>
            <span className="text-red-600 font-medium">High Risk</span>
          </div>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div className="h-2 rounded bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-full"></div>
            </div>
            <div 
              className="absolute h-4 w-4 rounded-full bg-white border-2 shadow-md top-0"
              style={{ 
                left: `calc(${fraudScore}% - 8px)`, 
                borderColor: 
                  fraudStatus.status === "passed" ? "rgb(34, 197, 94)" : 
                  fraudStatus.status === "caution" ? "rgb(234, 179, 8)" : 
                  "rgb(239, 68, 68)",
              }}
            />
            <div 
              className="absolute text-xs font-bold"
              style={{ 
                left: `calc(${fraudScore}% - 12px)`,
                top: '16px', 
                color: 
                  fraudStatus.status === "passed" ? "rgb(22, 163, 74)" : 
                  fraudStatus.status === "caution" ? "rgb(202, 138, 4)" : 
                  "rgb(220, 38, 38)",
              }}
            >
              {fraudScore}%
            </div>
          </div>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-full mt-2">
              <Info className="mr-2 h-4 w-4" />
              View Detection Details
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-sm">Detected Patterns:</h4>
                <ul className="text-sm space-y-1">
                  {getFraudReasons().map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {fraudStatus.status === "passed" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : fraudStatus.status === "caution" ? (
                          <Info className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-sm">Recommended Actions:</h4>
                <ul className="text-sm space-y-1">
                  {getRecommendations().map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-0.5">•</div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default FraudDetectionCard;
