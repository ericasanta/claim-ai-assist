
// Sample data for tasks
export const agentTasks = [
  {
    id: "TSK-1001",
    description: "Review damage assessment for claim CLM-4231",
    dueIn: "Today",
    claimId: "CLM-4231",
    priority: "high",
    type: "documentReview"
  },
  {
    id: "TSK-1002",
    description: "Call Emily Johnson regarding photo submission for claim",
    dueIn: "Tomorrow",
    claimId: "CLM-4231",
    priority: "medium",
    type: "call"
  },
  {
    id: "TSK-1003",
    description: "Confirm repair shop estimate for Michael Chen's claim",
    dueIn: "2 days",
    claimId: "CLM-4230",
    priority: "medium",
    type: "estimate"
  },
  {
    id: "TSK-1004",
    description: "Submit final approval for Sarah Williams's payout",
    dueIn: "Today",
    claimId: "CLM-4229",
    priority: "high",
    type: "approval"
  },
  {
    id: "TSK-1005",
    description: "Analyze vehicle damage with AI tools for David Rodriguez",
    dueIn: "Today",
    claimId: "CLM-4228",
    priority: "high",
    type: "aiAnalysis"
  }
];

// Sample data for messages
export const agentMessages = [
  {
    id: "MSG-2001",
    subject: "Questions about my claim estimate",
    date: "2023-10-15",
    senderType: "Customer",
    sender: "Emily Johnson",
    needsReply: true,
    sentiment: "neutral",
    claimId: "CLM-4231"
  },
  {
    id: "MSG-2002",
    subject: "Approval needed for payout above threshold",
    date: "2023-10-14",
    senderType: "Senior Adjuster",
    sender: "James Wilson",
    needsReply: true,
    sentiment: "urgent",
    claimId: "CLM-4228"
  },
  {
    id: "MSG-2003",
    subject: "Additional photos submitted",
    date: "2023-10-14",
    senderType: "Customer",
    sender: "Michael Chen",
    needsReply: false,
    sentiment: "positive",
    claimId: "CLM-4230"
  },
  {
    id: "MSG-2004",
    subject: "Repair shop pricing dispute",
    date: "2023-10-13",
    senderType: "Repair Shop",
    sender: "Downtown Auto Repair",
    needsReply: true,
    sentiment: "negative",
    claimId: "CLM-4227"
  },
  {
    id: "MSG-2005",
    subject: "Thank you for resolving my claim",
    date: "2023-10-12",
    senderType: "Customer",
    sender: "Sarah Williams",
    needsReply: false,
    sentiment: "positive",
    claimId: "CLM-4229"
  }
];

// Sample data for demonstration
export const mockClaims = [
  {
    id: "CLM-4231",
    customer: "Emily Johnson",
    policyNumber: "POL-78542",
    status: "pending",
    date: "2023-10-15",
    type: "Collision",
    amount: "$4,250.00",
  },
  {
    id: "CLM-4230",
    customer: "Michael Chen",
    policyNumber: "POL-96325",
    status: "under-review",
    date: "2023-10-14",
    type: "Comprehensive",
    amount: "$1,850.75",
  },
  {
    id: "CLM-4229",
    customer: "Sarah Williams",
    policyNumber: "POL-12589",
    status: "completed",
    date: "2023-10-12",
    type: "Liability",
    amount: "$3,500.00",
  },
  {
    id: "CLM-4228",
    customer: "David Rodriguez",
    policyNumber: "POL-36985",
    status: "under-review",
    date: "2023-10-10",
    type: "Collision",
    amount: "$7,250.50",
  },
  {
    id: "CLM-4227",
    customer: "Linda Smith",
    policyNumber: "POL-45632",
    status: "pending",
    date: "2023-10-09",
    type: "Comprehensive",
    amount: "$2,800.25",
  },
];
