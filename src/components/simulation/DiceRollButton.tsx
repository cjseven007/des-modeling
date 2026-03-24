import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type DiceRollButtonProps = {
  onRoll: () => void;
  rolling: boolean;
};

export function DiceRollButton({
  onRoll,
  rolling,
}: DiceRollButtonProps) {
  return (
    <Button
      onClick={onRoll}
      className="relative h-12 w-full rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
    >
      <div className="flex w-full items-center justify-between px-2">
        <div className="text-left leading-tight">
          <div className="text-xs font-medium text-slate-700">
            Roll Dice
          </div>
          <div className="text-[10px] text-slate-500">
            Service = value × 10s
          </div>
        </div>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm ${
            rolling ? "animate-spin" : "transition-transform duration-200"
          }`}
        >
          🎲
        </div>
      </div>

      {/* subtle indicator */}
      {!rolling && (
        <Sparkles className="absolute right-2 top-2 h-3 w-3 text-slate-400 opacity-60" />
      )}
    </Button>
  );
}