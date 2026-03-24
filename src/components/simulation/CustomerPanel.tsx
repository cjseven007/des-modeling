import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import type { Customer } from "@/types/simulation";
import { CustomerCard } from "./CustomerCard";

type CustomerPanelProps = {
  customers: Customer[];
  isConfigLocked: boolean;
  onUpdateArrivalTime: (id: string, value: string) => void;
  onAddCustomer: () => void;
  onRemoveCustomer: (id: string) => void;
};

export function CustomerPanel({
  customers,
  isConfigLocked,
  onUpdateArrivalTime,
  onAddCustomer,
  onRemoveCustomer,
}: CustomerPanelProps) {
  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="w-full space-y-3 px-0 pt-0">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 shrink-0" />
              <span className="truncate">Customer Configuration</span>
            </CardTitle>
            <CardDescription className="mt-1 break-words">
              Add or remove customers and adjust arrival times before starting
              the simulation.
            </CardDescription>
          </div>

          <Button
            onClick={onAddCustomer}
            disabled={isConfigLocked}
            className="gap-2 rounded-xl self-start"
          >
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
          <div className="min-w-0 rounded-xl bg-slate-50 p-3">
            <div className="text-slate-500">Total Customers</div>
            <div className="text-xl font-bold">{customers.length}</div>
          </div>
          <div className="min-w-0 rounded-xl bg-slate-50 p-3">
            <div className="text-slate-500">Editable</div>
            <div className="text-xl font-bold">{isConfigLocked ? "No" : "Yes"}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="w-full px-0 pb-0">
        <ScrollArea className="h-[60vh] w-full rounded-md">
          <div className="w-full space-y-3 pr-3">
            {customers
              .slice()
              .sort((a, b) => a.arrivalSeconds - b.arrivalSeconds)
              .map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  isConfigLocked={isConfigLocked}
                  onUpdateArrivalTime={onUpdateArrivalTime}
                  onRemoveCustomer={onRemoveCustomer}
                />
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}