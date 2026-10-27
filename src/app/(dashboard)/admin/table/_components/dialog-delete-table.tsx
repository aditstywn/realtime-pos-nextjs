import DialogDelete from "@/components/common/dialog-delete";
import { startTransition, useActionState, useEffect } from "react";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";
import { deleteTable } from "../actions";
import { Table } from "@/validations/tables-validation";

export default function DialogDeleteTable({
  onSuccess,
  currentData,
  handleChanngeAction,
  open,
}: {
  onSuccess?: () => void;
  currentData?: Table;
  handleChanngeAction?: (open: boolean) => void;
  open?: boolean;
}) {
  const [deleteTableState, deleteTableAction, isPendingDeleteTable] =
    useActionState(deleteTable, INITIAL_STATE_ACTION);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteTableAction(formData);
    });
  };

  useEffect(() => {
    if (deleteTableState.status === "error") {
      toast.error("Delete Table Failed", {
        description:
          deleteTableState.errors?._form?.[0] || "Delete Table failed",
      });
    }

    if (deleteTableState.status === "success") {
      toast.success("Delete Table Success", {
        description: "Delete Table successfully",
      });
      handleChanngeAction?.(false);
      onSuccess?.();
    }
  }, [deleteTableState]);
  return (
    <DialogDelete
      open={open || false}
      onOpenChange={handleChanngeAction || (() => {})}
      title="Table"
      onSubmit={onSubmit}
      isLoading={isPendingDeleteTable}
    />
  );
}
