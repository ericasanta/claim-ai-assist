
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DamageTableProps {
  damages: any[];
  selectedDamage: number | null;
  setSelectedDamage: (id: number) => void;
}

const DamageTable = ({ damages, selectedDamage, setSelectedDamage }: DamageTableProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[50%]">Part-Wise Damage</TableHead>
            <TableHead className="text-right">Part Conf(%)</TableHead>
            <TableHead className="text-right">Damage Conf(%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {damages.map((item) => (
            <TableRow 
              key={item.id}
              className={selectedDamage === item.id ? "bg-blue-50" : ""}
              onClick={() => setSelectedDamage(item.id)}
            >
              <TableCell>
                <div className="flex items-center">
                  {item.type}
                  {item.isManual && (
                    <Badge variant="outline" className="ml-2 text-xs bg-purple-50 text-purple-700 border-purple-200">
                      Manual
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {item.isManual ? "Manual" : item.partConfidence.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {item.isManual ? "Manual" : item.damageConfidence.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DamageTable;
