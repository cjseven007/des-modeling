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
        <p>Use a projector so everyone can see the queue forming in real time.</p>
        <p>Set arrivals close together to force a bottleneck and make the queue visible.</p>
        <p>
          Pause after a few events to explain why waiting time increases when demand
          exceeds capacity.
        </p>
      </CardContent>
    </Card>
  );
}