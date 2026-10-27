"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import { Dialog } from "@/components/ui/dialog";
import { updateTable } from "../actions";
import { INITIAL_STATE_TABLE } from "@/constants/table-constant";
import {
  Table,
  TableForm,
  tableFormSchema,
} from "@/validations/tables-validation";
import FormTable from "./form-table";

export default function DialogUpdateTable({
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
  const form = useForm<TableForm>({
    resolver: zodResolver(tableFormSchema),
  });

  const [updateTableState, updateTableAction, isPendingUpdateTable] =
    useActionState(updateTable, INITIAL_STATE_TABLE);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("id", currentData?.id || "");

    startTransition(() => {
      updateTableAction(formData);
    });
  });

  useEffect(() => {
    if (updateTableState.status === "error") {
      toast.error("Update Table Failed", {
        description:
          updateTableState.errors?._form?.[0] || "Update Table failed",
      });
    }

    if (updateTableState.status === "success") {
      toast.success("Update Table Success", {
        description: "Update Table successfully",
      });
      form.reset();
      handleChanngeAction?.(false);
      onSuccess?.();
    }
  }, [updateTableState]);

  useEffect(() => {
    if (currentData) {
      startTransition(() => {
        form.setValue("name", currentData.name);
        form.setValue("description", currentData.description);
        form.setValue("capacity", currentData.capacity.toString());
        form.setValue("status", currentData.status);
      });
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChanngeAction}>
      <FormTable
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateTable}
        type="Update"
        preview={preview}
        setPreview={setPreview}
      />
    </Dialog>
  );
}
