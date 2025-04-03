
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeftIcon, ArrowRight, Plus, Trash2 } from "lucide-react";

// Import custom components
import DamageImageView from "@/components/analysis/DamageImageView";
import SeverityLegend from "@/components/analysis/SeverityLegend";
import AssessmentDetails from "@/components/analysis/AssessmentDetails";
import VehicleInfo from "@/components/analysis/VehicleInfo";
import DamageTable from "@/components/analysis/DamageTable";
import AnalysisSummary from "@/components/analysis/AnalysisSummary";
import AIConfidenceCard from "@/components/analysis/AIConfidenceCard";
import DamagePopover from "@/components/analysis/DamagePopover";

const damageImages = [
  {
    id: 1,
    url: "/lovable-uploads/90dbf0ce-98c7-4f78-b80a-8279dcc61459.png",
    title: "Toyota Prius Front View",
  },
];

const initialDamageAssessments = [
  {
    id: 1,
    imageId: 1,
    type: "Front Bumper Damage",
    severity: "high",
    position: { x: 65, y: 58, width: 22, height: 13 },
    notes: "Severe damage to front bumper requiring replacement",
    estimatedCost: 950,
    partConfidence: 0.98,
    damageConfidence: 0.87,
    isManual: false,
  },
  {
    id: 2,
    imageId: 1,
    type: "Headlight Damage",
    severity: "medium",
    position: { x: 80, y: 48, width: 10, height: 10 },
    notes: "Right headlight cracked",
    estimatedCost: 450,
    partConfidence: 0.95,
    damageConfidence: 0.82,
    isManual: false,
  },
  {
    id: 3,
    imageId: 1,
    type: "Front Door Damage",
    severity: "low",
    position: { x: 35, y: 40, width: 20, height: 25 },
    notes: "Minor dent and scratches",
    estimatedCost: 350,
    partConfidence: 0.92,
    damageConfidence: 0.68,
    isManual: false,
  },
  {
    id: 4,
    imageId: 1,
    type: "Wheel Damage",
    severity: "low",
    position: { x: 15, y: 68, width: 15, height: 15 },
    notes: "Wheel rim scratched",
    estimatedCost: 250,
    partConfidence: 0.97,
    damageConfidence: 0.58,
    isManual: false,
  },
];

const vehicleInfo = {
  make: "Toyota",
  model: "Prius",
  year: "2023",
  color: "Green",
  view: "Front Right",
  category: "Carheal X"
};

const severityLegend = [
  { label: "Low Severity", class: "ai-bounding-box-low" },
  { label: "Medium Severity", class: "ai-bounding-box-medium" },
  { label: "High Severity", class: "ai-bounding-box-high" },
  { label: "Manual Entry", class: "ai-bounding-box-manual" },
];

const Analysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeImageId, setActiveImageId] = useState(damageImages[0].id);
  const [damageAssessments, setDamageAssessments] = useState(initialDamageAssessments);
  const [selectedDamage, setSelectedDamage] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newBoxPosition, setNewBoxPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [editingVehicleInfo, setEditingVehicleInfo] = useState(false);
  const [vehicleData, setVehicleData] = useState(vehicleInfo);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // New states for manual entry
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const currentImageAssessments = damageAssessments.filter(
    (assessment) => assessment.imageId === activeImageId
  );

  const handleBoxClick = (id: number) => {
    if (isAddingNew) return;
    setSelectedDamage(id === selectedDamage ? null : id);
  };

  const handleEditAssessment = (assessment: any) => {
    setEditingAssessment({ ...assessment });
    setIsEditing(true);
  };

  const saveAssessmentChanges = () => {
    if (editingAssessment) {
      setDamageAssessments((prev) =>
        prev.map((item) =>
          item.id === editingAssessment.id ? { ...editingAssessment } : item
        )
      );
      toast({
        title: "Assessment Updated",
        description: `${editingAssessment.type} assessment has been updated.`,
      });
    }
    setIsEditing(false);
    setEditingAssessment(null);
  };

  const handleDeleteAssessment = () => {
    if (selectedDamage) {
      setShowDeleteDialog(true);
    }
  };

  const confirmDelete = () => {
    setDamageAssessments((prev) =>
      prev.filter((item) => item.id !== selectedDamage)
    );
    setSelectedDamage(null);
    setShowDeleteDialog(false);
    toast({
      title: "Assessment Deleted",
      description: "The damage assessment has been removed.",
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingNew || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setDragStart({ x, y });
    setNewBoxPosition({ x, y, width: 0, height: 0 });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setNewBoxPosition({
      x: Math.min(dragStart.x, x),
      y: Math.min(dragStart.y, y),
      width: Math.abs(x - dragStart.x),
      height: Math.abs(y - dragStart.y),
    });
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      if (newBoxPosition.width > 5 && newBoxPosition.height > 5) {
        const newAssessment = {
          id: Date.now(),
          imageId: activeImageId,
          type: "New Damage",
          severity: "medium",
          position: newBoxPosition,
          notes: "",
          estimatedCost: 0,
          partConfidence: 0.90,
          damageConfidence: 0.75,
          isManual: false,
        };
        
        setDamageAssessments((prev) => [...prev, newAssessment]);
        setSelectedDamage(newAssessment.id);
        setEditingAssessment(newAssessment);
        setIsEditing(true);
        
        toast({
          title: "New Assessment Added",
          description: "Please fill in the details for the new damage.",
        });
      }
      
      setIsDrawing(false);
      setIsAddingNew(false);
    }
  };

  // Handle double-click to add manual damage
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAddingNew || isDrawing) return;
    
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPopoverPosition({ x, y });
    setShowPopover(true);
  };

  // Save manually added damage
  const saveManualDamage = (damageData: any) => {
    const newManualDamage = {
      id: Date.now(),
      imageId: activeImageId,
      type: damageData.type,
      severity: damageData.severity,
      position: { 
        x: Math.max(0, popoverPosition.x - 5),
        y: Math.max(0, popoverPosition.y - 5),
        width: 10,
        height: 10
      },
      notes: damageData.notes,
      estimatedCost: damageData.estimatedCost,
      partConfidence: 1,
      damageConfidence: 1,
      isManual: true,
    };
    
    setDamageAssessments((prev) => [...prev, newManualDamage]);
    setSelectedDamage(newManualDamage.id);
    setShowPopover(false);
    
    toast({
      title: "Manual Damage Added",
      description: `${damageData.type} has been added to the analysis.`,
    });
  };

  const handleFinishAnalysis = () => {
    setShowConfirmDialog(true);
  };

  const saveVehicleInfo = () => {
    setEditingVehicleInfo(false);
    toast({
      title: "Vehicle Information Updated",
      description: "Vehicle details have been saved successfully.",
    });
  };

  const proceedToEstimates = () => {
    const totalCost = damageAssessments.reduce((sum, item) => sum + item.estimatedCost, 0);
    
    const claims = JSON.parse(localStorage.getItem('claims') || '[]');
    const updatedClaims = claims.map((claim: any) => {
      if (claim.id === "CLM-1694") {
        return {
          ...claim,
          hasAiAnalysis: true,
          aiDamageCount: damageAssessments.length,
          aiEstimate: `$${totalCost.toFixed(2)}`,
          status: "under-review"
        };
      }
      return claim;
    });
    localStorage.setItem('claims', JSON.stringify(updatedClaims));
    
    const dashboardTasks = JSON.parse(localStorage.getItem('dashboardTasks') || '[]');
    const filteredTasks = dashboardTasks.filter((task: any) => 
      !(task.type === "aiAnalysis" && task.claimId === "CLM-1694")
    );
    localStorage.setItem('dashboardTasks', JSON.stringify(filteredTasks));
    
    const newEstimationTask = {
      id: `TSK-${Math.floor(Math.random() * 10000)}`,
      description: "Review AI-generated estimate for claim CLM-1694",
      dueIn: "Today",
      priority: "high",
      type: "estimate",
      claimId: "CLM-1694"
    };
    localStorage.setItem('dashboardTasks', JSON.stringify([...filteredTasks, newEstimationTask]));
    
    toast({
      title: "Analysis Completed",
      description: `AI damage analysis completed with ${damageAssessments.length} identified issues.`,
    });
    
    navigate("/estimates");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
            <h2 className="text-3xl font-bold tracking-tight">AI Damage Analysis</h2>
            <p className="text-muted-foreground">
              Claim #CLM-1694 | Vehicle Insurance Claim
            </p>
          </div>
        </div>
        <Button onClick={handleFinishAnalysis}>
          Complete Analysis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Vehicle Damage Analysis</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsAddingNew(true)}
                    disabled={isAddingNew || isEditing}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Assessment
                  </Button>
                  {selectedDamage && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleDeleteAssessment}
                      disabled={isAddingNew || isEditing}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
              <CardDescription>
                AI-detected damage with severity indicators (double-click to add manual entries)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Popover open={showPopover} onOpenChange={setShowPopover}>
                <PopoverTrigger className="hidden">Open</PopoverTrigger>
                <div className="relative">
                  <DamageImageView 
                    imageUrl={damageImages.find((img) => img.id === activeImageId)?.url || ""}
                    imageAlt="Vehicle Damage"
                    isAddingNew={isAddingNew}
                    isDrawing={isDrawing}
                    currentImageAssessments={currentImageAssessments}
                    selectedDamage={selectedDamage}
                    newBoxPosition={newBoxPosition}
                    handleBoxClick={handleBoxClick}
                    handleMouseDown={handleMouseDown}
                    handleMouseMove={handleMouseMove}
                    handleMouseUp={handleMouseUp}
                    handleDoubleClick={handleDoubleClick}
                  />
                  
                  <PopoverContent 
                    className="w-auto p-0" 
                    style={{ 
                      position: 'absolute',
                      left: `${popoverPosition.x}%`,
                      top: `${popoverPosition.y}%`,
                    }}
                  >
                    <DamagePopover 
                      onSave={saveManualDamage}
                      onCancel={() => setShowPopover(false)}
                    />
                  </PopoverContent>
                </div>
              </Popover>
              
              <SeverityLegend items={severityLegend} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Damage Analysis</CardTitle>
              <CardDescription>
                Vehicle information and parts damage analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <VehicleInfo 
                vehicleData={vehicleData}
                editingVehicleInfo={editingVehicleInfo}
                setEditingVehicleInfo={setEditingVehicleInfo}
                setVehicleData={setVehicleData}
                saveVehicleInfo={saveVehicleInfo}
              />

              <DamageTable 
                damages={damageAssessments}
                selectedDamage={selectedDamage}
                setSelectedDamage={setSelectedDamage}
              />
            </CardContent>
          </Card>

          <AIConfidenceCard currentImageAssessments={currentImageAssessments} />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Details</CardTitle>
              <CardDescription>
                {selectedDamage 
                  ? "View and edit selected damage assessment" 
                  : "Select a damage area to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssessmentDetails 
                selectedDamage={selectedDamage}
                isEditing={isEditing}
                editingAssessment={editingAssessment}
                damageAssessments={damageAssessments}
                handleEditAssessment={handleEditAssessment}
                saveAssessmentChanges={saveAssessmentChanges}
                setIsEditing={setIsEditing}
                setEditingAssessment={setEditingAssessment}
              />
            </CardContent>
          </Card>

          <AnalysisSummary 
            damageAssessments={damageAssessments}
            handleFinishAnalysis={handleFinishAnalysis}
          />
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this damage assessment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Analysis</AlertDialogTitle>
            <AlertDialogDescription>
              You have completed the AI-assisted damage analysis. The system will now generate a detailed estimate based on your analysis. Proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={proceedToEstimates}>
              Generate Estimate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Analysis;
