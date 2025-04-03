import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Calendar,
  CheckCircle2, 
  Clock, 
  Edit, 
  FileText, 
  Upload,
  ChevronLeft, 
  MessageSquare, 
  Phone,
  Plus
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const claimData = {
  "CLM-4231": {
    id: "CLM-4231",
    status: "pending",
    policyNumber: "POL-78542",
    policyCategory: "Gold",
    expiryDate: "2023-09-06",
    customer: {
      firstName: "Emily",
      lastName: "Johnson",
      street: "123 Any Street",
      town: "Any Town",
      county: "Anywhere",
      postCode: "EF6H 123",
      phone: "12345 123456",
      email: "emily.johnson@example.com",
      driverGrade: "A",
      plateNumber: "ABCD 123"
    },
    incidentDetails: {
      date: "2023-10-15",
      address: "110 W 34th St, New York, NY 10001, USA",
      coordinates: "40.7498610090806/-73.9884556111361",
      description: "Front-end collision at intersection",
      repairCompany: "Collision Central, 456 Main Street"
    },
    claimDetails: {
      category: "Property Damage",
      dateReceived: "2023-10-15",
      amount: "$4,250.00",
      otherPartyPlate: "AE02 RYA"
    },
    documents: [
      { name: "Claims Estimate PDF.pdf", type: "Document", id: "doc1" },
      { name: "CLM-4231 - Claim is under review", type: "MailMessage", id: "doc2" },
      { name: "DriverLicense-EmilyJohnson.tif", type: "Picture", id: "doc3" },
      { name: "CLM-4231", type: "MailMessage", id: "doc4" },
      { name: "CLM-4231 - Information Request", type: "MailMessage", id: "doc5" },
      { name: "emilyAccident.mp4", type: "Video", id: "doc6" }
    ],
    damagePhotos: [
      { name: "07-Accident.jpg", type: "Picture", src: "https://images.unsplash.com/photo-1578576537892-c09040d0a901" },
      { name: "05-Accident.jpg", type: "Picture", src: "https://images.unsplash.com/photo-1505156868547-9b49f4df4e04" },
      { name: "plate-NY.jpg", type: "Picture", src: "https://images.unsplash.com/photo-1503107584976-6fc5b0f17613" },
      { name: "06-Accident.jpg", type: "Picture", src: "https://images.unsplash.com/photo-1559598467-8ea22bc73885" }
    ],
    tasks: [
      {
        id: "TSK-1001",
        description: "Review damage assessment for claim CLM-4231",
        dueIn: "Today",
        priority: "high"
      },
      {
        id: "TSK-1002",
        description: "Call Emily Johnson regarding photo submission for claim",
        dueIn: "Tomorrow",
        priority: "medium"
      }
    ],
    messages: [
      {
        id: "MSG-2001",
        subject: "Questions about my claim estimate",
        date: "2023-10-15",
        senderType: "Customer",
        sender: "Emily Johnson",
        needsReply: true,
        sentiment: "neutral",
        content: "Hello, I have a few questions about the estimate for my claim. Could you please clarify the coverage for rental car during repairs?"
      }
    ]
  },
  "CLM-4230": {
    id: "CLM-4230",
    status: "under-review",
    policyNumber: "POL-96325",
    policyCategory: "Silver",
    expiryDate: "2024-03-12",
    customer: {
      firstName: "Michael",
      lastName: "Chen",
      street: "456 Oak Drive",
      town: "Riverside",
      county: "West County",
      postCode: "RC7 8TY",
      phone: "23456 789012",
      email: "michael.chen@example.com",
      driverGrade: "B",
      plateNumber: "EFGH 456"
    },
    incidentDetails: {
      date: "2023-10-14",
      address: "789 Pine Road, Riverside, RC 45678, USA",
      coordinates: "41.8781/-87.6298",
      description: "Side collision in parking lot",
      repairCompany: "Riverside Auto Repair, 789 Pine Road"
    },
    claimDetails: {
      category: "Comprehensive",
      dateReceived: "2023-10-14",
      amount: "$1,850.75",
      otherPartyPlate: "BT14 XYZ"
    },
    documents: [
      { name: "Chen-Claim-Form.pdf", type: "Document", id: "doc7" },
      { name: "CLM-4230 - Initial Assessment", type: "MailMessage", id: "doc8" },
      { name: "DriverLicense-MichaelChen.jpg", type: "Picture", id: "doc9" }
    ],
    damagePhotos: [
      { name: "chen-car-damage1.jpg", type: "Picture", src: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3" },
      { name: "chen-car-damage2.jpg", type: "Picture", src: "https://images.unsplash.com/photo-1583121274602-3e2820c69888" },
      { name: "chen-plate.jpg", type: "Picture", src: "https://images.unsplash.com/photo-1579355010061-d91168117a41" }
    ],
    tasks: [
      {
        id: "TSK-1003",
        description: "Confirm repair shop estimate for Michael Chen's claim",
        dueIn: "2 days",
        priority: "medium"
      }
    ],
    messages: [
      {
        id: "MSG-2003",
        subject: "Additional photos submitted",
        date: "2023-10-14",
        senderType: "Customer",
        sender: "Michael Chen",
        needsReply: false,
        sentiment: "positive",
        content: "I've attached additional photos of the damage as requested. Please let me know if you need anything else."
      }
    ]
  }
};

const statusStyles = {
  pending: { label: "Pending", className: "bg-yellow-400 hover:bg-yellow-500" },
  "under-review": { label: "Under Review", className: "bg-blue-500 hover:bg-blue-600" },
  completed: { label: "Completed", className: "bg-green-500 hover:bg-green-600" },
};

const priorityStyles = {
  high: { label: "High", className: "bg-red-500 hover:bg-red-600" },
  medium: { label: "Medium", className: "bg-yellow-500 hover:bg-yellow-600" },
  low: { label: "Low", className: "bg-green-500 hover:bg-green-600" },
};

const ClaimDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  
  const claim = claimData[id as keyof typeof claimData];
  
  if (!claim) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold">Claim Not Found</h2>
        <p className="text-muted-foreground mb-4">The claim you're looking for doesn't exist.</p>
        <Link to="/claims">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Claims
          </Button>
        </Link>
      </div>
    );
  }

  const claims = JSON.parse(localStorage.getItem('claims') || '[]');
  const storedClaim = claims.find((c: any) => c.id === id);
  const uploadLink = storedClaim?.uploadLink || '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Link to="/claims">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Claim #{claim.id}</h2>
            <p className="text-muted-foreground">
              {claim.customer.firstName} {claim.customer.lastName} - {claim.policyNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message Customer
          </Button>
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" />
            Call Customer
          </Button>
          <Button>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Process Claim
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Claim Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Claim Information</CardTitle>
                <Badge className={statusStyles[claim.status as keyof typeof statusStyles].className}>
                  {statusStyles[claim.status as keyof typeof statusStyles].label}
                </Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <p className="text-sm font-medium">
                        {statusStyles[claim.status as keyof typeof statusStyles].label}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Claim Category</p>
                      <p className="text-sm font-medium">{claim.claimDetails.category}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date Received</p>
                      <p className="text-sm font-medium">{claim.claimDetails.dateReceived}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Claim Amount</p>
                      <p className="text-sm font-medium">{claim.claimDetails.amount}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Incident Description</p>
                    <p className="text-sm font-medium">{claim.incidentDetails.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Auto Repair Company</p>
                    <p className="text-sm font-medium">{claim.incidentDetails.repairCompany}</p>
                  </div>
                  {claim.claimDetails.otherPartyPlate && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Other Party Plate</p>
                      <p className="text-sm font-medium">{claim.claimDetails.otherPartyPlate}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Policy Information</CardTitle>
                <Badge variant="outline">{claim.policyCategory}</Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Policy Number</p>
                      <p className="text-sm font-medium">{claim.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Policy Category</p>
                      <p className="text-sm font-medium">{claim.policyCategory}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Expires</p>
                      <p className="text-sm font-medium">{claim.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Driver Grade</p>
                      <p className="text-sm font-medium">{claim.customer.driverGrade}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">First Name</p>
                      <p className="text-sm font-medium">{claim.customer.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                      <p className="text-sm font-medium">{claim.customer.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Street</p>
                    <p className="text-sm font-medium">{claim.customer.street}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Town</p>
                      <p className="text-sm font-medium">{claim.customer.town}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">County</p>
                      <p className="text-sm font-medium">{claim.customer.county}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Post Code</p>
                      <p className="text-sm font-medium">{claim.customer.postCode}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{claim.customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{claim.customer.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Number Plate</p>
                    <p className="text-sm font-medium">{claim.customer.plateNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Incident Information</CardTitle>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{claim.incidentDetails.date}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Incident Date</p>
                      <p className="text-sm font-medium">{claim.incidentDetails.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Incident Address</p>
                      <p className="text-sm font-medium">{claim.incidentDetails.address}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Latitude/Longitude</p>
                    <p className="text-sm font-medium">{claim.incidentDetails.coordinates}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Damage Photos</CardTitle>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photos
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {claim.damagePhotos.map((photo, index) => (
                    <div key={index} className="overflow-hidden rounded-md border">
                      <AspectRatio ratio={4/3} className="bg-muted">
                        <img
                          src={photo.src}
                          alt={`Damage photo ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </AspectRatio>
                      <div className="p-2">
                        <p className="text-sm font-medium">{photo.name}</p>
                        <p className="text-xs text-muted-foreground">{photo.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {uploadLink && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground">Customer Upload Link</p>
              <div className="flex items-center gap-2 mt-1">
                <Link 
                  to={`/claim-upload/${storedClaim.id}/${storedClaim.uploadToken}`} 
                  className="text-sm font-medium text-blue-500 hover:underline flex items-center"
                  target="_blank"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Share with customer
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/claim-upload/${storedClaim.id}/${storedClaim.uploadToken}`);
                    toast({
                      title: "Link copied to clipboard",
                      description: "You can now share this link with the customer."
                    });
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Claim Documents</CardTitle>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {claim.documents.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-4 rounded-md border p-4">
                    <FileText className="h-10 w-10 text-blue-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type}</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Claim Tasks</CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {claim.tasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="font-medium">{task.description}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>Due: {task.dueIn}</span>
                          </div>
                        </div>
                        <Badge className={priorityStyles[task.priority as keyof typeof priorityStyles].className}>
                          {priorityStyles[task.priority as keyof typeof priorityStyles].label}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Complete</Button>
                  </div>
                ))}
                {claim.tasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                    <p className="text-muted-foreground">No tasks for this claim</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Claim Messages</CardTitle>
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {claim.messages.map((message, index) => (
                  <div key={index} className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{message.subject}</h3>
                      <p className="text-sm text-muted-foreground">{message.date}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-medium">{message.senderType}:</span>
                      <span className="text-sm">{message.sender}</span>
                    </div>
                    <p className="mt-4 text-sm">{message.content}</p>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {message.needsReply && (
                        <Button size="sm">
                          Reply
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {claim.messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                    <p className="text-muted-foreground">No messages for this claim</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      New Message
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClaimDetails;
