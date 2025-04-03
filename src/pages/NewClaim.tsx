
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeftIcon, 
  Car, 
  Check, 
  FileText, 
  Info, 
  MapPin, 
  Plus, 
  Search, 
  Upload, 
  Users, 
  X 
} from "lucide-react";

// Mock data for policy lookup
const mockPolicies = [
  {
    id: "POL-78542",
    customerName: "Emily Johnson",
    vehicleMake: "Toyota",
    vehicleModel: "Camry",
    vehicleYear: "2020",
    vin: "1HGCM82633A123456",
    licensePlate: "ABC-1234",
    drivers: [
      {
        name: "Emily Johnson",
        licenseNumber: "DL-123456789",
        relationship: "Policyholder"
      },
      {
        name: "Michael Johnson",
        licenseNumber: "DL-987654321",
        relationship: "Spouse"
      }
    ]
  },
  {
    id: "POL-96325",
    customerName: "Michael Chen",
    vehicleMake: "Honda",
    vehicleModel: "Civic",
    vehicleYear: "2019",
    vin: "2HGFC2F52KH123456",
    licensePlate: "XYZ-7890",
    drivers: [
      {
        name: "Michael Chen",
        licenseNumber: "DL-456789123",
        relationship: "Policyholder"
      }
    ]
  },
  {
    id: "POL-45678",
    customerName: "Sarah Williams",
    vehicleMake: "Ford",
    vehicleModel: "Escape",
    vehicleYear: "2021",
    vin: "1FMCU9G60MUA12345",
    licensePlate: "DEF-4567",
    drivers: [
      {
        name: "Sarah Williams",
        licenseNumber: "DL-789123456",
        relationship: "Policyholder"
      },
      {
        name: "David Williams",
        licenseNumber: "DL-654321987",
        relationship: "Spouse"
      },
      {
        name: "Emma Williams",
        licenseNumber: "DL-321654987",
        relationship: "Child"
      }
    ]
  }
];

// Causes of loss options
const causesOfLoss = [
  "Collision with another vehicle",
  "Collision with object",
  "Vandalism",
  "Theft",
  "Fire",
  "Flood",
  "Hail",
  "Animal collision",
  "Falling object",
  "Other"
];

// Relationship options
const relationshipOptions = [
  "Policyholder",
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Friend",
  "Other"
];

