
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
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize the data on first load
  useEffect(() => {
    console.log("useClaimsData effect running");
    
    const initializeData = () => {
      try {
        setLoading(true);
        console.log("Initializing claims data");
        
        // Force reset localStorage data for testing
        localStorage.setItem('claims', JSON.stringify(mockClaims));
        console.log("Set mock claims in localStorage:", mockClaims.length);
        
        // Set claims data in state
        setClaims(mockClaims);
        console.log("Set claims state with mock data");
        setError(null);
      } catch (error) {
        console.error("Error initializing claims:", error);
        setError(error instanceof Error ? error : new Error("Unknown error initializing claims"));
      } finally {
        setLoading(false);
        console.log("Claims initialization complete");
      }
    };
    
    initializeData();
    
    return () => {
      console.log("useClaimsData cleanup");
    };
  }, []);

  // Get a specific claim by ID
  const getClaimById = (id: string) => {
    console.log("Getting claim by ID:", id, "from", claims.length, "claims");
    console.log("Available claim IDs:", claims.map(c => c.id));
    const foundClaim = claims.find(claim => claim.id === id);
    console.log("Found claim:", foundClaim ? "Yes" : "No");
    return foundClaim || null;
  };

  // Update claims in localStorage and state
  const updateClaims = (newClaims: Claim[]) => {
    try {
      console.log("Updating claims:", newClaims.length, "claims");
      localStorage.setItem('claims', JSON.stringify(newClaims));
      setClaims(newClaims);
      console.log("Claims updated successfully");
    } catch (error) {
      console.error("Error updating claims:", error);
      setError(error instanceof Error ? error : new Error("Unknown error updating claims"));
    }
  };

  return { 
    claims, 
    loading, 
    error, 
    getClaimById,
    updateClaims 
  };
};
