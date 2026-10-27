"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import FormUser from "./form-table";
import { TableForm, tableFormSchema } from "@/validations/tables-validation";
import { INITIAL_STATE_TABLE, INITIAL_TABLE } from "@/constants/table-constant";
import { createTable } from "../actions";

export default function DialogCreateTable({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const form = useForm<TableForm>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: INITIAL_TABLE,
  });

  const [createTableState, createTableAction, isPendingCreateTable] =
    useActionState(createTable, INITIAL_STATE_TABLE);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createTableAction(formData);
    });
  });

  useEffect(() => {
    if (createTableState.status === "error") {
      toast.error("Create Table Failed", {
        description:
          createTableState.errors?._form?.[0] || "Create Table failed",
      });
    }

    if (createTableState.status === "success") {
      toast.success("Create Table Success", {
        description: "Create Table successfully",
      });
      form.reset();
      onSuccess?.();
    }
  }, [createTableState]);

  return (
    <FormUser
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreateTable}
      type="Create"
      preview={preview}
      setPreview={setPreview}
    />
  );
}
