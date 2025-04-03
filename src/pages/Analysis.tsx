
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
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeftIcon, ArrowRight, Check, CheckCircle, Circle, Info, MoveHorizontal, MoveVertical, Plus, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const damageImages = [
  {
    id: 1,
    url: "https://www.allstate.com/resources/Allstate/images/tools-resources/car/collision-side-impact-damage-teaser.jpg",
    title: "Side Impact Photo",
  },
  {
    id: 2,
    url: "https://images.squarespace-cdn.com/content/v1/5a5506400abd0406785519dd/1551239581044-8V67ZEYEBDMVD22NZ7OD/Paintless+Dent+Repair+on+White+BMW+Bumper",
    title: "Front Bumper Photo",
  },
  {
    id: 3,
    url: "https://cdn.carshield.com/cover-images/what-to-do-when-your-car-gets-scratched.jpg",
    title: "Scratched Door Photo",
  },
];

const initialDamageAssessments = [
  {
    id: 1,
    imageId: 1,
    type: "Dent",
    severity: "high",
    position: { x: 25, y: 50, width: 20, height: 30 },
    notes: "Deep impact dent on passenger side door",
    estimatedCost: 850,
  },
  {
    id: 2,
    imageId: 1,
    type: "Paint Scratch",
    severity: "medium",
    position: { x: 50, y: 35, width: 30, height: 15 },
    notes: "Multiple scratches requiring repaint",
    estimatedCost: 450,
  },
  {
    id: 3,
    imageId: 2,
    type: "Bumper Damage",
    severity: "medium",
    position: { x: 30, y: 40, width: 40, height: 25 },
    notes: "Bumper dent and misalignment",
    estimatedCost: 650,
  },
  {
    id: 4,
    imageId: 3,
    type: "Deep Scratch",
    severity: "low",
    position: { x: 40, y: 30, width: 25, height: 10 },
    notes: "Surface level scratches",
    estimatedCost: 250,
  },
];

