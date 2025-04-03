
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X } from "lucide-react";

interface DamagePopoverProps {
  onSave: (damageData: {
    type: string;
    severity: string;
    notes: string;
    estimatedCost: number;
  }) => void;
  onCancel: () => void;
}

const DamagePopover = ({ onSave, onCancel }: DamagePopoverProps) => {
  const [damageData, setDamageData] = useState({
    type: "Front Bumper Damage",
    severity: "medium",
    notes: "",
    estimatedCost: 0,
  });

  const handleSave = () => {
    onSave(damageData);
    // The onSave handler will close the popover
  };

  const handleCancel = () => {
    onCancel();
    // The onCancel handler will close the popover
  };

  return (
    <div className="space-y-4 w-[300px]">
      <h3 className="font-medium text-sm">Add Manual Damage Assessment</h3>
      
      <div>
        <label className="text-sm font-medium">Damage Type</label>
        <Select
          value={damageData.type}
          onValueChange={(value) => 
            setDamageData({ ...damageData, type: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select damage type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Front Bumper Damage">Front Bumper Damage</SelectItem>
            <SelectItem value="Headlight Damage">Headlight Damage</SelectItem>
            <SelectItem value="Front Door Damage">Front Door Damage</SelectItem>
            <SelectItem value="Wheel Damage">Wheel Damage</SelectItem>
            <SelectItem value="Paint Scratch">Paint Scratch</SelectItem>
            <SelectItem value="Dent">Dent</SelectItem>
            <SelectItem value="Glass Damage">Glass Damage</SelectItem>
            <SelectItem value="Structural Damage">Structural Damage</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium">Severity</label>
        <Select
          value={damageData.severity}
          onValueChange={(value) => 
            setDamageData({ ...damageData, severity: value })
          }
        >
          <SelectTrigger className="w-full">
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
        <Textarea
          className="mt-1"
          placeholder="Add details about the damage"
          rows={2}
          value={damageData.notes}
          onChange={(e) => 
            setDamageData({ 
              ...damageData, 
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
          value={damageData.estimatedCost}
          onChange={(e) => 
            setDamageData({ 
              ...damageData, 
              estimatedCost: parseFloat(e.target.value) || 0
            })
          }
        />
      </div>
      
      <div className="flex justify-between gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleCancel}
        >
          <X className="mr-1 h-4 w-4" />
          Cancel
        </Button>
        <Button 
          size="sm"
          onClick={handleSave}
        >
          <Check className="mr-1 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default DamagePopover;
