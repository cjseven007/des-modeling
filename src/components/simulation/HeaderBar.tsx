import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/simulation-utils";
import type { SimulationState } from "@/types/simulation";

type HeaderBarProps = {
  simulationState: SimulationState;
  currentTime: number;
};

export function HeaderBar({
  simulationState,
  currentTime,
}: HeaderBarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Queue Simulation Classroom Dashboard
        </h1>
        <p className="text-sm text-slate-600">
          Run a live classroom queuing simulation with visual queue flow,
          operator service, dice-based service time, and automatic data
          collection.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="px-3 py-1 text-sm">
          State: {simulationState}
        </Badge>
        <Badge variant="secondary" className="px-3 py-1 text-sm">
          Current Time: {formatTime(currentTime)}
        </Badge>
      </div>
    </div>
  );
}