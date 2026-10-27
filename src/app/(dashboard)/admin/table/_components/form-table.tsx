import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { STATUS_TABLE_LIST } from "@/constants/table-constant";
import { Preview } from "@/types/general";
import { Loader2 } from "lucide-react";
import { SubmitEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormTable<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
  preview?: Preview;
  setPreview?: (preview: Preview | undefined) => void;
}) {
  return (
    <DialogContent className="sm:max-w-106.25 max-h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>{type} Table</DialogTitle>
        <DialogDescription>
          {type === "Create"
            ? "Add a new table to the system"
            : "Update table information"}
        </DialogDescription>
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
                name={"name" as Path<T>}
                label="Name"
                placeholder="Insert name here"
              />
              <FormInput
                form={form}
                name={"description" as Path<T>}
                label="Description"
                placeholder="Insert description here"
                type="textarea"
              />
              <FormInput
                form={form}
                name={"capacity" as Path<T>}
                label="Capacity"
                placeholder="Insert capacity here"
                type="number"
              />
              <FormSelect
                form={form}
                name={"status" as Path<T>}
                label="Status"
                selectItem={STATUS_TABLE_LIST}
              />
            </FieldGroup>
          </CardContent>
        </div>
        <DialogFooter className="mt-4 pt-3 border-t mb-1 mr-1">
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : type}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
