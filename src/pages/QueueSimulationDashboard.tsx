import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_CUSTOMERS,
  createCustomer,
  createOperators,
  formatTime,
  getNextCustomerId,
  resetCustomerForNewRun,
  rollDice,
} from "@/lib/simulation-utils";
import type { Customer, Operator, SimulationState } from "@/types/simulation";
import { HeaderBar } from "@/components/simulation/HeaderBar";
import { CustomerConfigDialog } from "@/components/simulation/CustomerConfigDialog";
import { LiveQueueSystem } from "@/components/simulation/LiveQueueSystem";
import { DataTablePanel } from "@/components/simulation/DataTablePanel";
import { ControlsPanel } from "@/components/simulation/ControlsPanel";
import { SummaryPanel } from "@/components/simulation/SummaryPanel";
import { EventLogPanel } from "@/components/simulation/EventLogPanel";
// import { ClassroomTipsPanel } from "@/components/simulation/ClassroomTipsPanel";

export default function QueueSimulationDashboard() {
  const [simulationState, setSimulationState] =
    useState<SimulationState>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [operatorsCount, setOperatorsCount] = useState(2);
  const [tickMs, setTickMs] = useState(1000);
  const [customers, setCustomers] = useState<Customer[]>(
    DEFAULT_CUSTOMERS.map((c) => ({ ...c }))
  );
  const [operators, setOperators] = useState<Operator[]>(createOperators(2));
  const [eventLog, setEventLog] = useState<string[]>([
    "Simulation ready. Press Start Simulation to begin.",
  ]);
  const [pendingRollOperatorId, setPendingRollOperatorId] = useState<number | null>(
    null
  );
  const [rollingDice, setRollingDice] = useState(false);
  const [maxQueueLength, setMaxQueueLength] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const customersRef = useRef<Customer[]>(customers);
  const operatorsRef = useRef<Operator[]>(operators);
  const pendingRollRef = useRef<number | null>(pendingRollOperatorId);

  useEffect(() => {
    customersRef.current = customers;
  }, [customers]);

  useEffect(() => {
    operatorsRef.current = operators;
  }, [operators]);

  useEffect(() => {
    pendingRollRef.current = pendingRollOperatorId;
  }, [pendingRollOperatorId]);

  const queue = useMemo(
    () =>
      customers
        .filter((customer) => customer.status === "queued")
        .sort((a, b) => a.arrivalSeconds - b.arrivalSeconds),
    [customers]
  );

  const upcomingCustomers = useMemo(
    () =>
      customers
        .filter((customer) => customer.status === "upcoming")
        .sort((a, b) => a.arrivalSeconds - b.arrivalSeconds),
    [customers]
  );

  const activeServices = useMemo(
    () => customers.filter((customer) => customer.status === "serving"),
    [customers]
  );

  const metrics = useMemo(() => {
    const completed = customers.filter((customer) => customer.status === "completed");

    const waitTimes = completed
      .map((customer) =>
        customer.serviceStartAt === null
          ? null
          : customer.serviceStartAt - customer.arrivalSeconds
      )
      .filter((value): value is number => value !== null);

    const serviceTimes = completed
      .map((customer) => customer.serviceDuration)
      .filter((value): value is number => value !== null);

    const avgWait = waitTimes.length
      ? Math.round(waitTimes.reduce((sum, value) => sum + value, 0) / waitTimes.length)
      : 0;

    const avgService = serviceTimes.length
      ? Math.round(
          serviceTimes.reduce((sum, value) => sum + value, 0) / serviceTimes.length
        )
      : 0;

    return {
      avgWait,
      avgService,
      completedCount: completed.length,
      queueLength: queue.length,
      activeCount: activeServices.length,
      maxArrival: Math.max(...customers.map((customer) => customer.arrivalSeconds), 0),
      maxQueueLength,
    };
  }, [customers, queue.length, activeServices.length, maxQueueLength]);

  useEffect(() => {
    if (simulationState === "idle") {
      setOperators(createOperators(operatorsCount));
      setPendingRollOperatorId(null);
      setRollingDice(false);
    }
  }, [operatorsCount, simulationState]);

  useEffect(() => {
    if (simulationState !== "running") {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setCurrentTime((prev) => prev + 1);
    }, tickMs);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [simulationState, tickMs]);

  useEffect(() => {
    if (simulationState !== "running") return;

    const currentCustomers = customersRef.current.map((c) => ({ ...c }));
    const currentOperators = operatorsRef.current.map((o) => ({ ...o }));
    const logEntries: string[] = [];

    for (const customer of currentCustomers) {
      if (customer.status === "upcoming" && customer.arrivalSeconds <= currentTime) {
        customer.status = "queued";
        customer.queuedAt = currentTime;
        logEntries.push(
          `${formatTime(currentTime)} — ${customer.name} arrived and joined the system.`
        );
      }
    }

    for (const operator of currentOperators) {
      if (
        operator.currentCustomerId &&
        operator.busyUntil !== null &&
        currentTime >= operator.busyUntil
      ) {
        const finishedCustomer = currentCustomers.find(
          (customer) => customer.id === operator.currentCustomerId
        );

        if (finishedCustomer) {
          finishedCustomer.status = "completed";
          finishedCustomer.serviceEndAt = currentTime;
          finishedCustomer.operatorId = operator.id;

          logEntries.push(
            `${formatTime(currentTime)} — ${finishedCustomer.name} completed service at Operator ${operator.id}.`
          );
        }

        operator.currentCustomerId = null;
        operator.busyUntil = null;
      }
    }

    if (pendingRollRef.current === null) {
      const queuedCustomers = currentCustomers
        .filter((customer) => customer.status === "queued")
        .sort((a, b) => a.arrivalSeconds - b.arrivalSeconds);

      const freeOperator = currentOperators.find(
        (operator) => operator.currentCustomerId === null
      );

      if (freeOperator && queuedCustomers.length > 0) {
        const selectedCustomer = queuedCustomers[0];

        selectedCustomer.status = "serving";
        selectedCustomer.serviceStartAt = currentTime;
        selectedCustomer.operatorId = freeOperator.id;
        freeOperator.currentCustomerId = selectedCustomer.id;

        logEntries.push(
          `${formatTime(currentTime)} — ${selectedCustomer.name} moved to Operator ${freeOperator.id}. Roll the dice to determine service time.`
        );

        setPendingRollOperatorId(freeOperator.id);
      }
    }

    const currentQueueLength = currentCustomers.filter(
      (customer) => customer.status === "queued"
    ).length;

    setMaxQueueLength((prev) => Math.max(prev, currentQueueLength));

    setCustomers(currentCustomers);
    setOperators(currentOperators);

    if (logEntries.length > 0) {
      setEventLog((prev) => [...logEntries.reverse(), ...prev].slice(0, 16));
    }
  }, [currentTime, simulationState]);

  useEffect(() => {
    if (simulationState !== "running") return;
    if (pendingRollOperatorId !== null) return;

    const allCompleted =
      customers.length > 0 &&
      customers.every((customer) => customer.status === "completed");

    if (allCompleted) {
      setSimulationState("completed");
      setEventLog((prev) => [
        `${formatTime(currentTime)} — Simulation completed.`,
        ...prev,
      ]);
    }
  }, [customers, currentTime, pendingRollOperatorId, simulationState]);

  const resetSimulationData = (nextState: SimulationState) => {
    setCurrentTime(0);
    setCustomers((prev) => prev.map((customer) => resetCustomerForNewRun(customer)));
    setOperators(createOperators(operatorsCount));
    setPendingRollOperatorId(null);
    setRollingDice(false);
    setSimulationState(nextState);
    setMaxQueueLength(0);
  };

  const startSimulation = () => {
    if (simulationState === "idle" || simulationState === "completed") {
      resetSimulationData("running");
      setEventLog(["00:00 — Simulation started."]);
      return;
    }

    setSimulationState("running");
    setEventLog((prev) =>
      [`${formatTime(currentTime)} — Simulation resumed.`, ...prev].slice(0, 16)
    );
  };

  const pauseSimulation = () => {
    setSimulationState("paused");
    setEventLog((prev) =>
      [`${formatTime(currentTime)} — Simulation paused.`, ...prev].slice(0, 16)
    );
  };

  const handleReset = () => {
    resetSimulationData("idle");
    setEventLog(["Simulation reset. Press Start Simulation to begin."]);
  };

  const handleRollDice = () => {
    if (pendingRollOperatorId === null || rollingDice) return;

    setRollingDice(true);

    window.setTimeout(() => {
      const value = rollDice();
      const serviceDuration = value * 10;

      const nextCustomers = customersRef.current.map((customer) => ({ ...customer }));
      const nextOperators = operatorsRef.current.map((operator) => ({ ...operator }));

      const servingOperator = nextOperators.find(
        (operator) => operator.id === pendingRollOperatorId
      );

      if (!servingOperator?.currentCustomerId) {
        setRollingDice(false);
        return;
      }

      const currentCustomer = nextCustomers.find(
        (customer) => customer.id === servingOperator.currentCustomerId
      );

      if (!currentCustomer) {
        setRollingDice(false);
        return;
      }

      currentCustomer.diceValue = value;
      currentCustomer.serviceDuration = serviceDuration;
      servingOperator.busyUntil = currentTime + serviceDuration;

      setCustomers(nextCustomers);
      setOperators(nextOperators);

      setEventLog((prev) =>
        [
          `${formatTime(currentTime)} — Operator ${pendingRollOperatorId} rolled ${value}. ${currentCustomer.name} will be served for ${serviceDuration}s.`,
          ...prev,
        ].slice(0, 16)
      );

      setPendingRollOperatorId(null);
      setRollingDice(false);
    }, 1200);
  };

  const updateArrivalTime = (id: string, value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) return;
    if (simulationState !== "idle") return;

    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              arrivalSeconds: parsed,
            }
          : customer
      )
    );
  };

  const addCustomer = () => {
    if (simulationState !== "idle") return;

    setCustomers((prev) => {
      const nextId = getNextCustomerId(prev);
      const lastArrival =
        prev.length > 0 ? Math.max(...prev.map((c) => c.arrivalSeconds)) : 0;
      return [...prev, createCustomer(nextId, lastArrival + 10)];
    });
  };

  const removeCustomer = (id: string) => {
    if (simulationState !== "idle") return;
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  const isConfigLocked =
    simulationState === "running" ||
    simulationState === "paused" ||
    simulationState === "completed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 p-4 text-slate-900 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <HeaderBar simulationState={simulationState} currentTime={currentTime} />

        <div className="flex items-center justify-between gap-3">

          <CustomerConfigDialog
            customers={customers}
            isConfigLocked={isConfigLocked}
            onUpdateArrivalTime={updateArrivalTime}
            onAddCustomer={addCustomer}
            onRemoveCustomer={removeCustomer}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
          <div className="min-w-0 space-y-6">
            <LiveQueueSystem
              upcomingCustomers={upcomingCustomers}
              queue={queue}
              operators={operators}
              customers={customers}
              operatorsCount={operatorsCount}
              pendingRollOperatorId={pendingRollOperatorId}
              currentTime={currentTime}
              onRollDice={handleRollDice}
              rollingDice={rollingDice}
            />
            <DataTablePanel customers={customers} />
          </div>

          <div className="min-w-0 space-y-6">
            <ControlsPanel
              currentTime={currentTime}
              simulationState={simulationState}
              operatorsCount={operatorsCount}
              tickMs={tickMs}
              isConfigLocked={isConfigLocked}
              onStart={startSimulation}
              onPause={pauseSimulation}
              onReset={handleReset}
              setOperatorsCount={setOperatorsCount}
              setTickMs={setTickMs}
            />
            <SummaryPanel metrics={metrics} />
            <EventLogPanel eventLog={eventLog} />
            {/* <ClassroomTipsPanel /> */}
          </div>
        </div>
      </div>
    </div>
  );
}