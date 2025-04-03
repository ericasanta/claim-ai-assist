
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ActivityFeed = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>
          Recent activities and updates related to this claim
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          No activities yet.
        </p>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
