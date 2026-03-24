import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatTime } from "@/lib/simulation-utils";
import type { SimulationState } from "@/types/simulation";
import { Clock3, Pause, Play, RotateCcw, Settings2 } from "lucide-react";

type ControlsPanelProps = {
  currentTime: number;
  simulationState: SimulationState;
  operatorsCount: number;
  tickMs: number;
  isConfigLocked: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  setOperatorsCount: (value: number) => void;
  setTickMs: (value: number) => void;
};

export function ControlsPanel({
  currentTime,
  simulationState,
  operatorsCount,
  tickMs,
  isConfigLocked,
  onStart,
  onPause,
  onReset,
  setOperatorsCount,
  setTickMs,
}: ControlsPanelProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock3 className="h-5 w-5" />
          Simulation Controls
        </CardTitle>
        <CardDescription>
          Start, pause, restart, and configure the simulation speed and number of operators.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-2xl bg-slate-900 p-6 text-center text-white">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-300">Timer</div>
          <div className="mt-2 text-5xl font-bold tracking-widest">
            {formatTime(currentTime)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button onClick={onStart} className="gap-2">
            <Play className="h-4 w-4" />
            Start
          </Button>
          <Button
            variant="secondary"
            onClick={onPause}
            disabled={simulationState !== "running"}
            className="gap-2"
          >
            <Pause className="h-4 w-4" />
            Pause
          </Button>
          <Button variant="outline" onClick={onReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Restart
          </Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Settings2 className="h-4 w-4" />
            Configuration
          </div>

          <div className="space-y-2">
            <Label htmlFor="operators">Number of Operators</Label>
            <Input
              id="operators"
              type="number"
              min={2}
              max={3}
              value={operatorsCount}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 2 && value <= 3) setOperatorsCount(value);
              }}
              disabled={isConfigLocked}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tick">Simulation Speed (ms per simulated second)</Label>
            <Input
              id="tick"
              type="number"
              min={200}
              step={100}
              value={tickMs}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!Number.isNaN(value) && value >= 200) setTickMs(value);
              }}
              disabled={isConfigLocked}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}