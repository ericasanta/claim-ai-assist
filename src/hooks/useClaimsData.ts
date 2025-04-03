import { useState, useEffect } from "react";
import { mockClaims } from "@/data/dashboardData";

export interface Claim {
  id: string;
  customer: string;
  policyNumber: string;
  status: string;
  date: string;
  type: string;
  amount: string;
  uploadLink?: string;
  hasUploads?: boolean;
  uploadCount?: number;
  description?: string;
  incidentDate?: string;
  createdDate?: string;
  claimAmount?: string;
}

export const useClaimsData = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  
  useEffect(() => {
    // Get claims from localStorage
    const storedClaims = JSON.parse(localStorage.getItem('claims') || '[]');
    
    // If we have stored claims, use those first
    if (storedClaims.length > 0) {
      setClaims(storedClaims);
    } else {
      // Otherwise use the mock data
      setClaims(mockClaims);
    }
  }, []);

  return { claims };
};
