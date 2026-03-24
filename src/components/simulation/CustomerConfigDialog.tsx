import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Users } from "lucide-react";
import type { Customer } from "@/types/simulation";
import { CustomerPanel } from "./CustomerPanel";

type CustomerConfigDialogProps = {
  customers: Customer[];
  isConfigLocked: boolean;
  onUpdateArrivalTime: (id: string, value: string) => void;
  onAddCustomer: () => void;
  onRemoveCustomer: (id: string) => void;
};

export function CustomerConfigDialog({
  customers,
  isConfigLocked,
  onUpdateArrivalTime,
  onAddCustomer,
  onRemoveCustomer,
}: CustomerConfigDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Settings className="h-4 w-4" />
          Configure Customers
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Configuration
          </DialogTitle>
          <DialogDescription>
            Set the arrivals for your classroom simulation before pressing Start.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pt-2 pr-2">
          <CustomerPanel
            customers={customers}
            isConfigLocked={isConfigLocked}
            onUpdateArrivalTime={onUpdateArrivalTime}
            onAddCustomer={onAddCustomer}
            onRemoveCustomer={onRemoveCustomer}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}