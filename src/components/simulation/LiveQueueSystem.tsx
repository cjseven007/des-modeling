import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTime } from "@/lib/simulation-utils";
import type { Customer, Operator } from "@/types/simulation";
import { ArrowRight, TimerReset } from "lucide-react";
import { QueueAvatar } from "./QueueAvatar";
import { DiceRollButton } from "./DiceRollButton";

type LiveQueueSystemProps = {
  upcomingCustomers: Customer[];
  queue: Customer[];
  operators: Operator[];
  customers: Customer[];
  operatorsCount: number;
  pendingRollOperatorId: number | null;
  currentTime: number;
  onRollDice: () => void;
  rollingDice: boolean;
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
  rollingDice,
}: LiveQueueSystemProps) {
  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardHeader className="rounded-t-2xl border-b border-slate-100 bg-slate-50 px-4 py-3">
        <CardTitle className="text-base font-semibold text-slate-800">
          Live Queue & Service Floor
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Customers move from arrival to queue to service.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Upcoming
            </div>
            <Badge
              variant="outline"
              className="rounded-full px-2 py-0 text-[11px] text-slate-600"
            >
              {upcomingCustomers.length} waiting
            </Badge>
          </div>

          <div className="flex min-h-[64px] flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {upcomingCustomers.length > 0 ? (
              upcomingCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <QueueAvatar label={customer.id} tone="blue" />
                  <div className="leading-tight">
                    <div className="text-xs font-medium text-slate-800">
                      {customer.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {formatTime(customer.arrivalSeconds)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400">
                No more upcoming arrivals.
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.95fr_44px_1fr] xl:items-start">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Queue
              </div>
              <Badge className="rounded-full bg-amber-50 px-2 py-0 text-[11px] text-amber-700 hover:bg-amber-50">
                {queue.length} in line
              </Badge>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-3">
              {queue.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {queue.map((customer, index) => (
                    <div
                      key={customer.id}
                      className="flex flex-col items-center gap-1.5 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <QueueAvatar
                        label={customer.id}
                        tone="amber"
                        animated={index === 0}
                      />
                      <div className="text-[10px] font-medium text-slate-600">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[82px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white text-xs text-slate-400">
                  Queue is empty
                </div>
              )}
            </div>
          </div>

          <div className="hidden items-center justify-center xl:flex">
            <div className="flex flex-col items-center gap-1 text-slate-300">
              <ArrowRight className="h-4 w-4 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Operators
              </div>
              <Badge className="rounded-full bg-emerald-50 px-2 py-0 text-[11px] text-emerald-700 hover:bg-emerald-50">
                {operatorsCount} active
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {operators.map((operator) => {
                const assignedCustomer =
                  customers.find(
                    (customer) => customer.id === operator.currentCustomerId
                  ) ?? null;

                const needsRoll = pendingRollOperatorId === operator.id;
                const timeLeft =
                  operator.busyUntil !== null
                    ? Math.max(operator.busyUntil - currentTime, 0)
                    : null;

                return (
                  <div
                    key={operator.id}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800">
                          Operator {operator.id}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Service Desk
                        </div>
                      </div>

                      <Badge
                        variant={assignedCustomer ? "default" : "outline"}
                        className={
                          assignedCustomer
                            ? "rounded-full bg-emerald-500 px-2 py-0 text-[10px] text-white hover:bg-emerald-500"
                            : "rounded-full px-2 py-0 text-[10px]"
                        }
                      >
                        {assignedCustomer ? "Busy" : "Idle"}
                      </Badge>
                    </div>

                    {assignedCustomer ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5">
                          <QueueAvatar
                            label={assignedCustomer.id}
                            tone="emerald"
                            animated={needsRoll}
                          />
                          <div className="min-w-0 leading-tight">
                            <div className="truncate text-xs font-medium text-slate-800">
                              {assignedCustomer.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {formatTime(assignedCustomer.serviceStartAt)}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-xl bg-slate-50 p-2">
                            <div className="text-[10px] text-slate-500">Dice</div>
                            <div className="text-base font-semibold text-slate-800">
                              {assignedCustomer.diceValue ?? "—"}
                            </div>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-2">
                            <div className="text-[10px] text-slate-500">
                              Service
                            </div>
                            <div className="text-sm font-semibold text-slate-800">
                              {assignedCustomer.serviceDuration
                                ? `${assignedCustomer.serviceDuration}s`
                                : "Pending"}
                            </div>
                          </div>

                          <div className="col-span-2 rounded-xl bg-red-100 p-2">
                            <div className="mb-1 flex items-center gap-1 text-[10px] text-slate-500">
                              <TimerReset className="h-3 w-3" />
                              Remaining
                            </div>
                            <div className="text-sm font-semibold text-slate-800">
                              {timeLeft !== null ? `${timeLeft}s` : "Waiting for roll"}
                            </div>
                          </div>
                        </div>

                        {needsRoll && (
                          <div className="pt-1">
                            <DiceRollButton onRoll={onRollDice} rolling={rollingDice} />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex min-h-[132px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
                        Waiting for next customer
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}