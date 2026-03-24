import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTime } from "@/lib/simulation-utils";

type SummaryPanelProps = {
  metrics: {
    completedCount: number;
    queueLength: number;
    avgWait: number;
    avgService: number;
    activeCount: number;
    maxArrival: number;
    maxQueueLength: number;
  };
};

export function SummaryPanel({ metrics }: SummaryPanelProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Performance Summary</CardTitle>
        <CardDescription>
          Useful metrics for explaining bottlenecks and waiting time in class.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-xs text-slate-500">Completed</div>
          <div className="text-2xl font-bold">{metrics.completedCount}</div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-xs text-slate-500">Queue Length</div>
          <div className="text-2xl font-bold">{metrics.queueLength}</div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-xs text-slate-500">Max Queue</div>
          <div className="text-2xl font-bold">{metrics.maxQueueLength}</div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-xs text-slate-500">Avg Wait</div>
          <div className="text-2xl font-bold">{metrics.avgWait}s</div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-xs text-slate-500">Avg Service</div>
          <div className="text-2xl font-bold">{metrics.avgService}s</div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-xs text-slate-500">Last Arrival</div>
          <div className="text-2xl font-bold">{formatTime(metrics.maxArrival)}</div>
        </div>
      </CardContent>
    </Card>
  );
}