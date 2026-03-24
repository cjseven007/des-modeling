import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";
import type { Customer } from "@/types/simulation";
import { CustomerCard } from "./CustomerCard";

type CustomerPanelProps = {
  customers: Customer[];
  isConfigLocked: boolean;
  onUpdateArrivalTime: (id: string, value: string) => void;
};

export function CustomerPanel({
  customers,
  isConfigLocked,
  onUpdateArrivalTime,
}: CustomerPanelProps) {
  return (
    <Card className="shadow-sm xl:min-h-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          Customer Arrivals
        </CardTitle>
        <CardDescription>
          Edit arrival seconds before starting. During the simulation, this becomes
          a live customer panel.
        </CardDescription>
      </CardHeader>

      <CardContent className="min-h-0">
        <ScrollArea className="h-[420px] w-full rounded-md xl:h-[calc(100vh-220px)]">
          <div className="space-y-3 pr-3">
            {customers
              .slice()
              .sort((a, b) => a.arrivalSeconds - b.arrivalSeconds)
              .map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  isConfigLocked={isConfigLocked}
                  onUpdateArrivalTime={onUpdateArrivalTime}
                />
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}