const severityLegend = [
  { label: "Low Severity", class: "ai-bounding-box-low" },
  { label: "Medium Severity", class: "ai-bounding-box-medium" },
  { label: "High Severity", class: "ai-bounding-box-high" },
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
  const imageRef = useRef<HTMLImageElement>(null);

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

  const handleFinishAnalysis = () => {
    setShowConfirmDialog(true);
  };

  const proceedToEstimates = () => {
    const totalCost = damageAssessments.reduce((sum, item) => sum + item.estimatedCost, 0);
    
    const claims = JSON.parse(localStorage.getItem('claims') || '[]');
    const updatedClaims = claims.map((claim: any) => {
      if (claim.id === "CLM-2296") {
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
      !(task.type === "aiAnalysis" && task.claimId === "CLM-2296")
    );
    localStorage.setItem('dashboardTasks', JSON.stringify(filteredTasks));
    
    const newEstimationTask = {
      id: `TSK-${Math.floor(Math.random() * 10000)}`,
      description: "Review AI-generated estimate for claim CLM-2296",
      dueIn: "Today",
      priority: "high",
      type: "estimate",
      claimId: "CLM-2296"
    };
    localStorage.setItem('dashboardTasks', JSON.stringify([...filteredTasks, newEstimationTask]));
    
    toast({
      title: "Analysis Completed",
      description: `AI damage analysis completed with ${damageAssessments.length} identified issues.`,
    });
    
    navigate("/claims/CLM-2296");
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
              Claim #CLM-2296 | Vehicle Damage | Toyota Camry 2020
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
                AI-detected damage with severity indicators
              </CardDescription>

              <Tabs
                defaultValue={activeImageId.toString()}
                onValueChange={(value) => setActiveImageId(parseInt(value))}
                className="mt-4"
              >
                <TabsList className="grid w-full grid-cols-3">
                  {damageImages.map((image) => (
                    <TabsTrigger key={image.id} value={image.id.toString()}>
                      {image.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {isAddingNew && (
                <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md flex items-center text-sm">
                  <Info className="h-4 w-4 mr-2 text-yellow-500" />
                  Click and drag on the image to draw a new damage assessment area
                </div>
              )}
              
              <div 
                className="relative border rounded-md overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={damageImages.find((img) => img.id === activeImageId)?.url}
                  alt="Vehicle Damage"
                  className="w-full object-contain max-h-[500px]"
                  style={{ cursor: isAddingNew ? 'crosshair' : 'default' }}
                />
                
                {currentImageAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className={cn(
                      "ai-bounding-box",
                      `ai-bounding-box-${assessment.severity}`,
                      selectedDamage === assessment.id && "ai-bounding-box-selected"
                    )}
                    style={{
                      left: `${assessment.position.x}%`,
                      top: `${assessment.position.y}%`,
                      width: `${assessment.position.width}%`,
                      height: `${assessment.position.height}%`,
                    }}
                    onClick={() => handleBoxClick(assessment.id)}
                  >
                    {selectedDamage === assessment.id && (
                      <div className="absolute -top-6 left-0 bg-white border border-gray-200 rounded px-2 py-1 text-xs font-medium shadow-sm">
                        {assessment.type}
                      </div>
                    )}
                  </div>
                ))}
                
                {isDrawing && (
                  <div
                    className="ai-bounding-box ai-bounding-box-medium"
                    style={{
                      left: `${newBoxPosition.x}%`,
                      top: `${newBoxPosition.y}%`,
                      width: `${newBoxPosition.width}%`,
                      height: `${newBoxPosition.height}%`,
                    }}
                  ></div>
                )}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4">
                {severityLegend.map((item) => (
                  <div key={item.label} className="flex items-center">
                    <div className={`w-4 h-4 ${item.class} mr-2`}></div>
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Detection Confidence</CardTitle>
              <CardDescription>
                AI confidence levels and technical analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm p-3 bg-primary/5 rounded-md">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>
                    AI has analyzed the uploaded images with <strong>92% confidence</strong>. 
                    {currentImageAssessments.length} damage areas detected in current view.
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">AI Detection Notes:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Deep impact damage detected on passenger side door</li>
                    <li>Paint scratches requiring color matching and refinishing</li>
                    <li>Potential underlying structural damage requiring further inspection</li>
                    <li>Repair will require parts replacement and extensive labor</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
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
              {selectedDamage ? (
                isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Damage Type</label>
                      <Select
                        value={editingAssessment.type}
                        onValueChange={(value) => 
                          setEditingAssessment({ ...editingAssessment, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select damage type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Dent">Dent</SelectItem>
                            <SelectItem value="Scratch">Scratch</SelectItem>
                            <SelectItem value="Paint Scratch">Paint Scratch</SelectItem>
                            <SelectItem value="Deep Scratch">Deep Scratch</SelectItem>
                            <SelectItem value="Bumper Damage">Bumper Damage</SelectItem>
                            <SelectItem value="Glass Damage">Glass Damage</SelectItem>
                            <SelectItem value="Structural Damage">Structural Damage</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Severity</label>
                      <Select
                        value={editingAssessment.severity}
                        onValueChange={(value) => 
                          setEditingAssessment({ ...editingAssessment, severity: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Notes</label>
                      <textarea
                        className="w-full mt-1 p-2 border rounded-md text-sm"
                        rows={3}
                        value={editingAssessment.notes}
                        onChange={(e) => 
                          setEditingAssessment({ 
                            ...editingAssessment, 
                            notes: e.target.value 
                          })
                        }
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Estimated Cost ($)</label>
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border rounded-md text-sm"
                        value={editingAssessment.estimatedCost}
                        onChange={(e) => 
                          setEditingAssessment({ 
                            ...editingAssessment, 
                            estimatedCost: parseFloat(e.target.value) 
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setIsEditing(false);
                          setEditingAssessment(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={saveAssessmentChanges}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(() => {
                      const assessment = damageAssessments.find(
                        (item) => item.id === selectedDamage
                      );
                      
                      if (!assessment) return null;
                      
                      return (
                        <>
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{assessment.type}</h3>
                              <Badge className={`ai-bounding-box-${assessment.severity} text-black border-0`}>
                                {assessment.severity.charAt(0).toUpperCase() + assessment.severity.slice(1)} Severity
                              </Badge>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditAssessment(assessment)}
                            >
                              Edit
                            </Button>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium">Notes:</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {assessment.notes || "No notes provided."}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium">Estimated Repair Cost:</h4>
                            <p className="text-lg font-semibold text-primary">
                              ${assessment.estimatedCost.toFixed(2)}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium">Position on Image:</h4>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <div className="flex items-center text-sm">
                                <MoveHorizontal className="h-4 w-4 mr-1 text-muted-foreground" />
                                {assessment.position.x.toFixed(1)}% x {assessment.position.width.toFixed(1)}%
                              </div>
                              <div className="flex items-center text-sm">
                                <MoveVertical className="h-4 w-4 mr-1 text-muted-foreground" />
                                {assessment.position.y.toFixed(1)}% x {assessment.position.height.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Circle className="h-12 w-12 text-muted-foreground/20 mb-2" />
                  <p className="text-muted-foreground">
                    Select a damage area on the image to view and edit details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Total Damage Points:</p>
                  <p className="text-sm">{damageAssessments.length}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">High Severity Issues:</p>
                  <p className="text-sm">
                    {damageAssessments.filter(d => d.severity === "high").length}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Estimated Total Cost:</p>
                  <p className="text-sm font-bold">
                    ${damageAssessments.reduce((sum, item) => sum + item.estimatedCost, 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Analysis Status:</p>
                  <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleFinishAnalysis}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Analysis & Generate Estimate
              </Button>
            </CardFooter>
          </Card>
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
