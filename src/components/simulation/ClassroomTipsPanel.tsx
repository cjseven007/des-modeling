import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound } from "lucide-react";

export function ClassroomTipsPanel() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserRound className="h-5 w-5" />
          Classroom Tips
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-slate-600">
        <p>
          Use a projector so everyone can clearly see the queue and operator
          service area.
        </p>
        <p>
          Make arrivals closer together to create a bottleneck and show queue
          buildup.
        </p>
        <p>
          Pause the simulation to explain how random service times affect waiting
          time.
        </p>
      </CardContent>
    </Card>
  );
}