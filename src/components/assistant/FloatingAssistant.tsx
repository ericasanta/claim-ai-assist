
import { useState } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AssistantChat from "./AssistantChat";

const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-96 shadow-lg animate-in fade-in slide-in-from-bottom-10 duration-300">
          <CardContent className="p-0">
            <AssistantChat onClose={() => setIsOpen(false)} />
          </CardContent>
        </Card>
      )}
      
      <Button
        onClick={toggleChat}
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
        )}
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>
    </div>
  );
};

export default FloatingAssistant;
