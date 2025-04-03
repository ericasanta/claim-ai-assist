
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import './styles/analysis.css'

// Initialize claims in localStorage if they don't exist
if (!localStorage.getItem('claims')) {
  const initialClaims = [
    {
      id: "CLM-2296",
      customer: "Jane Smith",
      policyNumber: "POL-1234-5678",
      incidentDate: "2025-03-28",
      type: "Vehicle Damage",
      description: "Car damaged in parking lot",
      status: "In Progress",
      createdDate: "2025-04-01",
      claimAmount: "$3,500",
      uploadLink: "/claims/CLM-2296/upload/secure123",
      hasUploads: false,
      uploadCount: 0
    }
  ];
  localStorage.setItem('claims', JSON.stringify(initialClaims));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
