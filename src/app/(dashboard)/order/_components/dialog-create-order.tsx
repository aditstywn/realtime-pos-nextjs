"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { OrderForm, orderFormSchema } from "@/validations/order-validation";
import { createOrder } from "../actions";
import {
  INITIAL_ORDER,
  INITIAL_STATE_ORDER,
  STATUS_CREATE_ORDER,
} from "@/constants/order-constant";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Table } from "@/validations/tables-validation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CardContent } from "@/components/ui/card";

export default function DialogCreateOrder({
  onSuccess,
  tables,
}: {
  onSuccess?: () => void;
  tables?: Table[] | undefined | null;
}) {
  const form = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: INITIAL_ORDER,
  });

  const [createOrderState, createOrderAction, isPendingCreateOrder] =
    useActionState(createOrder, INITIAL_STATE_ORDER);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createOrderAction(formData);
    });
  });

  useEffect(() => {
    if (createOrderState.status === "error") {
      toast.error("Create Order Failed", {
        description:
          createOrderState.errors?._form?.[0] || "Create Order failed",
      });
    }

    if (createOrderState.status === "success") {
      toast.success("Create Order Success", {
        description: "Create Order successfully",
      });
      form.reset();
      onSuccess?.();
    }
  }, [createOrderState]);

  return (
    <DialogContent className="sm:max-w-106.25 max-h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Create Order</DialogTitle>
        <DialogDescription>Add a new order from customer</DialogDescription>
      </DialogHeader>
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex flex-col flex-1 overflow-hidden"
      >
        {/* Bagian input yang bisa di-scroll */}
        <div className="overflow-y-auto flex-1 pr-1 px-1">
          <CardContent>
            <FieldGroup>
              <FormInput
                form={form}
                name="customer_name"
                label="Customer Name"
                placeholder="Insert customer name here"
              />
              <FormSelect
                form={form}
                name="table_id"
                label="Table"
                selectItem={(tables ?? []).map((table: Table) => ({
                  value: `${table.id}`,
                  label: `${table.name} - ${table.status} (${table.capacity})`,
                  disabled: table.status !== "available",
                }))}
              />
              <FormSelect
                form={form}
                name="status"
                label="Status"
                selectItem={STATUS_CREATE_ORDER}
              />
            </FieldGroup>
          </CardContent>
        </div>
        <DialogFooter className="mt-4 pt-3 border-t mb-1 mr-1">
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" disabled={isPendingCreateOrder}>
            {isPendingCreateOrder ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
