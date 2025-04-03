
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
  
  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      try {
        console.log("Fetching claims data...");
        
        // First try to get claims from localStorage
        const storedClaims = localStorage.getItem('claims');
        
        if (storedClaims && JSON.parse(storedClaims).length > 0) {
          const parsedClaims = JSON.parse(storedClaims);
          console.log("Found claims in localStorage:", parsedClaims.length, "claims");
          setClaims(parsedClaims);
        } else {
          console.log("No claims in localStorage, initializing with mock data");
          // Initialize with mock data if none exists
          localStorage.setItem('claims', JSON.stringify(mockClaims));
          setClaims(mockClaims);
        }
        setError(null);
      } catch (error) {
        console.error("Error loading claims:", error);
        // Fallback to mock data if there's an error
        localStorage.setItem('claims', JSON.stringify(mockClaims));
        setClaims(mockClaims);
        setError(error instanceof Error ? error : new Error("Unknown error loading claims"));
      } finally {
        setLoading(false);
        console.log("Claims data fetch complete");
      }
    };

    fetchClaims();
    
    // Add a cleanup check to prevent memory leaks
    return () => {
      console.log("useClaimsData hook cleanup");
    };
  }, []);

  // Add a method to get a specific claim by ID
  const getClaimById = (id: string) => {
    console.log("Getting claim by ID:", id, "from", claims.length, "claims");
    console.log("Available claim IDs:", claims.map(c => c.id));
    const foundClaim = claims.find(claim => claim.id === id);
    console.log("Found claim:", foundClaim ? "Yes" : "No");
    return foundClaim || null;
  };

  // Add a method to update claims in localStorage and state
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
