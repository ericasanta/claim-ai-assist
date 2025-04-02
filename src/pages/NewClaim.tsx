
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
import { ArrowLeftIcon, CalendarIcon, FileUp, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const NewClaim = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const form = useForm({
    defaultValues: {
      policyNumber: "",
      customerName: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      accidentDate: new Date(),
      accidentDescription: "",
      claimType: "",
      incidentLocation: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    console.log("Uploaded files:", files);
    
    // Show confirmation dialog
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
                        <Input placeholder="e.g. POL-12345" {...field} />
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
                        <Input placeholder="Full name" {...field} />
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
