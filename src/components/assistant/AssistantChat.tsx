
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Simulated assistant responses from the existing assistant
const simulatedResponses: Record<string, string> = {
  "prius": "The average repair cost for front bumper damage on a 2020 Toyota Prius is between $400 and $1,200, depending on severity. A minor cosmetic repair typically costs around $400–$600, while extensive damage requiring bumper replacement and painting usually ranges from $800–$1,200.",
  "cost references": "Yes. Recent transactions at approved repair shops indicate an average repair cost of approximately $850. For instance:\n\nJohn's Auto Repair: Front bumper replacement & painting – $880 (completed 03/25/2024).\n\nAutoPro Services: Front bumper repair (minor cosmetic damage) – $450 (completed 03/20/2024).",
  "parts only": "The front bumper replacement part for a 2020 Toyota Prius typically costs between $250 and $400, depending on the supplier and whether it's OEM or aftermarket. The OEM front bumper currently averages around $350.",
  "bumper": "Based on recent data from our approved repair shops, the average cost for a Toyota Camry bumper replacement ranges from $800-$1,200 including parts and labor. OEM parts would be at the higher end of the range, while aftermarket parts would be at the lower end.",
  "dent": "The average cost to repair a door dent varies based on severity. Small dents (1-3 inches) typically cost $150-$300 using paintless dent repair techniques. Medium dents (3-6 inches) average $350-$500. Larger dents or those requiring paint work can cost $500-$800+.",
  "paint": "Current labor rates for paint work in our network average $55-$70 per hour. A full door repaint typically requires 3-5 hours of labor plus materials. Recent price increases in paint materials have pushed costs up approximately 8% in the past 6 months.",
  "total loss": "Documentation required for a total loss claim includes: title of the vehicle, loan payoff information (if applicable), all keys and remotes, personal property removal confirmation, odometer disclosure statement, and a signed power of attorney for title transfer. The policyholder should also submit their settlement acceptance form.",
  "dispute": "When handling a disputed estimate, first identify the specific disagreements. For technical matters, consider requesting a joint inspection with the customer's preferred repair shop. Document all conversations and always involve a senior adjuster before offering any significant adjustment to the original estimate.",
  "oem": "Recommend OEM (Original Equipment Manufacturer) parts in these situations: 1) the vehicle is under 3 years old, 2) safety-related components are involved, 3) the policy specifically guarantees OEM parts, or 4) aftermarket parts would significantly impact vehicle value. Otherwise, quality aftermarket parts are typically acceptable.",
  "timeline": "A standard comprehensive claim typically follows this timeline: Initial filing (Day 1), assignment to adjuster (Days 1-2), inspection (Days 3-5), estimate completion (Days 5-7), repair authorization (Days 7-8), repair process (Days 8-15), quality check (Day 16), and claim closure (Days 17-20). Complex claims can take longer.",
  "default": "I don't have specific information on that topic. Would you like me to connect you with a technical specialist who might be able to assist with this question?"
};

// The specific question that triggers the mock conversation
const targetQuestion = "What is the typical repair cost for front bumper damage on a 2020 Toyota Prius?";

// Example of a pre-defined mock conversation
const mockConversation = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your virtual assistant. How can I help you with your insurance claims today?",
    timestamp: new Date(Date.now() - 120000),
  }
];

// The predefined conversation to display when the target question is asked
const priusConversation = [
  {
    id: 2,
    role: "user",
    content: "What is the typical repair cost for front bumper damage on a 2020 Toyota Prius?",
    timestamp: new Date(Date.now() - 100000),
  },
  {
    id: 3,
    role: "assistant",
    content: simulatedResponses.prius,
    timestamp: new Date(Date.now() - 80000),
  },
  {
    id: 4,
    role: "user",
    content: "Do you have recent cost references from approved repair shops for similar damages?",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: 5,
    role: "assistant",
    content: simulatedResponses["cost references"],
    timestamp: new Date(Date.now() - 40000),
  },
  {
    id: 6,
    role: "user",
    content: "What about the cost of parts only, excluding labor?",
    timestamp: new Date(Date.now() - 20000),
  },
  {
    id: 7,
    role: "assistant",
    content: simulatedResponses["parts only"],
    timestamp: new Date(Date.now() - 10000),
  },
];

