
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
  uploadToken?: string;
}

export const useClaimsData = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get claims from localStorage or initialize with mock data
    try {
      const storedClaims = localStorage.getItem('claims');
      
      if (storedClaims && JSON.parse(storedClaims).length > 0) {
        setClaims(JSON.parse(storedClaims));
      } else {
        // Initialize with mock data if none exists
        localStorage.setItem('claims', JSON.stringify(mockClaims));
        setClaims(mockClaims);
      }
    } catch (error) {
      console.error("Error loading claims:", error);
      // Fallback to mock data if there's an error
      setClaims(mockClaims);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a method to get a specific claim by ID
  const getClaimById = (id: string) => {
    return claims.find(claim => claim.id === id) || null;
  };

  return { claims, loading, getClaimById };
};
