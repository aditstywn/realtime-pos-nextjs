"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import FormUser from "./form-menu";
import { createMenu } from "../actions";
import { MenuForm, menuFormSchema } from "@/validations/menu-validation";
import {
  INITIAL_CREATE_MENU,
  INITIAL_STATE_CREATE_MENU,
} from "@/constants/menu-constant";

export default function DialogCreateMenu({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const form = useForm<MenuForm>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: INITIAL_CREATE_MENU,
  });

  const [createMenuState, createMenuAction, isPendingCreateMenu] =
    useActionState(createMenu, INITIAL_STATE_CREATE_MENU);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(
        key,
        key === "image_url" && value instanceof File
          ? preview!.file
          : String(value),
      );
    });

    startTransition(() => {
      createMenuAction(formData);
    });
  });

  useEffect(() => {
    if (createMenuState.status === "error") {
      toast.error("Create Menu Failed", {
        description: createMenuState.errors?._form?.[0] || "Create Menu failed",
      });
    }

    if (createMenuState.status === "success") {
      toast.success("Create Menu Success", {
        description: "Create Menu successfully",
      });
      form.reset();
      onSuccess?.();
    }
  }, [createMenuState]);

  return (
    <FormUser
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreateMenu}
      type="Create"
      preview={preview}
      setPreview={setPreview}
    />
  );
}
