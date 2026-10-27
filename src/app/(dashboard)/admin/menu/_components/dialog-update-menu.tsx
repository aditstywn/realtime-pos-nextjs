"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import { Dialog } from "@/components/ui/dialog";
import FormMenu from "./form-menu";
import { Menu, MenuForm, menuFormSchema } from "@/validations/menu-validation";
import { updateMenu } from "../actions";
import { INITIAL_STATE_CREATE_MENU } from "@/constants/menu-constant";

export default function DialogUpdateMenu({
  onSuccess,
  currentData,
  handleChanngeAction,
  open,
}: {
  onSuccess?: () => void;
  currentData?: Menu;
  handleChanngeAction?: (open: boolean) => void;
  open?: boolean;
}) {
  const form = useForm<MenuForm>({
    resolver: zodResolver(menuFormSchema),
  });

  const [updateMenuState, updateMenuAction, isPendingUpdateMenu] =
    useActionState(updateMenu, INITIAL_STATE_CREATE_MENU);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    if (currentData?.image_url !== data.image_url) {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(
          key,
          key === "image_url" && value instanceof File
            ? preview!.file
            : String(value),
        );
      });

      formData.append("old_image_url", currentData?.image_url || "");
    } else {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value instanceof File ? value : String(value));
      });
    }

    formData.append("id", currentData?.id || "");

    startTransition(() => {
      updateMenuAction(formData);
    });
  });

  useEffect(() => {
    if (updateMenuState.status === "error") {
      toast.error("Update Menu Failed", {
        description: updateMenuState.errors?._form?.[0] || "Update Menu failed",
      });
    }

    if (updateMenuState.status === "success") {
      toast.success("Update Menu Success", {
        description: "Update Menu successfully",
      });
      form.reset();
      handleChanngeAction?.(false);
      onSuccess?.();
    }
  }, [updateMenuState]);

  useEffect(() => {
    if (currentData) {
      startTransition(() => {
        form.setValue("name", currentData.name);
        form.setValue("description", currentData.description);
        form.setValue("category", currentData.category);
        form.setValue("price", currentData.price.toString());
        form.setValue("discount", currentData.discount.toString());
        form.setValue("image_url", currentData.image_url);
        form.setValue(
          "is_available",
          String(currentData.is_available) as "true" | "false",
        );
        setPreview({
          file: new File([], currentData.image_url as string),
          displayUrl: currentData.image_url as string,
        });
      });
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChanngeAction}>
      <FormMenu
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateMenu}
        type="Update"
        preview={preview}
        setPreview={setPreview}
      />
    </Dialog>
  );
}
