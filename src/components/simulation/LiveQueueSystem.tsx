import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/lib/simulation-utils";
import type { Customer, Operator } from "@/types/simulation";
import { Dice6 } from "lucide-react";

type LiveQueueSystemProps = {
  upcomingCustomers: Customer[];
  queue: Customer[];
  operators: Operator[];
  customers: Customer[];
  operatorsCount: number;
  pendingRollOperatorId: number | null;
  currentTime: number;
  onRollDice: () => void;
};

export function LiveQueueSystem({
  upcomingCustomers,
  queue,
  operators,
  customers,
  operatorsCount,
  pendingRollOperatorId,
  currentTime,
  onRollDice,
}: LiveQueueSystemProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Live Queue System</CardTitle>
        <CardDescription>
          Upcoming customers enter the queue, then move to the next available operator.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 text-sm font-medium text-slate-700">
            Upcoming Arrivals
          </div>
          <div className="flex min-h-[72px] flex-wrap gap-2 rounded-2xl border border-dashed bg-slate-50 p-3">
            {upcomingCustomers.length > 0 ? (
              upcomingCustomers.map((customer) => (
                <Badge
                  key={customer.id}
                  variant="outline"
                  className="rounded-full px-3 py-1 text-sm"
                >
                  {customer.id} · {formatTime(customer.arrivalSeconds)}
                </Badge>
              ))
            ) : (
              <div className="text-sm text-slate-500">No more upcoming arrivals.</div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-slate-700">Queue</div>
          <div className="min-h-[96px] rounded-2xl border bg-amber-50 p-4">
            {queue.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {queue.map((customer, index) => (
                  <div
                    key={customer.id}
                    className="flex h-14 min-w-[72px] items-center justify-center rounded-2xl border bg-white px-4 text-sm font-semibold shadow-sm"
                  >
                    {index + 1}. {customer.id}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-14 items-center text-sm text-slate-500">
                Queue is empty.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-slate-700">Operators</div>
          <div className={`grid gap-4 ${operatorsCount === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {operators.map((operator) => {
              const assignedCustomer =
                customers.find((customer) => customer.id === operator.currentCustomerId) ?? null;
              const needsRoll = pendingRollOperatorId === operator.id;
              const timeLeft =
                operator.busyUntil !== null
                  ? Math.max(operator.busyUntil - currentTime, 0)
                  : null;

              return (
                <div key={operator.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="font-semibold">Operator {operator.id}</div>
                    <Badge variant={assignedCustomer ? "default" : "outline"}>
                      {assignedCustomer ? "Busy" : "Idle"}
                    </Badge>
                  </div>

                  {assignedCustomer ? (
                    <div className="space-y-3">
                      <div className="rounded-xl bg-slate-50 p-3 text-sm">
                        <div className="font-medium">Serving: {assignedCustomer.name}</div>
                        <div className="mt-1 text-slate-600">
                          Start: {formatTime(assignedCustomer.serviceStartAt)}
                        </div>
                        <div className="text-slate-600">
                          Dice: {assignedCustomer.diceValue ?? "Pending"}
                        </div>
                        <div className="text-slate-600">
                          Service:{" "}
                          {assignedCustomer.serviceDuration
                            ? `${assignedCustomer.serviceDuration}s`
                            : "Pending"}
                        </div>
                        <div className="text-slate-600">
                          Remaining: {timeLeft !== null ? `${timeLeft}s` : "Pending roll"}
                        </div>
                      </div>

                      {needsRoll && (
                        <Button onClick={onRollDice} className="w-full gap-2">
                          <Dice6 className="h-4 w-4" />
                          Roll Dice
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
                      Waiting for next customer.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}