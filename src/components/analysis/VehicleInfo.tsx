
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, X } from "lucide-react";

interface VehicleInfoProps {
  vehicleData: {
    make: string;
    model: string;
    year: string;
    color: string;
    view: string;
    category: string;
  };
  editingVehicleInfo: boolean;
  setEditingVehicleInfo: (value: boolean) => void;
  setVehicleData: (data: any) => void;
  saveVehicleInfo: () => void;
}

const VehicleInfo = ({
  vehicleData,
  editingVehicleInfo,
  setEditingVehicleInfo,
  setVehicleData,
  saveVehicleInfo,
}: VehicleInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Vehicle Information</h3>
        {!editingVehicleInfo ? (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setEditingVehicleInfo(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setEditingVehicleInfo(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={saveVehicleInfo}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>

      {editingVehicleInfo ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Repair Category</label>
            <Input 
              value={vehicleData.category}
              onChange={(e) => setVehicleData({...vehicleData, category: e.target.value})}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Make</label>
            <Input 
              value={vehicleData.make}
              onChange={(e) => setVehicleData({...vehicleData, make: e.target.value})}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Model</label>
            <Input 
              value={vehicleData.model}
              onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Year</label>
            <Input 
              value={vehicleData.year}
              onChange={(e) => setVehicleData({...vehicleData, year: e.target.value})}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Color</label>
            <Input 
              value={vehicleData.color}
              onChange={(e) => setVehicleData({...vehicleData, color: e.target.value})}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">View</label>
            <Input 
              value={vehicleData.view}
              onChange={(e) => setVehicleData({...vehicleData, view: e.target.value})}
              className="mt-1"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 rounded-md bg-slate-50 p-4">
          <div>
            <p className="text-sm font-semibold">Repair Category</p>
            <p className="text-sm">{vehicleData.category}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Vehicle</p>
            <p className="text-sm">
              Type: {vehicleData.make} {vehicleData.model} &nbsp;&nbsp; View: {vehicleData.view}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleInfo;
