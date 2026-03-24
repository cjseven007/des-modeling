export type CustomerStatus = "upcoming" | "queued" | "serving" | "completed";

export type Customer = {
  id: string;
  name: string;
  arrivalSeconds: number;
  status: CustomerStatus;
  queuedAt: number | null;
  serviceStartAt: number | null;
  serviceEndAt: number | null;
  operatorId: number | null;
  diceValue: number | null;
  serviceDuration: number | null;
};

export type Operator = {
  id: number;
  currentCustomerId: string | null;
  busyUntil: number | null;
};

export type SimulationState = "idle" | "running" | "paused" | "completed";