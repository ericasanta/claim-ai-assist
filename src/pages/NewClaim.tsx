import { useState } from "react";
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
import { ArrowLeftIcon, CalendarIcon, FileUp, Upload, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
    email: "john.smith@example.com"
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
    email: "jane.doe@example.com"
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
    email: "robert.johnson@example.com"
  }
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
  
  const form = useForm({
    defaultValues: {
      policyNumber: selectedPolicy?.id || "",
      customerName: selectedPolicy?.customerName || "",
      vehicleMake: selectedPolicy?.vehicleMake || "",
      vehicleModel: selectedPolicy?.vehicleModel || "",
      vehicleYear: selectedPolicy?.vehicleYear || "",
      accidentDate: new Date(),
      accidentDescription: "",
      claimType: "",
      incidentLocation: "",
    },
  });

  const policyLookupForm = useForm({
    defaultValues: {
      policyNumberSearch: "",
      customerNameSearch: "",
      phoneSearch: "",
    }
  });

  const handlePolicySearch = (data: any) => {
    const query = (data.policyNumberSearch || data.customerNameSearch || data.phoneSearch || "").toLowerCase();
    setPolicySearchQuery(query);
    
    if (!query) {
      setFilteredPolicies(mockPolicies);
      return;
    }
    
    const filtered = mockPolicies.filter(policy => 
      policy.id.toLowerCase().includes(query) || 
      policy.customerName.toLowerCase().includes(query) ||
      policy.phone.toLowerCase().includes(query)
    );
    
    setFilteredPolicies(filtered);
  };

  const selectPolicy = (policy: typeof mockPolicies[0]) => {
    setSelectedPolicy(policy);
    form.setValue("policyNumber", policy.id);
    form.setValue("customerName", policy.customerName);
    form.setValue("vehicleMake", policy.vehicleMake);
    form.setValue("vehicleModel", policy.vehicleModel);
    form.setValue("vehicleYear", policy.vehicleYear);
    setShowPolicyLookup(false);
  };

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    console.log("Uploaded files:", files);
    
    setShowConfirmDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const confirmClaim = () => {
    toast({
      title: "Claim Created Successfully",
      description: `Claim has been submitted with ${files.length} documents.`,
    });
    navigate("/analysis");
  };

  const useMobileView = window.innerWidth < 640;

  if (showPolicyLookup) {
    const PolicyLookupContent = () => (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Policy Lookup</h3>
          <p className="text-muted-foreground">
            Search for a policy to create a new claim
          </p>
        </div>

        <Form {...policyLookupForm}>
          <form onSubmit={policyLookupForm.handleSubmit(handlePolicySearch)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                name="phoneSearch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. (555) 123-4567" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Search Policies
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

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button 
            onClick={() => setShowPolicyLookup(false)}
            disabled={!selectedPolicy}
          >
            {selectedPolicy ? "Continue with Selected Policy" : "Select a Policy to Continue"}
          </Button>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
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
              Create a new insurance claim
            </p>
          </div>
        </div>

        {useMobileView ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full">Look Up Policy</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Policy Lookup</DrawerTitle>
                  <DrawerDescription>
                    Search for a policy to create a new claim
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <PolicyLookupContent />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <PolicyLookupContent />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <h2 className="text-3xl font-bold tracking-tight">New Claim</h2>
          <p className="text-muted-foreground">
            Create a new insurance claim for {selectedPolicy?.customerName || "customer"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Policy & Customer Information</CardTitle>
              <CardDescription>
                Enter the policy and customer details for this claim
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="policyNumber"
                  rules={{ required: "Policy Number is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. POL-12345" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerName"
                  rules={{ required: "Customer Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="vehicleMake"
                  rules={{ required: "Vehicle Make is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Make</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Toyota" {...field} readOnly />
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
                        <Input placeholder="e.g. Camry" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleYear"
                  rules={{ required: "Vehicle Year is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Year</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2020" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incident Information</CardTitle>
              <CardDescription>
                Provide details about the incident
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="accidentDate"
                  rules={{ required: "Accident Date is required" }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Incident</FormLabel>
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
                  name="claimType"
                  rules={{ required: "Claim Type is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Claim Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select claim type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="collision">Collision</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive</SelectItem>
                          <SelectItem value="liability">Liability</SelectItem>
                          <SelectItem value="personalInjury">Personal Injury</SelectItem>
                          <SelectItem value="uninsuredMotorist">Uninsured Motorist</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="incidentLocation"
                rules={{ required: "Incident Location is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Address where the incident occurred" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accidentDescription"
                rules={{ required: "Accident Description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what happened..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Upload photos of vehicle damage and other relevant documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="file-upload">Vehicle Damage Photos</Label>
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

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Uploaded Files</Label>
                    <div className="border rounded-md bg-background">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border-b last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <FileUp className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">{file.name}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit">Submit Claim</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Claim Submitted Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Your claim has been created and is now ready for AI analysis. Would you like to proceed to the analysis page?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => navigate("/claims")}>
              Go to Claims List
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmClaim}>
              Proceed to Analysis
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewClaim;
