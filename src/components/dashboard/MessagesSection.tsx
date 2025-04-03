
import { 
  Bell, 
  Search, 
  Filter 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Sentiment styles for messages
const sentimentStyles = {
  positive: { className: "bg-green-500 hover:bg-green-600" },
  neutral: { className: "bg-blue-500 hover:bg-blue-600" },
  negative: { className: "bg-red-500 hover:bg-red-600" },
  urgent: { className: "bg-purple-500 hover:bg-purple-600" },
};

interface Message {
  id: string;
  subject: string;
  date: string;
  senderType: string;
  sender: string;
  needsReply: boolean;
  sentiment: string;
  claimId: string;
}

interface MessagesSectionProps {
  messages: Message[];
}

const MessagesSection = ({ messages }: MessagesSectionProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-primary" />
            Messages
          </div>
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="w-[200px] pl-8"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Claim ID</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="font-medium">{message.subject}</TableCell>
                <TableCell>
                  <Link to={`/claims/${message.claimId}`} className="text-blue-600 hover:underline">
                    {message.claimId}
                  </Link>
                </TableCell>
                <TableCell>{message.sender}</TableCell>
                <TableCell>{message.senderType}</TableCell>
                <TableCell>{message.date}</TableCell>
                <TableCell>
                  <Badge 
                    className={sentimentStyles[message.sentiment as keyof typeof sentimentStyles].className}
                  >
                    {message.needsReply ? "Needs Reply" : "No Reply Needed"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MessagesSection;
