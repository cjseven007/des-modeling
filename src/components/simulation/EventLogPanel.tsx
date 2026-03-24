import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type EventLogPanelProps = {
  eventLog: string[];
};

export function EventLogPanel({ eventLog }: EventLogPanelProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Event Log</CardTitle>
        <CardDescription>Helps narrate the simulation during class.</CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[240px] pr-2">
          <div className="space-y-2 text-sm">
            {eventLog.map((event, index) => (
              <div
                key={`${event}-${index}`}
                className="rounded-xl bg-slate-50 p-3 text-slate-700"
              >
                {event}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}