const NewClaim = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPolicyLookup, setShowPolicyLookup] = useState(true);
  const [searchResults, setSearchResults] = useState<typeof mockPolicies>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<typeof mockPolicies[0] | null>(null);
  const [activeSection, setActiveSection] = useState("policySearch");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [useMobileView, setUseMobileView] = useState(window.innerWidth < 768);

  // Refs for scrolling to sections
  const sectionRefs = {
    policySearch: useRef<HTMLDivElement>(null),
    accidentDetails: useRef<HTMLDivElement>(null), // Changed from lossDetails
    insuredVehicle: useRef<HTMLDivElement>(null),
    driver: useRef<HTMLDivElement>(null),
    otherVehicles: useRef<HTMLDivElement>(null),
    involvement: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs[sectionId as keyof typeof sectionRefs]?.current;
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };
  
  const form = useForm({
    defaultValues: {
      // Policy Info
      policyNumber: selectedPolicy?.id || "",
      customerName: selectedPolicy?.customerName || "",
      
      // Accident Details (changed from Loss Details)
      accidentDate: new Date(), // Changed from lossDate
      causeOfAccident: "", // Changed from causeOfLoss
      accidentDescription: "", // Changed from lossDescription
      accidentLocation: "", // Changed from lossLocation
      
      // Insured Vehicle
      vehicleMake: selectedPolicy?.vehicleMake || "",
      vehicleModel: selectedPolicy?.vehicleModel || "",
      vehicleYear: selectedPolicy?.vehicleYear || "",
      vin: selectedPolicy?.vin || "",
      licensePlate: selectedPolicy?.licensePlate || "",
      damageDescription: "",
      
      // Driver
      driverName: selectedPolicy?.drivers?.[0]?.name || "",
      driverLicenseNumber: selectedPolicy?.drivers?.[0]?.licenseNumber || "",
      driverRelationship: selectedPolicy?.drivers?.[0]?.relationship || "",
      
      // Other Vehicles
      otherVehicleInvolved: false,
      otherVehicleMake: "",
      otherVehicleModel: "",
      otherVehicleYear: "",
      otherVehicleLicensePlate: "",
      otherDriverName: "",
      otherDriverLicenseNumber: "",
      otherDriverInsurance: "",
      otherDriverPolicyNumber: "",
      
      // Involvement
      policeReport: false,
      policeReportNumber: "",
      injuries: false,
      injuryDescription: "",
      witnesses: false,
      witnessDetails: "",
    },
  });

  // Form for policy lookup
  const policyLookupForm = useForm({
    defaultValues: {
      searchTerm: "",
    },
  });

  // Handle policy search
  const handlePolicySearch = (data: { searchTerm: string }) => {
    // In a real app, this would be an API call
    const results = mockPolicies.filter(policy => 
      policy.id.toLowerCase().includes(data.searchTerm.toLowerCase()) ||
      policy.customerName.toLowerCase().includes(data.searchTerm.toLowerCase()) ||
      policy.licensePlate.toLowerCase().includes(data.searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
    
    if (results.length === 0) {
      toast({
        title: "No policies found",
        description: "Try a different search term or create a new policy.",
        variant: "destructive",
      });
    }
  };

  const selectPolicy = (policy: typeof mockPolicies[0]) => {
    setSelectedPolicy(policy);
    
    // Set form values based on selected policy
    form.setValue("policyNumber", policy.id);
    form.setValue("customerName", policy.customerName);
    form.setValue("vehicleMake", policy.vehicleMake);
    form.setValue("vehicleModel", policy.vehicleModel);
    form.setValue("vehicleYear", policy.vehicleYear);
    form.setValue("vin", policy.vin);
    form.setValue("licensePlate", policy.licensePlate);
    
    // If there are drivers, set the first one as default
    if (policy.drivers && policy.drivers.length > 0) {
      form.setValue("driverName", policy.drivers[0].name);
      form.setValue("driverLicenseNumber", policy.drivers[0].licenseNumber);
      form.setValue("driverRelationship", policy.drivers[0].relationship);
    }
    
    setShowPolicyLookup(false);
    
    // Add a slight delay to ensure the component has rendered
    setTimeout(()=> {
      scrollToSection('accidentDetails'); // Changed from lossDetails
    }, 100);
  };

  const onSubmit = (data: any) => {
    setShowConfirmDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const handleConfirmSubmit = () => {
    toast({
      title: "Claim submitted successfully",
      description: "Claim has been created with ID: CLM-4232",
    });
    navigate("/claims");
  };

  // Render policy lookup view
  if (showPolicyLookup) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">New Claim</h2>
            <p className="text-muted-foreground">
              Search for a policy to start a new claim
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Policy Lookup</CardTitle>
            <CardDescription>
              Enter a policy number, customer name, or license plate to find a policy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={policyLookupForm.handleSubmit(handlePolicySearch)}
              className="flex w-full max-w-sm items-center space-x-2"
            >
              <Input 
                placeholder="Search policies..." 
                {...policyLookupForm.register("searchTerm")}
              />
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>

            {searchResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Search Results</h3>
                <div className="space-y-4">
                  {searchResults.map((policy) => (
                    <Card key={policy.id} className="cursor-pointer hover:bg-muted/50" onClick={() => selectPolicy(policy)}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Policy Number</p>
                            <p className="text-sm font-medium">{policy.id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Customer</p>
                            <p className="text-sm font-medium">{policy.customerName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Vehicle</p>
                            <p className="text-sm font-medium">{policy.vehicleYear} {policy.vehicleMake} {policy.vehicleModel}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">License Plate</p>
                            <p className="text-sm font-medium">{policy.licensePlate}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-2 border-b">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => setShowPolicyLookup(true)}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Policy Search
          </Button>
          <div>
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">New Claim</h2>
            <p className="text-sm text-muted-foreground">
              {selectedPolicy?.customerName} - {selectedPolicy?.id}
            </p>
          </div>
        </div>
        
        {/* Navigation Menu */}
        {!useMobileView ? (
          <div className="hidden md:flex space-x-2">
            <Button 
              variant={activeSection === 'accidentDetails' ? 'default' : 'outline'} // Changed from lossDetails
              size="sm" 
              onClick={() => scrollToSection('accidentDetails')} // Changed from lossDetails
            >
              <Info className="mr-1 h-4 w-4" /> Accident Details {/* Changed from Loss Details */}
            </Button>
            <Button 
              variant={activeSection === 'insuredVehicle' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => scrollToSection('insuredVehicle')}
            >
              <Car className="mr-1 h-4 w-4" /> Vehicle
            </Button>
            <Button 
              variant={activeSection === 'driver' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => scrollToSection('driver')}
            >
              <Users className="mr-1 h-4 w-4" /> Driver
            </Button>
            <Button 
              variant={activeSection === 'otherVehicles' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => scrollToSection('otherVehicles')}
            >
              <Car className="mr-1 h-4 w-4" /> Other Vehicles
            </Button>
            <Button 
              variant={activeSection === 'involvement' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => scrollToSection('involvement')}
            >
              <FileText className="mr-1 h-4 w-4" /> Involvement
            </Button>
          </div>
        ) : (
          <Select onValueChange={(value) => scrollToSection(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Navigate to section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accidentDetails">Accident Details</SelectItem> {/* Changed from lossDetails */}
              <SelectItem value="insuredVehicle">Vehicle</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="otherVehicles">Other Vehicles</SelectItem>
              <SelectItem value="involvement">Involvement</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Accident Details Section (changed from Loss Details) */}
          <Card id="accident-details" ref={sectionRefs.accidentDetails}> {/* Changed from loss-details and lossDetails */}
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5" /> Accident Details {/* Changed from Loss Details */}
              </CardTitle>
              <CardDescription>
                Provide details about when and how the accident occurred {/* Changed text */}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="accidentDate" // Changed from lossDate
                  rules={{ required: "Date of Accident is required" }} // Changed text
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Accident *</FormLabel> {/* Changed from Date of Loss */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="causeOfAccident" // Changed from causeOfLoss
                  rules={{ required: "Cause of Accident is required" }} // Changed text
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cause of Accident *</FormLabel> {/* Changed from Cause of Loss */}
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cause of accident" /> {/* Changed text */}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {causesOfLoss.map((cause) => (
                            <SelectItem key={cause} value={cause.toLowerCase()}>{cause}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="accidentLocation" // Changed from lossLocation
                rules={{ required: "Accident Location is required" }} // Changed text
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accident Location *</FormLabel> {/* Changed from Loss Location */}
                    <FormControl>
                      <Input placeholder="Street address where the accident occurred" {...field} /> {/* Changed text */}
                    </FormControl>
                    <FormDescription>
                      Enter the address where the accident occurred {/* Changed text */}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accidentDescription" // Changed from lossDescription
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe in detail how the accident occurred"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe in detail how the accident occurred to include how and where it happened. Example: Insured Vehicle was rear ended by other vehicle near Exit 125.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Map would go here in a real implementation */}
              <div className="border rounded-md p-4 bg-muted/30 flex flex-col items-center justify-center h-[200px]">
                <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Map location would be displayed here</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <MapPin className="mr-2 h-4 w-4" />
                  Pinpoint Location
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Insured Vehicle Section */}
          <Card id="insured-vehicle" ref={sectionRefs.insuredVehicle}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="mr-2 h-5 w-5" /> Insured Vehicle
              </CardTitle>
              <CardDescription>
                Confirm the details of the insured vehicle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="vehicleMake"
                  rules={{ required: "Vehicle make is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleModel"
                  rules={{ required: "Vehicle model is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleYear"
                  rules={{ required: "Vehicle year is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="vin"
                  rules={{ required: "VIN is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licensePlate"
                  rules={{ required: "License plate is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Plate *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="damageDescription"
                rules={{ required: "Damage description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Damage Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the damage to the insured vehicle"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label className="mb-2 block">Upload Photos of Damage</Label>
                <div className="flex items-center gap-2">
                  <Label 
                    htmlFor="picture" 
                    className="cursor-pointer flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-muted"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Photos</span>
                    <Input 
                      id="picture" 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Uploaded Files:</p>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between border rounded-md p-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Driver Section */}
          <Card id="driver" ref={sectionRefs.driver}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" /> Driver Information
              </CardTitle>
              <CardDescription>
                Provide details about who was driving the insured vehicle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="driverName"
                  rules={{ required: "Driver name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="driverRelationship"
                  rules={{ required: "Relationship to policyholder is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Policyholder *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relationshipOptions.map((relationship) => (
                            <SelectItem key={relationship} value={relationship.toLowerCase()}>{relationship}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="driverLicenseNumber"
                rules={{ required: "Driver license number is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver License Number *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Other Vehicles Section */}
          <Card id="other-vehicles" ref={sectionRefs.otherVehicles}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="mr-2 h-5 w-5" /> Other Vehicles
              </CardTitle>
              <CardDescription>
                Provide details about other vehicles involved in the accident
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="otherVehicleInvolved"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Were other vehicles involved in the accident?
                      </FormLabel>
                      <FormDescription>
                        Check this box if other vehicles were involved in the accident
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("otherVehicleInvolved") && (
                <div className="space-y-4 border-l-2 pl-4 mt-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="otherVehicleMake"
                      rules={{ required: form.watch("otherVehicleInvolved") ? "Vehicle make is required" : false }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Make *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="otherVehicleModel"
                      rules={{ required: form.watch("otherVehicleInvolved") ? "Vehicle model is required" : false }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="otherVehicleYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="otherVehicleLicensePlate"
                      rules={{ required: form.watch("otherVehicleInvolved") ? "License plate is required" : false }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Plate *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="otherDriverName"
                      rules={{ required: form.watch("otherVehicleInvolved") ? "Driver name is required" : false }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="otherDriverLicenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver License Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="otherDriverInsurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Company</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="otherDriverPolicyNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Policy Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Involvement Section */}
          <Card id="involvement" ref={sectionRefs.involvement}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" /> Additional Information
              </CardTitle>
              <CardDescription>
                Provide additional details about the accident
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="policeReport"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Was a police report filed?
                      </FormLabel>
                      <FormDescription>
                        Check this box if a police report was filed for the accident
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("policeReport") && (
                <FormField
                  control={form.control}
                  name="policeReportNumber"
                  rules={{ required: form.watch("policeReport") ? "Police report number is required" : false }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Police Report Number *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="injuries"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Were there any injuries?
                      </FormLabel>
                      <FormDescription>
                        Check this box if anyone was injured in the accident
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("injuries") && (
                <FormField
                  control={form.control}
                  name="injuryDescription"
                  rules={{ required: form.watch("injuries") ? "Injury description is required" : false }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Injury Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the injuries and who was injured"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="witnesses"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Were there any witnesses?
                      </FormLabel>
                      <FormDescription>
                        Check this box if there were witnesses to the accident
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("witnesses") && (
                <FormField
                  control={form.control}
                  name="witnessDetails"
                  rules={{ required: form.watch("witnesses") ? "Witness details are required" : false }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Witness Details *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide names and contact information for witnesses"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowPolicyLookup(true)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Check className="mr-2 h-4 w-4" />
              Submit Claim
            </Button>
          </div>
        </form>
      </Form>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Claim</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this claim? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Submit Claim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewClaim;
