import type { Customer, CustomerStatus, Operator } from "@/types/simulation";

export function createCustomer(name: string, arrivalSeconds: number): Customer {
  return {
    id: name,
    name: `Customer ${name}`,
    arrivalSeconds,
    status: "upcoming",
    queuedAt: null,
    serviceStartAt: null,
    serviceEndAt: null,
    operatorId: null,
    diceValue: null,
    serviceDuration: null,
  };
}

export function createOperators(count: number): Operator[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    currentCustomerId: null,
    busyUntil: null,
  }));
}

export function resetCustomerForNewRun(customer: Customer): Customer {
  return {
    ...customer,
    status: "upcoming",
    queuedAt: null,
    serviceStartAt: null,
    serviceEndAt: null,
    operatorId: null,
    diceValue: null,
    serviceDuration: null,
  };
}

export function formatTime(totalSeconds: number | null) {
  if (totalSeconds === null || Number.isNaN(totalSeconds)) return "—";
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function getStatusBadgeVariant(
  status: CustomerStatus
): "secondary" | "default" | "destructive" | "outline" {
  switch (status) {
    case "upcoming":
      return "outline";
    case "queued":
      return "secondary";
    case "serving":
      return "default";
    case "completed":
      return "destructive";
  }
}

export function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

export function getNextCustomerId(customers: Customer[]) {
  const used = new Set(customers.map((c) => c.id));
  for (let i = 0; i < 26; i += 1) {
    const id = String.fromCharCode(65 + i);
    if (!used.has(id)) return id;
  }
  return `C${customers.length + 1}`;
}

export const DEFAULT_CUSTOMERS: Customer[] = [
  createCustomer("A", 10),
  createCustomer("B", 20),
  createCustomer("C", 28),
  createCustomer("D", 40),
  createCustomer("E", 55),
  createCustomer("F", 62),
  createCustomer("G", 75),
  createCustomer("H", 82),
  createCustomer("I", 90),
];