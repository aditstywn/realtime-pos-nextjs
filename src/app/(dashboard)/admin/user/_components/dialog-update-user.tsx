"use client";

import { INITIAL_STATE_UPDATE_USER } from "@/constants/auth-constant";
import {
  UpdateUserForm,
  updateUserSchema,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUser, updateUser } from "../actions";
import { Preview } from "@/types/general";
import FormUser from "./form-user";
import { Profile } from "@/types/auth";
import { Dialog } from "@/components/ui/dialog";

export default function DialogUpdateUser({
  onSuccess,
  currentData,
  handleChanngeAction,
  open,
}: {
  onSuccess?: () => void;
  currentData?: Profile;
  handleChanngeAction?: (open: boolean) => void;
  open?: boolean;
}) {
  const form = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
  });

  const [updateUserState, updateUserAction, isPendingUpdateUser] =
    useActionState(updateUser, INITIAL_STATE_UPDATE_USER);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    if (currentData?.avatar_url !== data.avatar_url) {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(
          key,
          key === "avatar_url" && value instanceof File ? preview!.file : value,
        );
      });

      formData.append("old_avatar_url", currentData?.avatar_url || "");
    } else {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    formData.append("id", currentData?.id || "");

    startTransition(() => {
      updateUserAction(formData);
    });
  });

  useEffect(() => {
    if (updateUserState.status === "error") {
      toast.error("Update User Failed", {
        description: updateUserState.errors?._form?.[0] || "Update User failed",
      });
    }

    if (updateUserState.status === "success") {
      toast.success("Update User Success", {
        description: "Update User successfully",
      });
      form.reset();
      handleChanngeAction?.(false);
      onSuccess?.();
    }
  }, [updateUserState]);

  useEffect(() => {
    if (currentData) {
      startTransition(() => {
        form.setValue("name", currentData.name as string);
        form.setValue("role", currentData.role as string);
        form.setValue("avatar_url", currentData.avatar_url as string);
        setPreview({
          file: new File([], currentData.avatar_url as string),
          displayUrl: currentData.avatar_url as string,
        });
      });
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChanngeAction}>
      <FormUser
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateUser}
        type="Update"
        preview={preview}
        setPreview={setPreview}
      />
    </Dialog>
  );
}
