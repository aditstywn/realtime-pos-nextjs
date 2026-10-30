import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createOrderTakeaway } from "../actions";
import { toast } from "sonner";
import {
  OrderTakeawayForm,
  orderTakeawayFormSchema,
} from "@/validations/order-validation";
import {
  INITIAL_ORDER_TAKEAWAY,
  INITIAL_STATE_ORDER_TAKEAWAY,
} from "@/constants/order-constant";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

export default function DialogCreateOrderTakeaway({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const form = useForm<OrderTakeawayForm>({
    resolver: zodResolver(orderTakeawayFormSchema),
    defaultValues: INITIAL_ORDER_TAKEAWAY,
  });

  const [createOrderState, createOrderAction, isPendingCreateOrder] =
    useActionState(createOrderTakeaway, INITIAL_STATE_ORDER_TAKEAWAY);

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
    if (createOrderState?.status === "error") {
      toast.error("Create Order Failed", {
        description: createOrderState.errors?._form?.[0],
      });
    }

    if (createOrderState?.status === "success") {
      toast.success("Create Order Success");
      form.reset();
      closeDialog();
    }
  }, [createOrderState]);

  return (
    <DialogContent className="sm:max-w-106.25 max-h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Create Order Takeaway</DialogTitle>
        <DialogDescription>Add a new order from customer</DialogDescription>
      </DialogHeader>
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex flex-col flex-1 overflow-hidden"
      >
        {/* Bagian input yang bisa di-scroll */}
        <div className="overflow-y-auto flex-1 pr-1 px-1 py-1">
          <CardContent>
            <FieldGroup>
              <FormInput
                form={form}
                name="customer_name"
                label="Customer Name"
                placeholder="Insert customer name here"
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
