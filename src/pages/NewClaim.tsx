import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  FileUp, 
  Upload, 
  Search, 
  Plus, 
  Car, 
  Map, 
  User, 
  FileText, 
  Users, 
  Camera, 
  Trash2, 
  MapPin,
  Info,
  Clipboard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// Sample policy and vehicle data
const mockPolicies = [
  { 
    id: "POL-12345", 
    customerName: "John Smith", 
    vehicleMake: "Toyota", 
    vehicleModel: "Camry", 
    vehicleYear: "2020",
    policyType: "Full Coverage",
    policyStatus: "Active",
    effectiveDate: "2023-01-01",
    expirationDate: "2024-01-01",
    address: "123 Main St, Anytown, CA 12345",
    phone: "(555) 123-4567",
    email: "john.smith@example.com",
    licensePlate: "ABC123",
    vin: "1HGCM82633A123456",
    drivers: [
      {
        name: "John Smith",
        licenseNumber: "S12345678",
        relationship: "Self",
      },
      {
        name: "Jane Smith",
        licenseNumber: "S87654321",
        relationship: "Spouse",
      }
    ]
  },
  { 
    id: "POL-67890", 
    customerName: "Jane Doe", 
    vehicleMake: "Honda", 
    vehicleModel: "Civic", 
    vehicleYear: "2021",
    policyType: "Liability Only",
    policyStatus: "Active",
    effectiveDate: "2023-03-15",
    expirationDate: "2024-03-15",
    address: "456 Oak Ave, Somewhere, CA 54321",
    phone: "(555) 987-6543",
    email: "jane.doe@example.com",
    licensePlate: "XYZ789",
    vin: "2T1KR32E13C123456",
    drivers: [
      {
        name: "Jane Doe",
        licenseNumber: "D12345678",
        relationship: "Self",
      }
    ]
  },
  { 
    id: "POL-24680", 
    customerName: "Robert Johnson", 
    vehicleMake: "Ford", 
    vehicleModel: "Explorer", 
    vehicleYear: "2019",
    policyType: "Full Coverage",
    policyStatus: "Active",
    effectiveDate: "2022-11-10",
    expirationDate: "2023-11-10",
    address: "789 Pine St, Elsewhere, CA 67890",
    phone: "(555) 456-7890",
    email: "robert.johnson@example.com",
    licensePlate: "LMN456",
    vin: "1FTEW1E53MFA12345",
    drivers: [
      {
        name: "Robert Johnson",
        licenseNumber: "J12345678",
        relationship: "Self",
      },
      {
        name: "Mary Johnson",
        licenseNumber: "J87654321",
        relationship: "Spouse",
      },
      {
        name: "Tom Johnson",
        licenseNumber: "J23456789",
        relationship: "Child",
      }
    ]
  }
];

// Mock damage photo examples
const mockDamagePhotos = [
  "/lovable-uploads/ae1dd59a-67d6-4a61-ac33-f3b07c93d7d3.png",
  "/lovable-uploads/13093a36-1dc3-4c11-b2d2-eeb1f28d7501.png",
  "/lovable-uploads/6032c237-e9ea-4b79-8169-aa8647f17979.png"
];

// Causes of loss options
const causesOfLoss = [
  "Accident", 
  "Theft", 
  "Vandalism", 
  "Fire", 
  "Flood", 
  "Hail", 
  "Animal impact", 
  "Falling object",
  "Other"
];

// US States for dropdowns
const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", 
  "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
  "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// Relationship options
const relationshipOptions = [
  "Self", "Spouse", "Child", "Parent", "Sibling", "Friend", "Other"
];

