
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Circle, MoveHorizontal, MoveVertical, ArrowRight } from "lucide-react";

interface AssessmentDetailsProps {
  selectedDamage: number | null;
  isEditing: boolean;
  editingAssessment: any;
  damageAssessments: any[];
  handleEditAssessment: (assessment: any) => void;
  saveAssessmentChanges: () => void;
  setIsEditing: (value: boolean) => void;
  setEditingAssessment: (assessment: any) => void;
}

const AssessmentDetails = ({
  selectedDamage,
  isEditing,
  editingAssessment,
  damageAssessments,
  handleEditAssessment,
  saveAssessmentChanges,
  setIsEditing,
  setEditingAssessment,
}: AssessmentDetailsProps) => {
  if (selectedDamage && isEditing) {
    return (
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
                <SelectItem value="Front Bumper Damage">Front Bumper Damage</SelectItem>
                <SelectItem value="Headlight Damage">Headlight Damage</SelectItem>
                <SelectItem value="Front Door Damage">Front Door Damage</SelectItem>
                <SelectItem value="Wheel Damage">Wheel Damage</SelectItem>
                <SelectItem value="Paint Scratch">Paint Scratch</SelectItem>
                <SelectItem value="Dent">Dent</SelectItem>
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
          <label className="text-sm font-medium">Repair Recommendation</label>
          <Select
            value={editingAssessment.recommendation || "repair"}
            onValueChange={(value) => 
              setEditingAssessment({ ...editingAssessment, recommendation: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select recommendation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="replace">Replace</SelectItem>
              <SelectItem value="touchup">Touch-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            className="mt-1"
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
          <Input
            type="number"
            className="mt-1"
            value={editingAssessment.estimatedCost}
            onChange={(e) => 
              setEditingAssessment({ 
                ...editingAssessment, 
                estimatedCost: parseFloat(e.target.value) 
              })
            }
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Part Confidence</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="1"
              className="mt-1"
              value={editingAssessment.partConfidence}
              onChange={(e) => 
                setEditingAssessment({ 
                  ...editingAssessment, 
                  partConfidence: parseFloat(e.target.value) 
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Damage Confidence</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="1"
              className="mt-1"
              value={editingAssessment.damageConfidence}
              onChange={(e) => 
                setEditingAssessment({ 
                  ...editingAssessment, 
                  damageConfidence: parseFloat(e.target.value) 
                })
              }
            />
          </div>
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
    );
  }

  if (selectedDamage) {
    const assessment = damageAssessments.find(
      (item) => item.id === selectedDamage
    );
    
    if (!assessment) return null;
    
    return (
      <div className="space-y-4">
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
          <h4 className="text-sm font-medium">Recommendation:</h4>
          <Badge 
            className={`mt-1 ${
              assessment.recommendation === 'replace' ? 'bg-red-100 text-red-800 border-red-200' :
              assessment.recommendation === 'repair' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
              'bg-green-100 text-green-800 border-green-200'
            }`}
          >
            {assessment.recommendation === 'replace' ? 'Replace' : 
             assessment.recommendation === 'repair' ? 'Repair' : 'Touch-up'}
          </Badge>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">Notes:</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {assessment.notes || "No notes provided."}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <h4 className="text-sm font-medium">Estimated Cost:</h4>
            <p className="text-lg font-semibold text-primary">
              ${assessment.estimatedCost.toFixed(2)}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Confidence:</h4>
            <div className="flex flex-col gap-1">
              <div className="text-sm">
                Part: <span className="font-medium">{(assessment.partConfidence * 100).toFixed(0)}%</span>
              </div>
              <div className="text-sm">
                Damage: <span className="font-medium">{(assessment.damageConfidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">Position:</h4>
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
        
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full mt-2"
          onClick={() => {
            const assessmentWithRecommendation = {
              ...assessment,
              recommendation: assessment.recommendation || (assessment.severity === 'high' ? 'replace' : assessment.severity === 'medium' ? 'repair' : 'touchup')
            };
            localStorage.setItem('selectedDamage', JSON.stringify(assessmentWithRecommendation));
            window.location.href = '/estimates';
          }}
        >
          Create Estimate
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  // No damage selected state
  return (
    <div className="flex flex-col items-center justify-center h-48 text-center">
      <Circle className="h-12 w-12 text-muted-foreground/20 mb-2" />
      <p className="text-muted-foreground">
        Select a damage area on the image to view and edit details
      </p>
    </div>
  );
};

export default AssessmentDetails;
