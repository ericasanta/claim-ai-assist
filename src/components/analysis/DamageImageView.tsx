
import { useRef } from "react";
import { Info, Circle as CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import DamagePopover from "./DamagePopover";

interface DamageImageViewProps {
  imageUrl: string;
  imageAlt: string;
  isAddingNew: boolean;
  isDrawing: boolean;
  currentImageAssessments: any[];
  selectedDamage: number | null;
  newBoxPosition: { x: number; y: number; width: number; height: number };
  handleBoxClick: (id: number) => void;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: () => void;
  handleDoubleClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSaveManualDamage?: (damageData: any) => void;
  onCancelManualDamage?: () => void;
}

const DamageImageView = ({
  imageUrl,
  imageAlt,
  isAddingNew,
  isDrawing,
  currentImageAssessments,
  selectedDamage,
  newBoxPosition,
  handleBoxClick,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleDoubleClick,
  onSaveManualDamage,
  onCancelManualDamage,
}: DamageImageViewProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <div>
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
        onDoubleClick={handleDoubleClick}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt={imageAlt}
          className="w-full object-contain max-h-[500px]"
          style={{ cursor: isAddingNew ? 'crosshair' : 'default' }}
        />
        
        {/* Manual Entry Dot */}
        <Popover>
          <PopoverTrigger asChild>
            <div 
              className="absolute top-4 left-4 bg-purple-600 rounded-full w-8 h-8 shadow-md flex items-center justify-center cursor-pointer z-10 hover:bg-purple-700 transition-colors"
              title="Add manual damage entry"
            >
              <CircleIcon className="h-5 w-5 text-white" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto">
            <DamagePopover 
              onSave={(damageData) => {
                if (onSaveManualDamage) {
                  onSaveManualDamage(damageData);
                }
              }}
              onCancel={() => {
                if (onCancelManualDamage) {
                  onCancelManualDamage();
                }
              }}
            />
          </PopoverContent>
        </Popover>
        
        {currentImageAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className={cn(
              "ai-bounding-box",
              assessment.isManual ? "ai-bounding-box-manual" : `ai-bounding-box-${assessment.severity}`,
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
    </div>
  );
};

export default DamageImageView;
