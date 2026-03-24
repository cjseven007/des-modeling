import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatTime,
  getStatusBadgeVariant,
} from "@/lib/simulation-utils";
import type { Customer } from "@/types/simulation";
import { Trash2 } from "lucide-react";

type CustomerCardProps = {
  customer: Customer;
  isConfigLocked: boolean;
  onUpdateArrivalTime: (id: string, value: string) => void;
  onRemoveCustomer: (id: string) => void;
};

export function CustomerCard({
  customer,
  isConfigLocked,
  onUpdateArrivalTime,
  onRemoveCustomer,
}: CustomerCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-3 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-semibold">{customer.name}</div>
          <div className="text-xs text-slate-500">ID: {customer.id}</div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={getStatusBadgeVariant(customer.status)}
            className="shrink-0"
          >
            {customer.status}
          </Badge>

          {!isConfigLocked && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-slate-500 hover:text-red-600"
              onClick={() => onRemoveCustomer(customer.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`arrival-${customer.id}`} className="text-xs text-slate-600">
          Arrival Time (seconds)
        </Label>
        <Input
          id={`arrival-${customer.id}`}
          type="number"
          min={0}
          value={customer.arrivalSeconds}
          onChange={(e) => onUpdateArrivalTime(customer.id, e.target.value)}
          disabled={isConfigLocked}
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-2">
          Arrival: {formatTime(customer.arrivalSeconds)}
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          Queue At: {formatTime(customer.queuedAt)}
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          Start: {formatTime(customer.serviceStartAt)}
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          End: {formatTime(customer.serviceEndAt)}
        </div>
      </div>
    </div>
  );
}