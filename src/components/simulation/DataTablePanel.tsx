import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatTime,
  getStatusBadgeVariant,
} from "@/lib/simulation-utils";
import type { Customer } from "@/types/simulation";

type DataTablePanelProps = {
  customers: Customer[];
};

export function DataTablePanel({ customers }: DataTablePanelProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Live Data Table</CardTitle>
        <CardDescription>
          Arrival time, waiting time, rolled dice value, and service duration are
          recorded automatically.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="w-full">
          <div className="min-w-[1100px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Queue Start</TableHead>
                  <TableHead>Service Start</TableHead>
                  <TableHead>Service End</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead>Dice Value</TableHead>
                  <TableHead>Service Time</TableHead>
                  <TableHead>Rolled Service Time</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {customers
                  .slice()
                  .sort((a, b) => a.arrivalSeconds - b.arrivalSeconds)
                  .map((customer) => {
                    const waitTime =
                      customer.serviceStartAt !== null
                        ? customer.serviceStartAt - customer.arrivalSeconds
                        : null;

                    return (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.id}</TableCell>
                        <TableCell>{formatTime(customer.arrivalSeconds)}</TableCell>
                        <TableCell>{formatTime(customer.queuedAt)}</TableCell>
                        <TableCell>{formatTime(customer.serviceStartAt)}</TableCell>
                        <TableCell>{formatTime(customer.serviceEndAt)}</TableCell>
                        <TableCell>{waitTime !== null ? `${waitTime}s` : "—"}</TableCell>
                        <TableCell>{customer.diceValue ?? "—"}</TableCell>
                        <TableCell>
                          {customer.serviceDuration
                            ? `${customer.serviceDuration}s`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {customer.diceValue
                            ? `${customer.diceValue} × 10 = ${customer.serviceDuration}s`
                            : "—"}
                        </TableCell>
                        <TableCell>{customer.operatorId ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(customer.status)}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}