// Types for our chat messages
interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AssistantChatProps {
  onClose: () => void;
}

const AssistantChat = ({ onClose }: AssistantChatProps) => {
  const [inputValue, setInputValue] = useState("");
  // Initialize with just the welcome message
  const [messages, setMessages] = useState<Message[]>(mockConversation);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message function
  const sendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Check if the user input matches the target question exactly
    if (inputValue.trim().toLowerCase() === targetQuestion.toLowerCase()) {
      // Instead of normal response, we'll play out the entire predefined conversation
      setTimeout(() => {
        setIsTyping(false);
        // Gradually add each message with delays to simulate a conversation
        let delay = 1000;
        priusConversation.forEach((message, index) => {
          // Skip the first message as it's already added as the user message
          if (index === 0) return;
          
          setTimeout(() => {
            setMessages(prev => [...prev, {
              ...message,
              id: Date.now() + index,
              timestamp: new Date()
            }]);
          }, delay);
          
          // Increase delay for each message
          delay += index % 2 === 0 ? 1500 : 2000; // shorter for user, longer for assistant
        });
      }, 1500);
      return;
    }
    
    // For all other questions, use the standard response mechanism
    setTimeout(() => {
      // Generate a response based on keywords
      let response = simulatedResponses.default;
      
      const lowercaseInput = inputValue.toLowerCase();
      
      // Check for keywords in the input
      if (lowercaseInput.includes("prius") || lowercaseInput.includes("toyota prius")) {
        response = simulatedResponses.prius;
      } else if (lowercaseInput.includes("cost reference") || lowercaseInput.includes("repair shop")) {
        response = simulatedResponses["cost references"];
      } else if (lowercaseInput.includes("parts only") || lowercaseInput.includes("excluding labor")) {
        response = simulatedResponses["parts only"];
      } else if (lowercaseInput.includes("bumper")) {
        response = simulatedResponses.bumper;
      } else if (lowercaseInput.includes("dent")) {
        response = simulatedResponses.dent;
      } else if (lowercaseInput.includes("paint")) {
        response = simulatedResponses.paint;
      } else if (lowercaseInput.includes("total loss")) {
        response = simulatedResponses["total loss"];
      } else if (lowercaseInput.includes("dispute")) {
        response = simulatedResponses.dispute;
      } else if (lowercaseInput.includes("oem") || lowercaseInput.includes("aftermarket")) {
        response = simulatedResponses.oem;
      } else if (lowercaseInput.includes("timeline")) {
        response = simulatedResponses.timeline;
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: Date.now(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex h-[500px] flex-col">
      <div className="flex items-center gap-2 border-b p-3">
        <Avatar className="h-8 w-8 bg-primary">
          <AvatarFallback>
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-sm font-medium">AI Claims Assistant</h3>
          <p className="text-xs text-muted-foreground">Ask me about claims and repairs</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-max max-w-[90%] items-start gap-2 rounded-lg px-3 py-2
                ${message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              {message.role === "assistant" && (
                <Avatar className="mt-0.5 h-6 w-6">
                  <AvatarFallback>
                    <Bot className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p 
                  className={`text-xs mt-1 ${message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              {message.role === "user" && (
                <Avatar className="mt-0.5 h-6 w-6">
                  <AvatarFallback>
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2 w-max">
              <Avatar className="mt-0.5 h-6 w-6">
                <AvatarFallback>
                  <Bot className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse"></div>
                <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse delay-150"></div>
                <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse delay-300"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your question here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isTyping}
            className="flex-1"
          />
          <Button 
            size="icon" 
            onClick={sendMessage}
            disabled={isTyping || !inputValue.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;
