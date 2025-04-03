import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { 
  AlertTriangle, 
  ArrowLeftIcon, 
  ArrowRight, 
  Check, 
  CheckCircle,
  FileText, 
  Info, 
  Plus, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  ThumbsUp, 
  Trash2 
} from "lucide-react";

const additionalRecommendedItems = [
  {
    description: "Labor - Structural Alignment",
    quantity: 1,
    unitCost: 225,
    category: "Labor",
  },
  {
    description: "Paint Supplies and Materials",
    quantity: 1,
    unitCost: 175,
    category: "Paint",
  },
  {
    description: "Headlight Alignment",
    quantity: 1,
    unitCost: 85,
    category: "Labor",
  },
  {
    description: "Window Trim Replacement",
    quantity: 1,
    unitCost: 125,
    category: "Parts",
  },
];

const Estimates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [estimateItems, setEstimateItems] = useState<any[]>([]);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItem, setNewItem] = useState({
    description: "",
    quantity: 1,
    unitCost: 0,
    category: "Parts",
  });
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [showAssistedEstimateButton, setShowAssistedEstimateButton] = useState(true);

  // Add fraud detection state
  const [fraudScore, setFraudScore] = useState(0);
  const [fraudStatus, setFraudStatus] = useState<'passed' | 'caution' | 'flagged'>('passed');
  const [fraudReasons, setFraudReasons] = useState<string[]>([]);
  
  useEffect(() => {
    const storedAssessments = JSON.parse(localStorage.getItem('damageAssessments') || '[]');
    
    if (storedAssessments.length > 0) {
      const generatedItems = storedAssessments.map((assessment: any, index: number) => ({
        id: Date.now() + index,
        description: getDescriptionFromAssessment(assessment),
        quantity: 1,
        unitCost: assessment.estimatedCost || 0,
        totalCost: assessment.estimatedCost || 0,
        category: getCategoryFromAssessment(assessment),
        severity: assessment.severity,
        aiGenerated: true,
      }));
      
      const recommendedItem = {
        id: Date.now() + 1000,
        description: "Front bumper replacement (OEM Toyota part)",
        quantity: 1,
        unitCost: 350,
        totalCost: 350,
        category: "Parts",
        aiRecommended: true,
        aiGenerated: true,
      };
      
      const laborItem = {
        id: Date.now() + 1001,
        description: "Labor: Bumper removal, installation, and painting",
        quantity: 1,
        unitCost: 500,
        totalCost: 500,
        category: "Labor",
        aiRecommended: true,
        aiGenerated: true,
      };
      
      setEstimateItems([...generatedItems, recommendedItem, laborItem]);
    } else {
      const initialItems = [
        {
          id: 1,
          description: "Front bumper replacement (OEM Toyota part)",
          quantity: 1,
          unitCost: 350,
          totalCost: 350,
          category: "Parts",
          aiRecommended: true,
        },
        {
          id: 2,
          description: "Labor: Bumper removal, installation, and painting",
          quantity: 1,
          unitCost: 500,
          totalCost: 500,
          category: "Labor",
          aiRecommended: true,
        },
        {
          id: 3,
          description: "Passenger Door Replacement",
          quantity: 1,
          unitCost: 650,
          totalCost: 650,
          category: "Parts",
        },
        {
          id: 4,
          description: "Paint & Finish - Door",
          quantity: 1,
          unitCost: 350,
          totalCost: 350,
          category: "Labor",
        },
        {
          id: 5,
          description: "Bumper Repair",
          quantity: 1,
          unitCost: 450,
          totalCost: 450,
          category: "Parts",
        },
        {
          id: 6,
          description: "Paint Matching & Finish - Bumper",
          quantity: 1,
          unitCost: 300,
          totalCost: 300,
          category: "Labor",
        },
        {
          id: 7,
          description: "Surface Scratch Repair - Door",
          quantity: 1,
          unitCost: 150,
          totalCost: 150,
          category: "Labor",
        },
      ];
      
      setEstimateItems(initialItems);
    }
    
    // Add fraud detection calculation
    const storedAssessments = JSON.parse(localStorage.getItem('damageAssessments') || '[]');
    
    // Calculate mock fraud score
    let score = 25; // Base score
    const reasons: string[] = [];
    
    if (storedAssessments.length > 0) {
      // Check for high cost items
      const totalCost = storedAssessments.reduce((sum: number, item: any) => sum + item.estimatedCost, 0);
      const averageCost = totalCost / storedAssessments.length;
      
      if (averageCost > 600) {
        score += 30;
        reasons.push("Multiple high-cost items exceeding typical values");
      }
      else if (averageCost > 400) {
        score += 15;
        reasons.push("Some repair costs slightly above average");
      }
      
      // Check for unusual number of high severity damages
      const highSeverityCount = storedAssessments.filter((d: any) => d.severity === "high").length;
      if (highSeverityCount > 2) {
        score += 25;
        reasons.push("Unusually high number of severe damages detected");
      }
      else if (highSeverityCount > 0) {
        score += 10;
        reasons.push("Presence of high severity damage");
      }
      
      // Check for manual entries (could indicate manipulation)
      const manualEntries = storedAssessments.filter((d: any) => d.isManual).length;
      if (manualEntries > 1) {
        score += 20;
        reasons.push("Multiple manual adjustments to damage assessment");
      } else if (manualEntries > 0) {
        score += 10;
        reasons.push("Manual adjustment detected in damage assessment");
      }
      
      // Add random factor (5-15) to simulate varying detection logic
      score += 5 + Math.floor(Math.random() * 10);
    } else {
      // Default reasons if no assessments
      reasons.push("Limited data available for fraud detection");
      reasons.push("Standard verification recommended");
    }
    
    // Cap at 100
    score = Math.min(score, 100);
    setFraudScore(score);
    setFraudReasons(reasons);
    
    // Set fraud status based on score
    if (score < 30) setFraudStatus('passed');
    else if (score < 70) setFraudStatus('caution');
    else setFraudStatus('flagged');
  }, []);

  const getDescriptionFromAssessment = (assessment: any) => {
    const type = assessment.type || "";
    const severity = assessment.severity || "medium";
    
    let action = "Repair";
    if (severity === "high") {
      action = "Replace";
    } else if (severity === "low") {
      action = "Touch-up";
    }
    
    return `${action} - ${type}`;
  };

  const getCategoryFromAssessment = (assessment: any) => {
    const type = (assessment.type || "").toLowerCase();
    
    if (type.includes("bumper") || type.includes("door") || type.includes("panel") || type.includes("headlight")) {
      return "Parts";
    } else if (type.includes("paint") || type.includes("scratch")) {
      return "Paint";
    } else {
      return "Labor";
    }
  };

  const totalEstimateCost = estimateItems.reduce(
    (sum, item) => sum + item.totalCost,
    0
  );

  const taxRate = 0.08;
  const taxAmount = totalEstimateCost * taxRate;
  const finalAmount = totalEstimateCost + taxAmount;

  const handleAddItem = () => {
    if (!newItem.description || newItem.unitCost <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    const newItemWithTotal = {
      ...newItem,
      id: Date.now(),
      totalCost: newItem.quantity * newItem.unitCost,
    };

    setEstimateItems([...estimateItems, newItemWithTotal]);
    setNewItem({
      description: "",
      quantity: 1,
      unitCost: 0,
      category: "Parts",
    });
    setShowAddItemForm(false);

    toast({
      title: "Item Added",
      description: "The new item has been added to the estimate.",
    });
  };

  const handleAssistedEstimate = () => {
    const newItems = additionalRecommendedItems.map((item) => ({
      ...item,
      id: Date.now() + Math.random() * 1000,
      totalCost: item.quantity * item.unitCost,
      aiRecommended: true,
    }));
    
    setEstimateItems([...estimateItems, ...newItems]);
    setShowAssistedEstimateButton(false);
    
    toast({
      title: "Assisted Estimate Generated",
      description: "Additional recommended items have been added to the estimate.",
    });
  };

  const handleRemoveItem = (id: number) => {
    setEstimateItems(estimateItems.filter((item) => item.id !== id));
    toast({
      title: "Item Removed",
      description: "The item has been removed from the estimate.",
    });
  };

  const toggleEditItem = (id: number) => {
    if (editingItemId === id) {
      setEditingItemId(null);
    } else {
      setEditingItemId(id);
    }
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setEstimateItems(
      estimateItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          if (field === "quantity" || field === "unitCost") {
            updatedItem.totalCost = updatedItem.quantity * updatedItem.unitCost;
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleSubmitForApproval = () => {
    setShowApprovalDialog(true);
  };

  const completeApproval = () => {
    const estimateData = {
      items: estimateItems,
      totalCost: totalEstimateCost,
      taxAmount: taxAmount,
      finalAmount: finalAmount,
      approvalNotes: approvalNotes,
      approvalDate: new Date().toISOString(),
      status: "pending_approval"
    };
    localStorage.setItem('currentEstimate', JSON.stringify(estimateData));
    
    const claims = JSON.parse(localStorage.getItem('claims') || '[]');
    const updatedClaims = claims.map((claim: any) => {
      if (claim.id === "CLM-4231") {
        return {
          ...claim,
          status: "pending_approval",
          estimateAmount: finalAmount.toFixed(2)
        };
      }
      return claim;
    });
    localStorage.setItem('claims', JSON.stringify(updatedClaims));
    
    toast({
      title: "Estimate Approved",
      description: "The estimate has been submitted for approval by the senior adjuster.",
    });
    navigate("/claims");
  };

  // Get recommendations based on fraud status
  const getFraudRecommendations = () => {
    if (fraudStatus === 'flagged') {
      return [
        "Initiate detailed investigation",
        "Request additional documentation",
        "Flag for senior adjuster review"
      ];
    } else if (fraudStatus === 'caution') {
      return [
        "Request secondary review",
        "Verify repair cost estimates",
        "Compare with similar claims"
      ];
    } else {
      return [
        "Proceed with normal claim processing",
        "No additional verification needed"
      ];
    }
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
            <h2 className="text-3xl font-bold tracking-tight">Repair Estimate</h2>
            <p className="text-muted-foreground">
              Claim #CLM-4231 | Emily Johnson | Toyota Camry 2020
            </p>
          </div>
        </div>
        <Button onClick={handleSubmitForApproval}>
          Submit for Approval
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Estimate Details</CardTitle>
                <div className="flex gap-2">
                  {showAssistedEstimateButton && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleAssistedEstimate}
                      className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Assisted Estimate
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddItemForm(!showAddItemForm)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </div>
              <CardDescription>
                AI-generated estimate based on damage analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showAddItemForm && (
                <div className="mb-4 p-4 border rounded-md bg-muted/30">
                  <h3 className="text-sm font-medium mb-3">Add New Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs font-medium">Description</label>
                      <Input
                        value={newItem.description}
                        onChange={(e) => 
                          setNewItem({ ...newItem, description: e.target.value })
                        }
                        placeholder="Item description"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Category</label>
                      <select
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                        value={newItem.category}
                        onChange={(e) => 
                          setNewItem({ ...newItem, category: e.target.value })
                        }
                      >
                        <option value="Parts">Parts</option>
                        <option value="Labor">Labor</option>
                        <option value="Paint">Paint</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs font-medium">Quantity</label>
                      <Input
                        type="number"
                        min="1"
                        value={newItem.quantity}
                        onChange={(e) => 
                          setNewItem({ 
                            ...newItem, 
                            quantity: parseInt(e.target.value) || 1 
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Unit Cost ($)</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.unitCost}
                        onChange={(e) => 
                          setNewItem({ 
                            ...newItem, 
                            unitCost: parseFloat(e.target.value) || 0 
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddItemForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleAddItem}>
                      <Check className="mr-1 h-4 w-4" />
                      Add to Estimate
                    </Button>
                  </div>
                </div>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Unit Cost</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estimateItems.map((item) => (
                      <TableRow key={item.id} className={item.aiRecommended ? "bg-blue-50" : ""}>
                        <TableCell>
                          {editingItemId === item.id ? (
                            <Input
                              value={item.description}
                              onChange={(e) => 
                                updateItem(item.id, "description", e.target.value)
                              }
                            />
                          ) : (
                            <div className="flex items-center">
                              {item.description}
                              {item.aiGenerated && (
                                <Badge className="ml-2 bg-green-100 text-green-800 border-green-200 text-xs">AI</Badge>
                              )}
                              {item.aiRecommended && (
                                <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200 text-xs">Recommended</Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingItemId === item.id ? (
                            <select
                              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                              value={item.category}
                              onChange={(e) => 
                                updateItem(item.id, "category", e.target.value)
                              }
                            >
                              <option value="Parts">Parts</option>
                              <option value="Labor">Labor</option>
                              <option value="Paint">Paint</option>
                              <option value="Other">Other</option>
                            </select>
                          ) : (
                            <Badge 
                              variant="outline" 
                              className="font-normal"
                            >
                              {item.category}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {editingItemId === item.id ? (
                            <Input
                              type="number"
                              min="1"
                              className="w-16 text-center mx-auto"
                              value={item.quantity}
                              onChange={(e) => 
                                updateItem(
                                  item.id, 
                                  "quantity", 
                                  parseInt(e.target.value) || 1
                                )
                              }
                            />
                          ) : (
                            item.quantity
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingItemId === item.id ? (
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-24 text-right ml-auto"
                              value={item.unitCost}
                              onChange={(e) => 
                                updateItem(
                                  item.id, 
                                  "unitCost", 
                                  parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          ) : (
                            `$${item.unitCost.toFixed(2)}`
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${item.totalCost.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleEditItem(item.id)}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">
                                {editingItemId === item.id ? "Save" : "Edit"}
                              </span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardHeader>
              <CardTitle>Repair Recommendation</CardTitle>
              <CardDescription>AI-based repair recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-white border p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">Vehicle</h3>
                    <span className="text-xs text-muted-foreground">Toyota Camry 2020</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-green-50">Carheal X</Badge>
                    <Badge variant="outline" className="bg-blue-50">Bodyshop</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Recommended Actions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">Front Bumper</span>
                      <Badge className="bg-red-100 text-red-800 border-red-200">Replace</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">Right Door</span>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Repair</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">Headlight</span>
                      <Badge className="bg-red-100 text-red-800 border-red-200">Replace</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm">Paint Surface</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Touch-up</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add fraud detection card before the estimate summary */}
          <Card className={`${
            fraudStatus === "passed" ? "border-l-4 border-l-green-500" : 
            fraudStatus === "caution" ? "border-l-4 border-l-yellow-500" : 
            "border-l-4 border-l-red-500"
          }`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  {fraudStatus === "passed" ? (
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                  ) : fraudStatus === "caution" ? (
                    <ShieldAlert className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  Fraud Detection
                </CardTitle>
                <Badge 
                  className={`
                    ${fraudStatus === "passed" ? "bg-green-100 text-green-800 border-green-200" : 
                     fraudStatus === "caution" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : 
                     "bg-red-100 text-red-800 border-red-200"}
                  `}
                >
                  {fraudStatus === "passed" ? "Passed" : 
                   fraudStatus === "caution" ? "Caution" : "Flagged"}
                </Badge>
              </div>
              <CardDescription>
                Automated fraud risk analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add visual fraud score indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-600 font-medium">Low Risk</span>
                  <span className="text-red-600 font-medium">High Risk</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div className="h-2 rounded bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-full"></div>
                  </div>
                  <div 
                    className="absolute h-4 w-4 rounded-full bg-white border-2 shadow-md top-0"
                    style={{ 
                      left: `calc(${fraudScore}% - 8px)`, 
                      borderColor: 
                        fraudStatus === "passed" ? "rgb(34, 197, 94)" : 
                        fraudStatus === "caution" ? "rgb(234, 179, 8)" : 
                        "rgb(239, 68, 68)",
                    }}
                  />
                  <div 
                    className="absolute text-xs font-bold"
                    style={{ 
                      left: `calc(${fraudScore}% - 12px)`,
                      top: '16px', 
                      color: 
                        fraudStatus === "passed" ? "rgb(22, 163, 74)" : 
                        fraudStatus === "caution" ? "rgb(202, 138, 4)" : 
                        "rgb(220, 38, 38)",
                    }}
                  >
                    {fraudScore}%
                  </div>
                </div>
              </div>
              
              {/* Show fraud reasons in a popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Info className="mr-2 h-4 w-4" />
                    View Detection Details
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Detection Factors:</h4>
                      <ul className="text-sm space-y-1">
                        {fraudReasons.map((reason, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-0.5">
                              {fraudStatus === "passed" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : fraudStatus === "caution" ? (
                                <Info className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Recommended Actions:</h4>
                      <ul className="text-sm space-y-1">
                        {getFraudRecommendations().map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-0.5">•</div>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {fraudStatus !== "passed" && (
                <div className="mt-2 p-2 rounded-md bg-amber-50 border border-amber-100 text-xs">
                  <div className="flex gap-2 items-start">
                    <ShieldAlert className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-800">
                        {fraudStatus === "caution" 
                          ? "Action Required: Secondary Review" 
                          : "Action Required: Detailed Investigation"}
                      </p>
                      <p className="text-amber-700 mt-1">
                        {fraudStatus === "caution"
                          ? "This claim requires review by a senior adjuster before approval."
                          : "Please escalate this claim for detailed investigation before proceeding."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estimate Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${totalEstimateCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%):</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                  <span>Total Estimate:</span>
                  <span className="text-lg">${finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" onClick={handleSubmitForApproval}>
                <ThumbsUp className="mr-2 h-4 w-4" />
                Submit for Approval
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estimate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Claim ID:</span>
                  <span className="font-medium">CLM-4231</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted
