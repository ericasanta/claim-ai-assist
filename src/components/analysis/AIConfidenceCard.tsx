
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles } from "lucide-react";

interface AIConfidenceCardProps {
  currentImageAssessments: any[];
}

const AIConfidenceCard = ({ currentImageAssessments }: AIConfidenceCardProps) => {
  return (
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
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>AI Detection Notes</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Front bumper damage detected with high confidence (87%)</li>
                  <li>Headlight damage requires replacement</li>
                  <li>Minor door panel scratches can be repaired with paint correction</li>
                  <li>Wheel damage appears to be cosmetic only</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Repair Recommendations</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Replace front bumper assembly</li>
                  <li>Replace right headlight assembly</li>
                  <li>Paint correction for door panel</li>
                  <li>Wheel refinishing recommended</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIConfidenceCard;
