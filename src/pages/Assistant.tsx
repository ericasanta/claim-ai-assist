
import { useState, useRef, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Robot, Send, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Types for our chat messages
interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Sample pre-defined questions that agents commonly ask
const suggestedQuestions = [
  "What's the average repair cost for a Toyota Camry bumper replacement?",
  "How much does it typically cost to repair a door dent?",
  "What are current labor rates for paint work?",
  "What documentation is needed for a total loss claim?",
  "How do I handle a disputed estimate from a customer?",
  "When should I recommend OEM vs. aftermarket parts?",
  "What's the typical timeline for a comprehensive claim?",
];

// Simulated assistant responses
const simulatedResponses: Record<string, string> = {
  "bumper": "Based on recent data from our approved repair shops, the average cost for a Toyota Camry bumper replacement ranges from $800-$1,200 including parts and labor. OEM parts would be at the higher end of the range, while aftermarket parts would be at the lower end.",
  "dent": "The average cost to repair a door dent varies based on severity. Small dents (1-3 inches) typically cost $150-$300 using paintless dent repair techniques. Medium dents (3-6 inches) average $350-$500. Larger dents or those requiring paint work can cost $500-$800+.",
  "paint": "Current labor rates for paint work in our network average $55-$70 per hour. A full door repaint typically requires 3-5 hours of labor plus materials. Recent price increases in paint materials have pushed costs up approximately 8% in the past 6 months.",
  "total loss": "Documentation required for a total loss claim includes: title of the vehicle, loan payoff information (if applicable), all keys and remotes, personal property removal confirmation, odometer disclosure statement, and a signed power of attorney for title transfer. The policyholder should also submit their settlement acceptance form.",
  "dispute": "When handling a disputed estimate, first identify the specific disagreements. For technical matters, consider requesting a joint inspection with the customer's preferred repair shop. Document all conversations and always involve a senior adjuster before offering any significant adjustment to the original estimate.",
  "oem": "Recommend OEM (Original Equipment Manufacturer) parts in these situations: 1) the vehicle is under 3 years old, 2) safety-related components are involved, 3) the policy specifically guarantees OEM parts, or 4) aftermarket parts would significantly impact vehicle value. Otherwise, quality aftermarket parts are typically acceptable.",
  "timeline": "A standard comprehensive claim typically follows this timeline: Initial filing (Day 1), assignment to adjuster (Days 1-2), inspection (Days 3-5), estimate completion (Days 5-7), repair authorization (Days 7-8), repair process (Days 8-15), quality check (Day 16), and claim closure (Days 17-20). Complex claims can take longer.",
  "default": "I don't have specific information on that topic. Would you like me to connect you with a technical specialist who might be able to assist with this question?"
};

const Assistant = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your virtual assistant. How can I help you with your insurance claims today?",
      timestamp: new Date(),
    },
  ]);
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
    
    // Simulate assistant thinking and typing
    setTimeout(() => {
      // Generate a response based on keywords
      let response = simulatedResponses.default;
      
      const lowercaseInput = inputValue.toLowerCase();
      
      // Check for keywords in the input
      if (lowercaseInput.includes("bumper")) {
        response = simulatedResponses.bumper;
      } else if (lowercaseInput.includes("dent")) {
        response = simulatedResponses.dent;
      } else if (lowercaseInput.includes("paint")) {
        response = simulatedResponses.paint;
      } else if (lowercaseInput.includes("total loss")) {
        response = simulatedResponses.total;
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

  // Handle suggested question click
  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    
    // Focus the input after setting the value
    const inputElement = document.getElementById("chat-input");
    if (inputElement) {
      inputElement.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Virtual Assistant</h2>
          <p className="text-muted-foreground">
            Ask questions about claims, repairs, and procedures
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-220px)] flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    <Robot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">AI Claims Assistant</CardTitle>
                  <CardDescription>
                    Ask me anything about claims processing and repair costs
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex w-max max-w-[90%] items-start gap-2 rounded-lg px-4 py-2",
                      message.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="mt-0.5 h-6 w-6">
                        <AvatarFallback>
                          <Robot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p className="text-sm">{message.content}</p>
                      <p 
                        className={cn(
                          "text-xs mt-1",
                          message.role === "user" 
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
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
                  <div className="flex items-start gap-2 rounded-lg bg-muted px-4 py-2 w-max">
                    <Avatar className="mt-0.5 h-6 w-6">
                      <AvatarFallback>
                        <Robot className="h-3 w-3" />
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
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="chat-input"
                  placeholder="Type your question here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isTyping}
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
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Questions</CardTitle>
              <CardDescription>
                Common questions you might want to ask
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto text-left py-2 px-3 font-normal"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{question}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assistant Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Badge className="mt-0.5 bg-blue-500 hover:bg-blue-600">Pricing</Badge>
                  <span className="text-muted-foreground">Get current repair cost estimates</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="mt-0.5 bg-green-500 hover:bg-green-600">Procedures</Badge>
                  <span className="text-muted-foreground">Learn about claims procedures</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="mt-0.5 bg-orange-500 hover:bg-orange-600">Policies</Badge>
                  <span className="text-muted-foreground">Get policy and coverage guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="mt-0.5 bg-purple-500 hover:bg-purple-600">Documentation</Badge>
                  <span className="text-muted-foreground">Documentation requirements</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