const NewClaim = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPolicyLookup, setShowPolicyLookup] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<typeof mockPolicies[0] | null>(null);
  const [policySearchQuery, setPolicySearchQuery] = useState("");
  const [filteredPolicies, setFilteredPolicies] = useState(mockPolicies);
  const [activeSection, setActiveSection] = useState("policy-search");
  const [isVehicleOperated, setIsVehicleOperated] = useState<boolean | null>(null);
  const [selectedDriverIndex, setSelectedDriverIndex] = useState(0);
  const [otherVehicles, setOtherVehicles] = useState<Array<any>>([]);
  const [numOtherVehicles, setNumOtherVehicles] = useState(0);
  const [witnessesPresent, setWitnessesPresent] = useState<boolean | null>(null);
  const [pedestriansInjured, setPedestriansInjured] = useState<boolean | null>(null);
  const [propertyDamage, setPropertyDamage] = useState<boolean | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  
  // Refs for scrolling to sections
  const sectionRefs = {
    policySearch: useRef<HTMLDivElement>(null),
    lossDetails: useRef<HTMLDivElement>(null),
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
      
      // Loss Details
      lossDate: new Date(),
      causeOfLoss: "",
      lossDescription: "",
      lossLocation: "",
      
      // Insured Vehicle
      vehicleMake: selectedPolicy?.vehicleMake || "",
      vehicleModel: selectedPolicy?.vehicleModel || "",
      vehicleYear: selectedPolicy?.vehicleYear || "",
      vin: selectedPolicy?.vin || "",
      licensePlate: selectedPolicy?.licensePlate || "",
      licenseState: "California",
      damageDescription: "",
      
      // Driver
      driverName: "",
      driverLicenseNumber: "",
      driverRelationship: "",
      driverPermission: "",
      driverAddress: "",
      driverCity: "",
      driverState: "",
      driverZip: "",
      driverPhone: "",
      
      // Add other fields as needed
    },
  });

  const policyLookupForm = useForm({
    defaultValues: {
      policyNumberSearch: "",
      customerNameSearch: "",
      licensePlateSearch: "",
    }
  });

  const handlePolicySearch = (data: any) => {
    const policyQuery = data.policyNumberSearch.toLowerCase();
    const nameQuery = data.customerNameSearch.toLowerCase();
    const plateQuery = data.licensePlateSearch.toLowerCase();
    
    // If all fields are empty, show all policies
    if (!policyQuery && !nameQuery && !plateQuery) {
      setFilteredPolicies(mockPolicies);
      return;
    }
    
    const filtered = mockPolicies.filter(policy => 
      (policyQuery && policy.id.toLowerCase().includes(policyQuery)) || 
      (nameQuery && policy.customerName.toLowerCase().includes(nameQuery)) ||
      (plateQuery && policy.licensePlate.toLowerCase().includes(plateQuery))
    );
    
    setFilteredPolicies(filtered);
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
      scrollToSection('lossDetails');
    }, 100);
  };

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    console.log("Uploaded files:", files);
    console.log("Other vehicles:", otherVehicles);
    console.log("Vehicle operated:", isVehicleOperated);
    console.log("Selected driver:", selectedDriverIndex);
    console.log("Number of other vehicles:", numOtherVehicles);
    console.log("Witnesses present:", witnessesPresent);
    console.log("Pedestrians injured:", pedestriansInjured);
    console.log("Property damage:", propertyDamage);
    
    setShowConfirmDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);

      // Add mock preview images
      if (previewImages.length < 3) {
        const newPreviews = [...previewImages];
        for (let i = 0; i < Math.min(3 - previewImages.length, selectedFiles.length); i++) {
          newPreviews.push(mockDamagePhotos[i]);
        }
        setPreviewImages(newPreviews);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const confirmClaim = () => {
    toast({
      title: "Claim Created Successfully",
      description: `Claim has been submitted with ${files.length} documents.`,
    });
    navigate("/analysis");
  };

  const addOtherVehicle = () => {
    setOtherVehicles([...otherVehicles, {
      licensePlate: "",
      licenseState: "",
      damageDescription: "",
      driverOperating: null,
      driverName: "",
      driverPhone: "",
      driverLicense: "",
      address: "",
      city: "",
      state: "",
      zip: ""
    }]);
  };

  const removeOtherVehicle = (index: number) => {
    setOtherVehicles(otherVehicles.filter((_, i) => i !== index));
  };

  const useMobileView = window.innerWidth < 640;

  if (showPolicyLookup) {
    return (
      <div className="space-y-6" ref={sectionRefs.policySearch}>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">New Claim</h2>
            <p className="text-muted-foreground">
              Find your policy to create a new insurance claim
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Policy Search</CardTitle>
            <CardDescription>
              Search for a policy by policy number, customer name, or license plate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...policyLookupForm}>
              <form onSubmit={policyLookupForm.handleSubmit(handlePolicySearch)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={policyLookupForm.control}
                    name="policyNumberSearch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. POL-12345" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={policyLookupForm.control}
                    name="customerNameSearch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. John Smith" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={policyLookupForm.control}
                    name="licensePlateSearch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Plate</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. ABC123" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Find My Policy
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Search Results</h3>
              {filteredPolicies.length === 0 ? (
                <div className="text-center p-6 border rounded-md">
                  <p className="text-muted-foreground">No policies found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPolicies.map((policy) => (
                    <Card key={policy.id} className="hover:bg-accent transition-colors cursor-pointer" onClick={() => selectPolicy(policy)}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{policy.customerName}</p>
                            <p className="text-sm text-muted-foreground">{policy.id} • {policy.policyType}</p>
                            <div className="mt-1 text-sm">
                              <p>{policy.vehicleYear} {policy.vehicleMake} {policy.vehicleModel}</p>
                              <p className="text-xs text-muted-foreground">License Plate: {policy.licensePlate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              {policy.policyStatus}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">Exp: {policy.expirationDate}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
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
              variant={activeSection === 'lossDetails' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => scrollToSection('lossDetails')}
            >
              <Info className="mr-1 h-4 w-4" /> Loss Details
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
              <User className="mr-1 h-4 w-4" /> Driver
            </Button>
            <Button 
              variant={activeSection === 'otherVehicles' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => scrollToSection('otherVehicles')}
            >
              <Users className="mr-1 h-4 w-4" /> Other Vehicles
            </Button>
            <Button 
              variant={activeSection === 'involvement' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => scrollToSection('involvement')}
            >
              <Clipboard className="mr-1 h-4 w-4" /> Involvement
            </Button>
          </div>
        ) : (
          <Select onValueChange={(value) => scrollToSection(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Navigate to section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lossDetails">Loss Details</SelectItem>
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
          {/* Loss Details Section */}
          <Card id="loss-details" ref={sectionRefs.lossDetails}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5" /> Loss Details
              </CardTitle>
              <CardDescription>
                Provide details about when and how the loss occurred
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="lossDate"
                  rules={{ required: "Date of Loss is required" }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Loss *</FormLabel>
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
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="causeOfLoss"
                  rules={{ required: "Cause of Loss is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cause of Loss *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cause of loss" />
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
                name="lossLocation"
                rules={{ required: "Loss Location is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loss Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="Street address where the incident occurred" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the address where the incident occurred
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lossDescription"
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
              <div className="border rounded-md p-2">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-muted-foreground opacity-50" />
                  <span className="ml-2 text-muted-foreground">Map view would appear here</span>
                </div>
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
                Details about the insured vehicle involved in the incident
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="vehicleMake"
                  rules={{ required: "Vehicle Make is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Make</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Toyota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleModel"
                  rules={{ required: "Vehicle Model is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Camry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="vehicleYear"
                  rules={{ required: "Vehicle Year is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Year</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="licensePlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Plate Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. ABC123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="licenseState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License State</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {usStates.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
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
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN</FormLabel>
                    <FormControl>
                      <Input placeholder="Vehicle Identification Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="damageDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Damage Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the damage to your vehicle"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload photo(s) of the damages to your vehicle</Label>
                <div className="flex items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer bg-muted/30" onClick={() => document.getElementById('file-upload')?.click()}>
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Drag and drop or click to upload</p>
                    <p className="text-xs text-muted-foreground">
                      Upload photos of the vehicle damage (JPEG, PNG)
                    </p>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <FormDescription>
                  Upload clear photos showing all sides of the vehicle damage
                </FormDescription>

                {previewImages.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Uploaded Photos</Label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {previewImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Damage preview ${index + 1}`} 
                            className="w-full h-48 object-cover rounded-md"
                          />
                          <Button 
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFile(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm rounded-b-md">
                            {files[index]?.name || `Vehicle Damage ${index + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Driver Information Section */}
          <Card id="driver" ref={sectionRefs.driver}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" /> Driver Information
              </CardTitle>
              <CardDescription>
                Information about who was driving the vehicle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Was the insured vehicle being operated at the time of the loss?</Label>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      type="button" 
                      variant={isVehicleOperated === true ? "default" : "outline"}
                      className="flex-1"
