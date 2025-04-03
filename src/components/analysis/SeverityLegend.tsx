
import React from "react";

interface SeverityLegendProps {
  items: { label: string; class: string }[];
}

const SeverityLegend = ({ items }: SeverityLegendProps) => {
  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center">
          <div className={`w-4 h-4 ${item.class} mr-2`}></div>
          <span className="text-sm text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SeverityLegend;
